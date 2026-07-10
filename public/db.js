// db.js - Browser Storage Database Manager

const DB_KEY = 'buildmart_db';

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


class Database {
    constructor() {
        this.init();
    }

    init() {
        let existing = null;
        try {
            existing = JSON.parse(localStorage.getItem(DB_KEY));
        } catch(e) {
            existing = null;
        }

        // Auto-seed default catalog if localStorage is missing or products array is empty
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
            return { metadata: { last_serial_id: 1000008 }, products: DEFAULT_SEED_PRODUCTS };
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('db-changed'));
        } catch(e) {
            console.error("Failed to save DB", e);
        }
    }

    getProducts() {
        return this.getData().products || [];
    }

    getAllProducts() {
        return this.getProducts();
    }

    getProduct(sku) {
        const products = this.getProducts();
        return products.find(p => p.sku === sku) || null;
    }

    deleteProduct(sku) {
        const data = this.getData();
        data.products = data.products.filter(p => p.sku !== sku);
        this.saveData(data);
    }

    getStats() {
        const products = this.getProducts();
        const categories = {};
        let totalValue = 0;

        products.forEach(p => {
            const cat = p.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + 1;
            if (p.price && p.price.selling_price) {
                totalValue += (parseFloat(p.price.selling_price) || 0);
            }
        });

        return {
            totalProducts: products.length,
            categories: categories,
            totalInventoryValue: totalValue,
            recentProducts: products.slice(-5).reverse()
        };
    }

    saveProduct(p) {
        const data = this.getData();
        let newProduct = { ...p };

        if (p.sku) {
            let index = data.products.findIndex(x => x.sku === p.sku);
            if (index === -1) {
                newProduct.created_at = new Date().toISOString();
                data.products.push(newProduct);
            } else {
                newProduct.created_at = data.products[index].created_at || new Date().toISOString();
                data.products[index] = newProduct;
            }
        } else {
            newProduct.sku = "BM-PT-" + Date.now();
            newProduct.created_at = new Date().toISOString();
            data.products.push(newProduct);
        }

        this.saveData(data);
        return newProduct;
    }
}

// Global instance
window.db = new Database();
