# 🛠️ BUILDMART — Industrial Hardware E-Commerce & Executive Catalog Platform

A state-of-the-art hybrid e-commerce storefront and minimalist executive catalog management platform built with high-performance HTML5 Canvas, modern Vanilla CSS, and modular JavaScript.

---

## ✨ Key Features

### 🌳 1. Interactive 4-Tier Animated Canvas Tree Explorer (`tree.html`)
- **Zero-Mesh Non-Overlapping Layout**: Subcategory cards automatically center beside their own dedicated child product SKUs, ensuring clean horizontal connections with zero crossed lines.
- **Glowing Animated Signal Pulses**: Real-time energy particles stream along smooth cubic Bezier curves (`Root -> Category -> Subcategory -> Product SKU`).
- **Interactive Branch Folding (`[-] / [+]`)**: Click any category or subcategory toggle badge to smoothly expand or collapse tree branches.
- **2D Mini Tool Cards**: Each product renders as an architectural card displaying Category Badge, Tool Name, SKU identifier, and Market Price.
- **Node Inspector Sidebar**: Click any card on the canvas to inspect its live catalog data and jump directly to editing its specifications.

### 🛍️ 2. Flipkart + Amazon Hybrid Storefront (`shop.html` & `preview-store.html`)
- **Amazon-Style High-Resolution Zoom**: Interactive 2.2x zoom lens tracking mouse coordinates over product images.
- **Flipkart Gallery & Assured Badges**: Vertical thumbnail selector strip (`#mv_thumbs_strip`) and high-trust verified checkmarks.
- **Direct WhatsApp Ordering**: Pre-filled automated WhatsApp order dispatch with SKU, tool title, and price formatting.

### 🏛️ 3. Minimalist Executive Dashboard Suite
- **Whitespace-Driven Architecture**: Clean off-white executive canvas (`#FAFAFB`) across `index.html`, `add-product.html`, `products.html`, `json-editor.html`, and `settings.html`.
- **Gamified Growth Engine**: Tiered owner progress milestones, dynamic inventory badges, and actionable tips to encourage catalog expansion.
- **Intelligent Deduplication Engine**: Automatic JSON extraction (`addOrUpdateSpec`) preventing duplicate specification keys.

---

## 🚀 Quick Start (Running Locally)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GajjarKashyap/BUILD-MART-FINAL-REPO.git
   cd BUILD-MART-FINAL-REPO
   ```

2. **Open in your browser:**
   - Open `public/index.html` or `tree.html` directly in any web browser, or launch a local server:
   ```bash
   npx serve public
   ```
   Navigate to `http://localhost:3000/tree.html` to explore the Interactive Canvas Graph!

---

## 🌐 Online Deployment (Free Hosting)

- **GitHub Pages**: Go to your GitHub Repository Settings -> **Pages** -> Select `main` branch -> `/public` -> Save.
- **Netlify Drop**: Simply drag and drop the `public` folder onto [app.netlify.com/drop](https://app.netlify.com/drop) for instant live deployment.

---

## 📁 Repository Structure
```
├── tree.html                  # 4-Tier Animated Expandable Canvas Tree Explorer
├── README.md                  # Project Documentation
└── public/
    ├── index.html             # Minimal Executive Overview Dashboard
    ├── shop.html              # Live Hybrid Storefront (Flipkart + Amazon UI)
    ├── add-product.html       # Inventory Input Form with Deduplication Engine
    ├── products.html          # Searchable Inventory Management Grid
    ├── json-editor.html       # Custom GUI JSON Editor & Importer/Exporter
    ├── db.js                  # Local Database State Manager
    └── LOGO.jpg               # BuildMart Brand Logo
```
