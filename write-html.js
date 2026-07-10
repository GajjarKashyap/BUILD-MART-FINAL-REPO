const fs = require('fs');
const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BUILD MART Collector - Dashboard</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f6f9; color: #333; }
        .navbar { background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .navbar-brand, .nav-link { color: #fff !important; font-weight: 500; }
        .nav-link:hover { color: #d1e8ff !important; }
        .stat-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: 15px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05); padding: 20px; transition: transform 0.3s ease, box-shadow 0.3s ease; height: 100%; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(31, 38, 135, 0.1); }
        .stat-icon { font-size: 2.5rem; margin-bottom: 15px; background: linear-gradient(135deg, #00c6ff 0%, #0072ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .stat-value { font-size: 2rem; font-weight: 700; color: #1e3c72; margin-bottom: 5px; }
        .stat-label { font-size: 0.9rem; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; }
        .section-title { font-weight: 600; color: #2c3e50; margin-bottom: 20px; position: relative; padding-bottom: 10px; }
        .section-title::after { content: ''; position: absolute; left: 0; bottom: 0; height: 3px; width: 50px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 3px; }
        .category-list { list-style: none; padding-left: 0; }
        .category-item { margin-bottom: 10px; font-weight: 500; }
        .subcategory-list { list-style: none; padding-left: 20px; margin-top: 5px; border-left: 2px dashed #dee2e6; }
        .subcategory-item { color: #6c757d; font-size: 0.95rem; display: flex; justify-content: space-between; align-items: center; padding: 5px 0 5px 15px; position: relative; }
        .subcategory-item::before { content: ''; position: absolute; left: -2px; top: 50%; width: 12px; height: 2px; background-color: #dee2e6; }
        .badge-count { background-color: #e9ecef; color: #495057; border-radius: 20px; padding: 4px 10px; font-size: 0.8rem; font-weight: 600; }
        .recent-table th { background-color: #f8f9fa; color: #495057; font-weight: 600; border-bottom: 2px solid #dee2e6; }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg mb-5">
        <div class="container">
            <a class="navbar-brand" href="/">
                <i class="bi bi-box-seam me-2"></i> BUILD MART Collector
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="/"><i class="bi bi-speedometer2"></i> Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/add-product.html"><i class="bi bi-plus-circle"></i> Add Product</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/product-list.html"><i class="bi bi-list-ul"></i> Product List</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h2 class="section-title">Overview</h2>
        <div class="row g-4 mb-5" id="statsContainer">
            <div class="col-12 text-center text-muted">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading statistics...</p>
            </div>
        </div>

        <div class="row g-4">
            <div class="col-lg-6">
                <div class="stat-card h-100 p-4">
                    <h3 class="section-title">Collection Progress</h3>
                    <div id="progressContainer">
                        <p class="text-muted">Loading progress...</p>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="stat-card h-100 p-4">
                    <h3 class="section-title">Recently Added</h3>
                    <div class="table-responsive">
                        <table class="table table-hover recent-table" id="recentTable">
                            <thead>
                                <tr>
                                    <th>SKU</th>
                                    <th>Name</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td colspan="3" class="text-center text-muted">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            fetchStats();
        });

        async function fetchStats() {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                
                renderStats(data);
                renderProgress(data.categories);
                renderRecent(data.recentProducts);
            } catch (error) {
                console.error('Error fetching stats:', error);
                document.getElementById('statsContainer').innerHTML = '<div class="col-12 text-danger">Failed to load statistics. Is the server running?</div>';
            }
        }

        function renderStats(data) {
            const container = document.getElementById('statsContainer');
            container.innerHTML = `
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card text-center">
                        <i class="bi bi-box-seam stat-icon"></i>
                        <div class="stat-value">${data.totalProducts}</div>
                        <div class="stat-label">Total Products</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card text-center">
                        <i class="bi bi-images stat-icon"></i>
                        <div class="stat-value">${data.totalImages}</div>
                        <div class="stat-label">Total Images</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card text-center">
                        <i class="bi bi-tags stat-icon"></i>
                        <div class="stat-value">${data.totalBrands}</div>
                        <div class="stat-label">Total Brands</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="stat-card text-center">
                        <i class="bi bi-calendar-check stat-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); -webkit-background-clip: text;"></i>
                        <div class="stat-value">${data.todayCount}</div>
                        <div class="stat-label">Added Today</div>
                    </div>
                </div>
            `;
        }

        function renderProgress(categories) {
            const container = document.getElementById('progressContainer');
            
            if (Object.keys(categories).length === 0) {
                container.innerHTML = '<p class="text-muted">No products collected yet.</p>';
                return;
            }

            let html = '<ul class="category-list">';
            for (const [catName, subCats] of Object.entries(categories)) {
                html += `<li class="category-item text-primary">${catName}<ul class="subcategory-list">`;
                
                for (const [subName, count] of Object.entries(subCats)) {
                    html += `
                        <li class="subcategory-item">
                            <span>${subName}</span>
                            <span class="badge-count">${count} collected</span>
                        </li>
                    `;
                }
                
                html += '</ul></li><br>';
            }
            html += '</ul>';
            container.innerHTML = html;
        }

        function renderRecent(products) {
            const tbody = document.querySelector('#recentTable tbody');
            
            if (!products || products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No products found.</td></tr>';
                return;
            }

            tbody.innerHTML = products.map(p => `
                <tr>
                    <td><span class="badge bg-secondary">${p.sku || 'N/A'}</span></td>
                    <td>${p.name || 'Unknown Product'}</td>
                    <td class="text-muted small">${p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Unknown'}</td>
                </tr>
            `).join('');
        }
    </script>
</body>
</html>`;
fs.writeFileSync('public/index.html', html);
