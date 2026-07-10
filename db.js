// db.js - Browser Storage Database Manager

const DB_KEY = 'buildmart_db';

class Database {
    constructor() {
        this.init();
    }

    // Default Seed Hardware Catalog for Vercel, GitHub Pages, and fresh browser visitors
const DEFAULT_SEED_PRODUCTS = [
    {
        sku: "BM-PT-DR-0001",
        name: "DeWalt 20V MAX XR Brushless Drill/Driver Kit",
        category: "Power Tools",
        subcategory: "Cordless Drills",
        brand: { display: "DeWalt" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "18500", selling_price: "14500", discount: "22%" },
        rating: { stars: 4.8, reviews_count: 342 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Voltage": "20V MAX",
            "Chuck Size": "1/2 Inch Metal Ratcheting",
            "Motor Type": "High-Efficiency Brushless",
            "Max RPM": "2,000 RPM",
            "Battery Included": "Yes (2x 2.0Ah XR Lithium-Ion)"
        }
    },
    {
        sku: "BM-PT-DR-0002",
        name: "Bosch GSB 183-Li Professional Cordless Impact Drill",
        category: "Power Tools",
        subcategory: "Impact Drills",
        brand: { display: "Bosch" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "11999", selling_price: "9024", discount: "25%" },
        rating: { stars: 4.6, reviews_count: 518 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Voltage": "18V Professional",
            "Max Torque": "50 Nm Hard / 21 Nm Soft",
            "Impact Rate": "24,000 BPM",
            "LED Worklight": "Integrated High-Output LED"
        }
    },
    {
        sku: "BM-PT-RH-0003",
        name: "Makita LXT 18V Rotary Hammer Driver Drill",
        category: "Power Tools",
        subcategory: "Rotary Hammers",
        brand: { display: "Makita" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "19900", selling_price: "16200", discount: "18%" },
        rating: { stars: 4.7, reviews_count: 189 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Drilling Mode": "3-Mode (Hammer, Drill, Hammer+Drill)",
            "Shank Type": "SDS-Plus Quick Release",
            "Impact Energy": "2.0 Joules"
        }
    },
    {
        sku: "BM-PT-RH-0004",
        name: "Bosch GBH 220 Corded Heavy-Duty Rotary Hammer",
        category: "Power Tools",
        subcategory: "Rotary Hammers",
        brand: { display: "Bosch" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "6500", selling_price: "4849", discount: "25%" },
        rating: { stars: 4.5, reviews_count: 420 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Power Input": "720 Watts",
            "Impact Rate": "4,800 BPM",
            "Weight": "2.3 Kg Compact Ergonomic"
        }
    },
    {
        sku: "BM-PT-CS-0005",
        name: "Bosch GKS 235 Turbo Heavy-Duty Circular Saw",
        category: "Power Tools",
        subcategory: "Circular Saws",
        brand: { display: "Bosch" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "16500", selling_price: "13600", discount: "17%" },
        rating: { stars: 4.7, reviews_count: 275 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Blade Diameter": "235mm (9-1/4 Inch)",
            "Motor Power": "2,050W Turbo Motor",
            "Bevel Capacity": "45 Degrees Tilt"
        }
    },
    {
        sku: "BM-HT-PL-0006",
        name: "Stanley 10-Piece Professional Pliers & Wire Cutter Set",
        category: "Hand Tools",
        subcategory: "Pliers & Cutters",
        brand: { display: "Stanley" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "2400", selling_price: "1850", discount: "23%" },
        rating: { stars: 4.5, reviews_count: 612 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Material": "Chrome Vanadium Forged Steel",
            "Grip": "Bi-Material Ergonomic Cushion Grip",
            "Included": "Combination, Long Nose, Diagonal Cutter"
        }
    },
    {
        sku: "BM-HT-WR-0007",
        name: "Taparia Heavy Duty Socket Wrench Set 24 Pieces",
        category: "Hand Tools",
        subcategory: "Socket Wrenches",
        brand: { display: "Taparia" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "4200", selling_price: "3450", discount: "18%" },
        rating: { stars: 4.8, reviews_count: 890 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Drive Size": "1/2 Inch Square Drive",
            "Socket Range": "8mm to 32mm Hex",
            "Ratchet Mechanism": "Quick-Release Reversible Ratchet"
        }
    },
    {
        sku: "BM-AC-ST-0008",
        name: "Milwaukee PACKOUT Modular Weatherproof Storage Box",
        category: "Accessories",
        subcategory: "Modular Storage",
        brand: { display: "Milwaukee" },
        status: "active",
        created_at: new Date().toISOString(),
        price: { mrp: "10500", selling_price: "8900", discount: "15%" },
        rating: { stars: 4.9, reviews_count: 450 },
        images: {
            amazon: [
                "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
            ]
        },
        specifications: {
            "Weather Rating": "IP65 Waterproof & Dustproof Seal",
            "Construction": "Impact-Resistant Polymer",
            "Compatibility": "Full PACKOUT Interlocking System"
        }
    }
];

    init() {
        let existing = null;
        try {
            existing = JSON.parse(localStorage.getItem(DB_KEY));
        } catch(e) {
            existing = null;
        }

        // Auto-seed default catalog if localStorage is missing or products array is empty (essential for fresh Vercel/online deployments)
        if (!existing || !existing.products || existing.products.length === 0) {
            const initialData = {
                metadata: { project: "BUILD MART", last_serial_id: 1000008 },
                products: DEFAULT_SEED_PRODUCTS
            };
            localStorage.setItem(DB_KEY, JSON.stringify(initialData));
            console.log("Vercel / Online Deployment: Auto-seeded default hardware catalog!");
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
