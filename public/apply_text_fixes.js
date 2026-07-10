const fs = require('fs');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';

if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');

  // 1. Add text-dark-text to outer container
  content = content.replace(
    `className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern"`,
    `className="min-h-screen bg-dark-bg text-dark-text flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern"`
  );

  // 2. Add color-mix utility styles to style tag
  const oldStyle = `<style>{\`
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .scanline {
          width: 100%;
          height: 100px;
          z-index: 5;
          background: linear-gradient(0deg, rgba(200, 171, 126, 0) 0%, rgba(200, 171, 126, 0.03) 50%, rgba(200, 171, 126, 0) 100%);
          opacity: 0.15;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
      \`}</style>`;

  const newStyle = `<style>{\`
        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
        .scanline {
          width: 100%;
          height: 100px;
          z-index: 5;
          background: linear-gradient(0deg, rgba(200, 171, 126, 0) 0%, rgba(200, 171, 126, 0.03) 50%, rgba(200, 171, 126, 0) 100%);
          opacity: 0.15;
          position: absolute;
          bottom: 100%;
          animation: scanline 8s linear infinite;
          pointer-events: none;
        }
        .theme-bg-primary-5 {
          background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
        }
        .theme-bg-primary-10 {
          background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
        }
        .theme-bg-primary-15 {
          background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
        }
        .theme-border-primary-20 {
          border-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
        }
        .theme-border-primary-25 {
          border-color: color-mix(in srgb, var(--color-primary) 25%, transparent);
        }
        .theme-border-primary-40 {
          border-color: color-mix(in srgb, var(--color-primary) 40%, transparent);
        }
        .theme-border-primary-45 {
          border-color: color-mix(in srgb, var(--color-primary) 45%, transparent);
        }
      \`}</style>`;

  content = content.replace(oldStyle, newStyle);

  // 3. Replace color opacity modifiers with custom color-mix classes
  // Header Logo Box
  content = content.replace(
    `className="bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5 animate-pulse"`,
    `className="theme-bg-primary-10 w-10 h-10 rounded-xl flex items-center justify-center border theme-border-primary-20 shadow-lg shadow-primary/5 animate-pulse"`
  );

  // Header Developer Badge
  content = content.replace(
    `className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 shadow-sm"`,
    `className="px-3 py-1 rounded-full border theme-border-primary-20 theme-bg-primary-5 shadow-sm"`
  );

  // Email / Password inputs focus border opacity
  content = content.replace(
    `focus:border-primary/50`,
    `focus:border-primary`
  );
  content = content.replace(
    `focus:border-primary/50`,
    `focus:border-primary`
  );

  // Android App Promotion Banner Box
  content = content.replace(
    `className="mt-3.5 bg-dark-surface backdrop-blur-md p-4 rounded-xl border border-primary/20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`,
    `className="mt-3.5 bg-dark-surface backdrop-blur-md p-4 rounded-xl border theme-border-primary-20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`
  );

  // Android Icon Box
  content = content.replace(
    `className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0"`,
    `className="w-10 h-10 rounded-xl theme-bg-primary-10 flex items-center justify-center border theme-border-primary-20 shrink-0"`
  );

  // Android Download Button
  content = content.replace(
    `className="bg-primary/15 border border-primary/45 text-primary text-[9px] font-bold py-2 px-3.5 rounded-lg uppercase tracking-widest hover:bg-primary hover:text-dark-bg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md shrink-0 text-center"`,
    `className="theme-bg-primary-15 border theme-border-primary-45 text-primary text-[9px] font-bold py-2 px-3.5 rounded-lg uppercase tracking-widest hover:bg-primary hover:text-dark-bg transition-all duration-300 whitespace-nowrap cursor-pointer shadow-md shrink-0 text-center"`
  );

  // 4. Fix Development Notice opacity modifier (replace text-dark-muted/50 with text-dark-muted opacity-50)
  content = content.replace(
    `className="text-[9px] font-mono text-dark-muted/50 uppercase tracking-wider"`,
    `className="text-[9px] font-mono text-dark-muted opacity-50 uppercase tracking-wider"`
  );

  fs.writeFileSync(loginPath, content, 'utf8');
  console.log('Successfully applied all theme and opacity improvements to Login.jsx');
} else {
  console.error('Login.jsx not found');
}
