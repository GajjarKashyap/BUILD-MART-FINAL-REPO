(function () {
    'use strict';

    const SDK_VERSION = '12.16.0';
    const config = window.BUILDMART_FIREBASE_CONFIG;
    const ownerUid = window.BUILDMART_FIREBASE_OWNER_UID;
    const adminUids = Array.isArray(window.BUILDMART_FIREBASE_ADMIN_UIDS)
        ? window.BUILDMART_FIREBASE_ADMIN_UIDS
        : [ownerUid];
    const state = {
        phase: 'loading',
        message: 'Connecting to Firebase…',
        user: null,
        remoteProductCount: null,
        remoteEmpty: false,
        lastError: '',
        lastWriteAt: '',
        database: null
    };
    const pendingWrites = new Set();
    let firebaseApp;
    let firebaseAuth;
    let firestoreDb;
    let appApi;
    let authApi;
    let firestoreApi;
    let unsubscribeProducts;
    let unsubscribeMeta;
    let remoteMetadata = null;
    let hydrating = false;
    let suppressRemoteWrite = 0;
    let originals = null;

    function emitStatus(patch) {
        Object.assign(state, patch);
        window.dispatchEvent(new CustomEvent('buildmart-firebase-status', {
            detail: { ...state }
        }));
    }

    function clean(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function productDocumentId(sku) {
        const bytes = new TextEncoder().encode(String(sku || ''));
        let binary = '';
        bytes.forEach(byte => { binary += String.fromCharCode(byte); });
        return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function isOwner(user = state.user) {
        return Boolean(user && adminUids.includes(user.uid));
    }

    function requireOwner() {
        if (!isOwner()) {
            throw new Error('Sign in with an authorized BuildMart administrator account before changing catalog data.');
        }
    }

    async function initialize() {
        if (!config || !config.apiKey || !config.projectId || !adminUids.length) {
            throw new Error('Firebase configuration is incomplete.');
        }
        [appApi, authApi, firestoreApi] = await Promise.all([
            import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app.js`),
            import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth.js`),
            import(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-firestore.js`)
        ]);
        firebaseApp = appApi.getApps().length ? appApi.getApp() : appApi.initializeApp(config);
        firebaseAuth = authApi.getAuth(firebaseApp);
        await authApi.setPersistence(firebaseAuth, authApi.browserSessionPersistence);
        firestoreDb = firestoreApi.initializeFirestore(firebaseApp, {
            localCache: firestoreApi.memoryLocalCache()
        });

        authApi.onAuthStateChanged(firebaseAuth, user => {
            state.user = user || null;
            emitStatus({
                user: user || null,
                phase: state.remoteProductCount == null ? 'loading' : 'ready',
                message: user
                    ? (isOwner(user) ? 'Firebase administrator connected' : 'Signed-in account is not a BuildMart administrator')
                    : 'Public Firebase catalog connected'
            });
            window.dispatchEvent(new CustomEvent('buildmart-auth-changed', { detail: { user } }));
        });

        emitStatus({ phase: 'ready', message: 'Firebase connected' });
        if (state.database) subscribeToCatalog();
        return { app: firebaseApp, auth: firebaseAuth, firestore: firestoreDb };
    }

    const ready = initialize().catch(error => {
        console.error('Firebase initialization failed:', error);
        emitStatus({ phase: 'error', message: 'Firebase connection failed', lastError: error.message });
        throw error;
    });

    async function signIn(email, password) {
        await ready;
        const credential = await authApi.signInWithEmailAndPassword(firebaseAuth, email, password);
        if (!isOwner(credential.user)) {
            await authApi.signOut(firebaseAuth);
            throw new Error('This Firebase account is not authorized to manage BuildMart.');
        }
        return credential.user;
    }

    async function signOut() {
        await ready;
        await authApi.signOut(firebaseAuth);
    }

    function currentUser() {
        return firebaseAuth?.currentUser || state.user || null;
    }

    function updateLocalCache(products, metadata) {
        if (!state.database || !originals) return;
        const current = originals.getData();
        const next = {
            ...current,
            metadata: {
                ...(current.metadata || {}),
                ...(metadata || {}),
                firebase: {
                    project_id: config.projectId,
                    hydrated_at: new Date().toISOString(),
                    product_count: products.length
                }
            },
            products
        };
        hydrating = true;
        try {
            originals.saveData(next);
        } finally {
            hydrating = false;
        }
        setTimeout(refreshKnownPage, 0);
    }

    function refreshKnownPage() {
        ['fetchStats', 'loadProducts', 'initStore', 'runQualityCheck', 'loadCatalogTree']
            .forEach(name => {
                try {
                    if (typeof window[name] === 'function') window[name]();
                } catch (error) {
                    console.warn(`Firebase refresh skipped for ${name}:`, error);
                }
            });
    }

    async function subscribeToCatalog() {
        await ready;
        if (!state.database || unsubscribeProducts) return;
        const productsRef = firestoreApi.collection(firestoreDb, 'products');
        const metaRef = firestoreApi.doc(firestoreDb, 'catalog_meta', 'main');

        unsubscribeMeta = firestoreApi.onSnapshot(metaRef, snapshot => {
            remoteMetadata = snapshot.exists() ? snapshot.data() : null;
            if (state.remoteProductCount != null && state.remoteProductCount > 0) {
                updateLocalCache(state.database.getAllProducts(), remoteMetadata);
            }
        }, error => {
            console.error('Firebase metadata subscription failed:', error);
            emitStatus({ phase: 'error', lastError: error.message, message: 'Could not read Firebase metadata' });
        });

        unsubscribeProducts = firestoreApi.onSnapshot(productsRef, snapshot => {
            const products = snapshot.docs.map(document => document.data());
            state.remoteProductCount = products.length;
            state.remoteEmpty = products.length === 0;
            emitStatus({
                phase: 'ready',
                remoteProductCount: products.length,
                remoteEmpty: products.length === 0,
                lastError: '',
                message: products.length
                    ? `${products.length} products live in Firebase`
                    : 'Firebase is empty — import the protected Git backup once'
            });
            if (products.length) updateLocalCache(products, remoteMetadata);
            window.dispatchEvent(new CustomEvent('buildmart-firebase-catalog', {
                detail: { productCount: products.length, empty: products.length === 0 }
            }));
        }, error => {
            console.error('Firebase product subscription failed:', error);
            emitStatus({ phase: 'error', lastError: error.message, message: 'Could not read Firebase products' });
        });
    }

    function trackWrite(promise) {
        const tracked = Promise.resolve(promise)
            .then(value => {
                emitStatus({
                    phase: 'ready',
                    lastError: '',
                    lastWriteAt: new Date().toISOString(),
                    message: 'Catalog saved to Firebase'
                });
                return { ok: true, value };
            })
            .catch(error => {
                console.error('Firebase write failed:', error);
                emitStatus({ phase: 'error', lastError: error.message, message: 'Firebase save failed' });
                return { ok: false, error };
            })
            .finally(() => pendingWrites.delete(tracked));
        pendingWrites.add(tracked);
        return tracked;
    }

    async function waitForWrites() {
        const results = await Promise.all([...pendingWrites]);
        const failed = results.find(result => !result.ok);
        if (failed) throw failed.error;
        return true;
    }

    function auditRef() {
        return firestoreApi.doc(firestoreApi.collection(firestoreDb, 'audit_log'));
    }

    async function upsertProduct(product, originalSku = '') {
        await ready;
        requireOwner();
        const safeProduct = clean(product);
        const batch = firestoreApi.writeBatch(firestoreDb);
        const productRef = firestoreApi.doc(firestoreDb, 'products', productDocumentId(safeProduct.sku));
        batch.set(productRef, safeProduct);
        if (originalSku && originalSku !== safeProduct.sku) {
            const oldRef = firestoreApi.doc(firestoreDb, 'products', productDocumentId(originalSku));
            batch.delete(oldRef);
        }
        batch.set(auditRef(), {
            action: originalSku ? 'product_update' : 'product_create',
            sku: safeProduct.sku,
            previous_sku: originalSku || null,
            actor_uid: state.user.uid,
            created_at: firestoreApi.serverTimestamp()
        });
        batch.set(firestoreApi.doc(firestoreDb, 'catalog_meta', 'main'), {
            last_product_sku: safeProduct.sku,
            last_updated_at: firestoreApi.serverTimestamp()
        }, { merge: true });
        await batch.commit();
    }

    async function archiveProduct(product) {
        await ready;
        requireOwner();
        if (!product?.sku) throw new Error('Cannot archive a product without an SKU.');
        const safeProduct = clean(product);
        const batch = firestoreApi.writeBatch(firestoreDb);
        const id = productDocumentId(safeProduct.sku);
        batch.set(firestoreApi.doc(firestoreDb, 'archived_products', id), {
            ...safeProduct,
            archived_at: new Date().toISOString(),
            archived_by: state.user.uid
        });
        batch.delete(firestoreApi.doc(firestoreDb, 'products', id));
        batch.set(auditRef(), {
            action: 'product_archive',
            sku: safeProduct.sku,
            actor_uid: state.user.uid,
            created_at: firestoreApi.serverTimestamp()
        });
        await batch.commit();
    }

    async function saveTaxonomy(taxonomy, metadata = {}) {
        await ready;
        requireOwner();
        await firestoreApi.setDoc(
            firestoreApi.doc(firestoreDb, 'catalog_meta', 'main'),
            {
                ...clean(metadata),
                category_taxonomy: clean(taxonomy),
                last_updated_at: firestoreApi.serverTimestamp()
            },
            { merge: true }
        );
    }

    async function replaceCatalog(data, reason = 'catalog_replace') {
        await ready;
        requireOwner();
        if (!data || !Array.isArray(data.products)) throw new Error('Invalid catalog dataset.');
        const skuSet = new Set();
        data.products.forEach((product, index) => {
            const sku = String(product?.sku || '').trim();
            if (!sku) throw new Error(`Product ${index + 1} has no SKU.`);
            if (skuSet.has(sku)) throw new Error(`Duplicate SKU found: ${sku}.`);
            skuSet.add(sku);
        });

        const existing = await firestoreApi.getDocs(firestoreApi.collection(firestoreDb, 'products'));
        const writes = [];
        data.products.forEach(product => {
            writes.push({
                type: 'set',
                ref: firestoreApi.doc(firestoreDb, 'products', productDocumentId(product.sku)),
                data: clean(product)
            });
        });
        existing.docs.forEach(document => {
            const product = document.data();
            if (!skuSet.has(product.sku)) {
                writes.push({
                    type: 'set',
                    ref: firestoreApi.doc(firestoreDb, 'archived_products', document.id),
                    data: { ...product, archived_at: new Date().toISOString(), archived_by: state.user.uid }
                });
                writes.push({ type: 'delete', ref: document.ref });
            }
        });

        for (let offset = 0; offset < writes.length; offset += 440) {
            const batch = firestoreApi.writeBatch(firestoreDb);
            writes.slice(offset, offset + 440).forEach(write => {
                if (write.type === 'delete') batch.delete(write.ref);
                else batch.set(write.ref, write.data);
            });
            await batch.commit();
        }

        const metaBatch = firestoreApi.writeBatch(firestoreDb);
        metaBatch.set(firestoreApi.doc(firestoreDb, 'catalog_meta', 'main'), {
            ...clean(data.metadata || {}),
            product_count: data.products.length,
            last_updated_at: firestoreApi.serverTimestamp(),
            source: reason
        }, { merge: true });
        metaBatch.set(auditRef(), {
            action: reason,
            product_count: data.products.length,
            actor_uid: state.user.uid,
            created_at: firestoreApi.serverTimestamp()
        });
        await metaBatch.commit();
        return data.products.length;
    }

    async function importGitBackup() {
        await ready;
        requireOwner();
        const remoteSnapshot = await firestoreApi.getDocs(
            firestoreApi.collection(firestoreDb, 'products')
        );
        if (!remoteSnapshot.empty) {
            throw new Error(`Firebase already contains ${remoteSnapshot.size} products. Import is locked to prevent accidental replacement.`);
        }
        const sources = [
            `buildmart_backup_2026-07-19.json?v=${Date.now()}`,
            `https://raw.githubusercontent.com/GajjarKashyap/BUILD-MART-FINAL-REPO/main/buildmart_backup_2026-07-19.json?v=${Date.now()}`
        ];
        let response;
        for (const source of sources) {
            try {
                const candidate = await fetch(source, { cache: 'no-store' });
                if (candidate.ok) {
                    response = candidate;
                    break;
                }
            } catch (_) {
                // Try the protected GitHub backup fallback.
            }
        }
        if (!response) throw new Error('Could not read the protected Git backup.');
        const data = await response.json();
        const count = await replaceCatalog(data, 'initial_git_backup_import');
        hydrating = true;
        try {
            originals.saveData(data);
        } finally {
            hydrating = false;
        }
        return count;
    }

    function attachDatabase(database) {
        if (!database || state.database) return;
        state.database = database;
        originals = {
            getData: database.getData.bind(database),
            saveData: database.saveData.bind(database),
            saveProduct: database.saveProduct.bind(database),
            deleteProduct: database.deleteProduct.bind(database),
            saveCategoryTaxonomy: database.saveCategoryTaxonomy.bind(database),
            standardizeAllProducts: database.standardizeAllProducts.bind(database)
        };

        database.saveData = function (data) {
            const result = originals.saveData(data);
            if (!hydrating && suppressRemoteWrite === 0) trackWrite(replaceCatalog(data, 'catalog_editor_save'));
            return result;
        };

        database.saveProduct = function (product, isEdit = false, originalSku = null) {
            suppressRemoteWrite++;
            let saved;
            try {
                saved = originals.saveProduct(product, isEdit, originalSku);
            } finally {
                suppressRemoteWrite--;
            }
            trackWrite(upsertProduct(saved, isEdit ? originalSku : ''));
            return saved;
        };

        database.deleteProduct = function (sku) {
            const product = originals.getData().products.find(item => item.sku === sku);
            suppressRemoteWrite++;
            try {
                originals.deleteProduct(sku);
            } finally {
                suppressRemoteWrite--;
            }
            if (product) trackWrite(archiveProduct(product));
        };

        database.saveCategoryTaxonomy = function (taxonomy) {
            suppressRemoteWrite++;
            try {
                originals.saveCategoryTaxonomy(taxonomy);
            } finally {
                suppressRemoteWrite--;
            }
            trackWrite(saveTaxonomy(taxonomy, originals.getData().metadata));
        };

        database.standardizeAllProducts = function () {
            suppressRemoteWrite++;
            let count;
            try {
                count = originals.standardizeAllProducts();
            } finally {
                suppressRemoteWrite--;
            }
            trackWrite(replaceCatalog(originals.getData(), 'standardize_all_products'));
            return count;
        };

        database.waitForFirebaseWrites = waitForWrites;
        database.importGitBackupToFirebase = () => trackWrite(importGitBackup()).then(result => {
            if (!result.ok) throw result.error;
            return result.value;
        });
        database.getFirebaseStatus = () => ({ ...state });
        subscribeToCatalog();
    }

    window.BuildMartFirebase = {
        attachDatabase,
        currentUser,
        getStatus: () => ({ ...state }),
        importGitBackup,
        isOwner,
        ready,
        signIn,
        signOut,
        waitForWrites
    };
    window.dispatchEvent(new CustomEvent('buildmart-firebase-adapter-ready'));
})();
