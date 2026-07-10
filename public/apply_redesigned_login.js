const fs = require('fs');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';

if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');

  // Change input background from bg-transparent to bg-dark-bg to match the Stitch design's input fields
  const targetEmailInput = `className="w-full bg-transparent border border-dark-border focus:border-primary text-dark-text rounded-xl pl-12 pr-4 py-2.5 focus:outline-none transition-all font-sans placeholder-dark-muted text-xs"`;
  const replacementEmailInput = `className="w-full bg-dark-bg border border-dark-border focus:border-primary focus:ring-2 focus:ring-primary/10 text-dark-text rounded-xl pl-12 pr-4 py-2.5 focus:outline-none transition-all font-sans placeholder-dark-muted text-xs"`;

  content = content.replace(targetEmailInput, replacementEmailInput);
  // Replace the second one (password) too
  content = content.replace(targetEmailInput, replacementEmailInput);

  // Let's make the Android promotion banner use color-mix background (theme-bg-primary-5)
  content = content.replace(
    `className="mt-3.5 bg-dark-surface backdrop-blur-md p-4 rounded-xl border theme-border-primary-20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`,
    `className="mt-3.5 theme-bg-primary-5 backdrop-blur-md p-4 rounded-xl border theme-border-primary-20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`
  );

  fs.writeFileSync(loginPath, content, 'utf8');
  console.log('Successfully applied redesigned login screen changes');
} else {
  console.error('Login.jsx not found');
}
