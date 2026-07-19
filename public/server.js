const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');
const { Parser } = require('json2csv');
const extract = require('extract-zip');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Data file path
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'products');

// Ensure directories and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        metadata: { project: "BUILD MART", last_serial_id: 1000000 },
        products: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
}

// Multer storage configs
const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const serialId = req.body.product_serial_id;
        if (!serialId) return cb(new Error("product_serial_id required"));
        const dir = path.join(UPLOADS_DIR, String(serialId));
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + ext);
    }
});
const uploadProduct = multer({ storage: productStorage });

const restoreStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'temp');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, 'backup.zip')
});
const uploadRestore = multer({ storage: restoreStorage });

const CATEGORY_CODES = {
    "Power Tools": "PT", "Hand Tools": "HT", "Tools & Accessories": "TA",
    "Fasteners & Small Hardware": "FH", "Wood Glues & Adhesives": "AD"
};
const SUBCATEGORY_CODES = {
    "Drill Machines": "DR", "Angle Grinders": "AG", "Circular Saws": "CS", "Jigsaws": "JS", 
    "Rotary Hammers": "RH", "Impact Drivers": "ID", "Sanders": "SD", "Heat Guns": "HG", 
    "Electric Screwdrivers": "ES", "Polishers": "PL",
    "Hammers": "HM", "Screwdrivers": "SC", "Pliers": "PR", "Wrenches": "WR", "Spanners": "SP", 
    "Chisels": "CH", "Measuring Tapes": "MT", "Utility Knives": "UK", "Clamps": "CL", "Spirit Levels": "SL",
    "Drill Bits": "DB", "Screwdriver Bits": "SB", "Saw Blades": "SW", "Grinding Wheels": "GW", 
    "Cutting Discs": "CD", "Sanding Discs": "SD", "Hole Saws": "HS", "Router Bits": "RB", 
    "Wire Brushes": "WB", "Polishing Pads": "PP",
    "Screws": "SC", "Nails": "NL", "Nuts": "NT", "Bolts": "BL", "Washers": "WS",
    "Wall Plugs & Anchors": "WA", "Rivets": "RV", "Staples": "ST", "Hooks & Eyes": "HE", "Pins & Clips": "PC",
    "Wood Glues": "WG", "General Adhesives": "GA", "PVA Adhesives": "PV",
    "Epoxy Adhesives": "EA", "Contact Adhesives": "CA", "Construction Adhesives": "CO", "Instant Adhesives": "IA"
};

// -----------------------------------------------------
// GET STATS
// -----------------------------------------------------
app.get('/api/stats', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const products = data.products || [];
        
        let totalImages = 0;
        const brands = new Set();
        const categories = {};
        const today = new Date().toISOString().split('T')[0];
        let todayCount = 0;

        products.forEach(p => {
            if (p.images) {
                if (p.images.local) totalImages += p.images.local.length;
                if (p.images.amazon) totalImages += p.images.amazon.length;
            }
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

        res.json({
            totalProducts: products.length, totalImages, totalBrands: brands.size,
            todayCount, categories, recentProducts
        });
    } catch (error) { res.status(500).json({ error: "Failed to load stats" }); }
});

// -----------------------------------------------------
// PRODUCT APIS
// -----------------------------------------------------
app.get('/api/products', (req, res) => {
    try {
        const { search, category, brand, status, page = 1, limit = 50 } = req.query;
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        let products = data.products || [];

        // Reverse to show newest first
        products.reverse();

        // Filters
        if (category) products = products.filter(p => p.category === category);
        if (status) products = products.filter(p => p.status === status);
        if (brand) products = products.filter(p => (p.brand?.display || p.brand || '').toLowerCase() === brand.toLowerCase());
        
        // Search
        if (search) {
            const s = search.toLowerCase();
            products = products.filter(p => 
                (p.name || '').toLowerCase().includes(s) ||
                (p.sku || '').toLowerCase().includes(s) ||
                (p.brand?.display || p.brand || '').toLowerCase().includes(s)
            );
        }

        // Pagination
        const total = products.length;
        const start = (page - 1) * limit;
        const paginated = products.slice(start, start + parseInt(limit));

        res.json({ products: paginated, total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });
    } catch (error) { res.status(500).json({ error: "Failed to load products" }); }
});

app.get('/api/products/new-id', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        data.metadata.last_serial_id += 1;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ product_serial_id: data.metadata.last_serial_id });
    } catch (error) { res.status(500).json({ error: "Failed to generate ID" }); }
});

app.get('/api/products/check-sku', (req, res) => {
    try {
        const { sku } = req.query;
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const exists = data.products.some(p => p.sku === sku);
        res.json({ exists, valid: !exists });
    } catch (error) { res.status(500).json({ error: "Failed to check SKU" }); }
});

app.get('/api/products/generate-sku', (req, res) => {
    try {
        const { category, subcategory } = req.query;
        const catCode = CATEGORY_CODES[category];
        const subcatFixed = subcategory === "Double Sided Tape" ? "Double-Sided Tape" : subcategory;
        const subCode = SUBCATEGORY_CODES[subcatFixed];
        
        if (!catCode || !subCode) return res.status(400).json({ error: "Invalid category or subcategory" });
        const prefix = `BM-${catCode}-${subCode}-`;
        
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        let maxNum = 0;
        data.products.forEach(p => {
            if (p.sku && p.sku.startsWith(prefix)) {
                const num = parseInt(p.sku.split('-')[3], 10);
                if (!isNaN(num) && num > maxNum) maxNum = num;
            }
        });
        res.json({ sku: `${prefix}${String(maxNum + 1).padStart(4, '0')}` });
    } catch (error) { res.status(500).json({ error: "Failed to generate SKU" }); }
});

app.get('/api/products/:sku', (req, res, next) => {
    try {
        if (['new-id', 'check-sku', 'generate-sku', 'field-values', 'latest'].includes(req.params.sku)) return next();
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const product = data.products.find(p => p.sku === req.params.sku);
        if (product) res.json(product);
        else res.status(404).json({ error: "Product not found" });
    } catch (error) { res.status(500).json({ error: "Failed to get product" }); }
});

app.get('/api/products/field-values', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const recent = [...data.products].reverse();
        
        const getTop = (fn, limit = 5) => {
            const counts = {};
            recent.forEach(p => {
                const val = fn(p);
                if (val && val.trim()) counts[val] = (counts[val] || 0) + 1;
            });
            return Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0, limit).map(e => e[0]);
        };

        res.json({
            brands: getTop(p => p.brand?.display || p.brand || '', 10),
            materials: getTop(p => p.additional_info?.material || '', 8),
            weights: getTop(p => p.additional_info?.weight || '', 8),
            countries: getTop(p => p.additional_info?.country_of_origin || '', 8),
            warranties: getTop(p => p.warranty_period || '', 5)
        });
    } catch(err) { res.status(500).json({ error: "Failed to get field values" }); }
});

app.get('/api/products/latest', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(data.products.length > 0 ? data.products[data.products.length - 1] : null);
    } catch (error) { res.status(500).json({ error: "Failed to get latest product" }); }
});

app.post('/api/products', uploadProduct.array('local_images', 20), (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const p = req.body;
        
        if (data.products.some(x => x.sku === p.sku)) {
            return res.status(400).json({ error: "SKU already exists." });
        }

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
            features: p.features ? JSON.parse(p.features) : [],
            specifications: p.specifications ? JSON.parse(p.specifications) : [],
            additional_info: {
                material: p.material || "",
                weight: p.weight || "",
                country_of_origin: p.country_of_origin || ""
            },
            warranty_period: p.warranty_period || "",
            warranty_type: p.warranty_type || "",
            box_items: p.box_items ? JSON.parse(p.box_items) : [],
            images: {
                local: req.files ? req.files.map(f => `/uploads/products/${p.product_serial_id}/${f.filename}`) : [],
                amazon: p.amazon_images ? JSON.parse(p.amazon_images) : []
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        data.products.push(newProduct);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        res.json({ message: "Saved successfully", product: newProduct });
    } catch (error) { res.status(500).json({ error: "Failed to save product." }); }
});

app.put('/api/products/:sku', uploadProduct.array('local_images', 20), (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const p = req.body;
        const index = data.products.findIndex(x => x.sku === req.params.sku);
        
        if (index === -1) {
            return res.status(404).json({ error: "Product not found." });
        }

        const existingProduct = data.products[index];

        const updatedProduct = {
            ...existingProduct,
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
            features: p.features ? JSON.parse(p.features) : existingProduct.features,
            specifications: p.specifications ? JSON.parse(p.specifications) : existingProduct.specifications,
            additional_info: {
                material: p.material || "",
                weight: p.weight || "",
                country_of_origin: p.country_of_origin || ""
            },
            warranty_period: p.warranty_period || "",
            warranty_type: p.warranty_type || "",
            box_items: p.box_items ? JSON.parse(p.box_items) : existingProduct.box_items,
            updated_at: new Date().toISOString()
        };

        // Handle Images Update (Combine or Replace based on logic, let's replace for simplicity)
        if (req.files && req.files.length > 0) {
            updatedProduct.images.local = req.files.map(f => `/uploads/products/${existingProduct.product_serial_id}/${f.filename}`);
        }
        if (p.amazon_images) {
            updatedProduct.images.amazon = JSON.parse(p.amazon_images);
        }

        data.products[index] = updatedProduct;
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        res.json({ message: "Updated successfully", product: updatedProduct });
    } catch (error) { res.status(500).json({ error: "Failed to update product." }); }
});

// -----------------------------------------------------
// BACKUP & EXPORT APIS
// -----------------------------------------------------
app.get('/api/export/csv', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        const flatData = data.products.map(p => ({
            SKU: p.sku,
            Name: p.name,
            Category: p.category,
            Subcategory: p.subcategory,
            Brand: p.brand?.display || p.brand,
            Selling_Price: p.price.selling_price,
            MRP: p.price.mrp,
            Stock: p.stock_quantity,
            Status: p.status,
            Material: p.additional_info?.material,
            Weight: p.additional_info?.weight,
            Country: p.additional_info?.country_of_origin,
            Warranty: p.warranty_period,
            Images_Amazon: p.images?.amazon?.join(' | ') || '',
            Created_At: p.created_at
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(flatData);

        res.header('Content-Type', 'text/csv');
        res.attachment('products_export.csv');
        return res.send(csv);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate CSV" });
    }
});

app.get('/api/export/json', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.header('Content-Type', 'application/json');
        res.attachment('products_export.json');
        return res.send(JSON.stringify(data.products, null, 2));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to generate JSON" });
    }
});

app.get('/api/backup', (req, res) => {
    res.attachment('buildmart_backup.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => res.status(500).send({ error: err.message }));
    
    // Pipe archive data to the response
    archive.pipe(res);

    // Append files
    if (fs.existsSync(DATA_FILE)) {
        archive.file(DATA_FILE, { name: 'products.json' });
    }
    if (fs.existsSync(UPLOADS_DIR)) {
        archive.directory(UPLOADS_DIR, 'uploads/products');
    }

    archive.finalize();
});

app.post('/api/restore', uploadRestore.single('backup_file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const zipPath = req.file.path;
        const targetDir = path.join(__dirname, 'temp', 'extract');
        if (fs.existsSync(targetDir)) fs.rmSync(targetDir, { recursive: true, force: true });
        
        await extract(zipPath, { dir: targetDir });

        // Restore JSON
        const jsonPath = path.join(targetDir, 'products.json');
        if (fs.existsSync(jsonPath)) {
            fs.copyFileSync(jsonPath, DATA_FILE);
        }

        // Restore Images
        const extUploads = path.join(targetDir, 'uploads', 'products');
        if (fs.existsSync(extUploads)) {
            fs.cpSync(extUploads, UPLOADS_DIR, { recursive: true, force: true });
        }

        // Cleanup
        fs.rmSync(path.join(__dirname, 'temp'), { recursive: true, force: true });

        res.json({ message: "Backup restored successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to restore backup" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
