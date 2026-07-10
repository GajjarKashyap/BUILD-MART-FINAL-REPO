// db.js - Browser Storage Database Manager

const DB_KEY = 'buildmart_db';

class Database {
    constructor() {
        this.init();
    }

    init() {
        if (!localStorage.getItem(DB_KEY)) {
            const initialData = {
                metadata: { project: "BUILD MART", last_serial_id: 1000000 },
                products: []
            };
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(DB_KEY));
        } catch(e) {
            console.error("Failed to parse DB", e);
            return { metadata: { last_serial_id: 1000000 }, products: [] };
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("Failed to save DB (might be full)", e);
            alert("Warning: Browser storage might be full. Please export your data.");
            return false;
        }
    }

    // --- Stats ---
    getStats() {
        const data = this.getData();
        const products = data.products || [];
        
        let totalImages = 0;
        const brands = new Set();
        const categories = {};
        const today = new Date().toISOString().split('T')[0];
        let todayCount = 0;

        products.forEach(p => {
            if (p.images && p.images.amazon) totalImages += p.images.amazon.length;
            if (p.brand && p.brand.display) brands.add(p.brand.display);
            else if (p.brand) brands.add(p.brand);

            if (p.category) {
                if (!categories[p.category]) categories[p.category] = {};
                const subCat = p.subcategory || 'Uncategorized';
                if (!categories[p.category][subCat]) categories[p.category][subCat] = 0;
                categories[p.category][subCat]++;
            }
            if (p.created_at && p.created_at.startsWith(today)) todayCount++;
        });

        const recentProducts = [...products].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 5);

        return {
            totalProducts: products.length, 
            totalImages, 
            totalBrands: brands.size,
            todayCount, 
            categories, 
            recentProducts
        };
    }

    // --- Products ---
    getProducts(options = {}) {
        const { search, category, brand, status, page = 1, limit = 50 } = options;
        const data = this.getData();
        let products = data.products || [];
        products.reverse(); // Newest first

        if (category) products = products.filter(p => p.category === category);
        if (status) products = products.filter(p => p.status === status);
        if (brand) products = products.filter(p => (p.brand?.display || p.brand || '').toLowerCase() === brand.toLowerCase());
        
        if (search) {
            const s = search.toLowerCase();
            products = products.filter(p => 
                (p.name || '').toLowerCase().includes(s) ||
                (p.sku || '').toLowerCase().includes(s) ||
                (p.brand?.display || p.brand || '').toLowerCase().includes(s)
            );
        }

        const total = products.length;
        const start = (page - 1) * limit;
        const paginated = products.slice(start, start + parseInt(limit));

        return { products: paginated, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) };
    }

    getAllProducts() {
        return this.getData().products || [];
    }

    getProduct(sku) {
        const data = this.getData();
        return data.products.find(p => p.sku === sku);
    }

    getLatestProduct() {
        const data = this.getData();
        return data.products.length > 0 ? data.products[data.products.length - 1] : null;
    }

    getNewSerialId() {
        const data = this.getData();
        data.metadata.last_serial_id += 1;
        this.saveData(data);
        return data.metadata.last_serial_id;
    }

    checkSkuExists(sku) {
        const data = this.getData();
        return data.products.some(p => p.sku === sku);
    }

    generateSku(category, subcategory) {
        const CATEGORY_CODES = { "Power Tools": "PT", "Hand Tools": "HT", "Tools & Accessories": "TA", "Adhesives & Consumables": "AC" };
        const SUBCATEGORY_CODES = {
            "Drill Machines": "DR", "Angle Grinders": "AG", "Circular Saws": "CS", "Jigsaws": "JS", 
            "Rotary Hammers": "RH", "Impact Drivers": "ID", "Sanders": "SD", "Heat Guns": "HG", 
            "Electric Screwdrivers": "ES", "Polishers": "PL",
            "Hammers": "HM", "Screwdrivers": "SC", "Pliers": "PR", "Wrenches": "WR", "Spanners": "SP", 
            "Chisels": "CH", "Measuring Tapes": "MT", "Utility Knives": "UK", "Clamps": "CL", "Spirit Levels": "SL",
            "Drill Bits": "DB", "Screwdriver Bits": "SB", "Saw Blades": "SW", "Grinding Wheels": "GW", 
            "Cutting Discs": "CD", "Sanding Discs": "SD", "Hole Saws": "HS", "Router Bits": "RB", 
            "Wire Brushes": "WB", "Polishing Pads": "PP",
            "Wood Glue": "WG", "Epoxy Adhesives": "EA", "Silicone Sealants": "SS", "Masking Tape": "MT", 
            "Double-Sided Tape": "DT", "Lubricants": "LB", "Cleaning Sprays": "CS", "Thread Seal Tape": "TS", 
            "Putty": "PT", "Wood Fillers": "WF"
        };
        const catCode = CATEGORY_CODES[category];
        const subcatFixed = subcategory === "Double Sided Tape" ? "Double-Sided Tape" : subcategory;
        const subCode = SUBCATEGORY_CODES[subcatFixed];
        
        if (!catCode || !subCode) return null;
        const prefix = `BM-${catCode}-${subCode}-`;
        
        const data = this.getData();
        let maxNum = 0;
        data.products.forEach(p => {
            if (p.sku && p.sku.startsWith(prefix)) {
                const num = parseInt(p.sku.split('-')[3], 10);
                if (!isNaN(num) && num > maxNum) maxNum = num;
            }
        });
        return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
    }

    getFieldValues() {
        const data = this.getData();
        const recent = [...data.products].reverse();
        
        const getTop = (fn, limit = 5) => {
            const counts = {};
            recent.forEach(p => {
                const val = fn(p);
                if (val && val.trim()) counts[val] = (counts[val] || 0) + 1;
            });
            return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, limit).map(e => e[0]);
        };

        return {
            brands: getTop(p => p.brand?.display || p.brand || '', 10),
            materials: getTop(p => p.additional_info?.material || '', 8),
            weights: getTop(p => p.additional_info?.weight || '', 8),
            countries: getTop(p => p.additional_info?.country_of_origin || '', 8),
            warranties: getTop(p => p.warranty_period || '', 5)
        };
    }

    saveProduct(p, isEdit = false, originalSku = null) {
        const data = this.getData();
        
        const newProduct = {
            product_serial_id: parseInt(p.product_serial_id, 10),
            sku: p.sku,
            category: p.category,
            subcategory: p.subcategory,
            name: p.name,
            brand: { display: p.brand, normalized: p.brand?.trim().toLowerCase() },
            status: p.status || 'Draft',
            completeness_score: parseInt(p.completeness_score || 0, 10),
            price: {
                mrp: parseFloat(p.mrp),
                selling_price: parseFloat(p.price),
                discount_percent: parseFloat(p.discount_percent) || 0
            },
            stock_quantity: parseInt(p.stock_quantity, 10),
            short_description: p.short_description || "",
            features: p.features ? (typeof p.features === 'string' ? JSON.parse(p.features) : p.features) : [],
            specifications: p.specifications ? (typeof p.specifications === 'string' ? JSON.parse(p.specifications) : p.specifications) : [],
            additional_info: {
                material: p.material || "",
                weight: p.weight || "",
                country_of_origin: p.country_of_origin || ""
            },
            warranty_period: p.warranty_period || "",
            warranty_type: p.warranty_type || "",
            box_items: p.box_items ? (typeof p.box_items === 'string' ? JSON.parse(p.box_items) : p.box_items) : [],
            images: {
                amazon: p.amazon_images ? (typeof p.amazon_images === 'string' ? JSON.parse(p.amazon_images) : p.amazon_images) : []
            },
            amazon_url: p.amazon_url || "",
            updated_at: new Date().toISOString()
        };

        if (isEdit) {
            let index = -1;
            if (typeof originalSku !== 'undefined' && originalSku) {
                index = data.products.findIndex(x => x.sku === originalSku);
            }
            if (index === -1) {
                index = data.products.findIndex(x => x.sku === p.sku);
            }
            if (index === -1) {
                newProduct.created_at = new Date().toISOString();
                data.products.push(newProduct);
            } else {
                newProduct.created_at = data.products[index].created_at || new Date().toISOString();
                data.products[index] = newProduct;
            }
        } else {
            if (data.products.some(x => x.sku === p.sku)) {
                throw new Error("SKU already exists");
            }
            newProduct.created_at = new Date().toISOString();
            data.products.push(newProduct);
        }

        this.saveData(data);
        return newProduct;
    }
}

// Global instance
window.db = new Database();
