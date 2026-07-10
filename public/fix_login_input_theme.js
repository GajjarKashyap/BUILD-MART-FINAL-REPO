const fs = require('fs');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';

if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');

  // 1. Import useEffect if not already imported
  if (!content.includes('useEffect')) {
    content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");
    
    // Add the useEffect hook right inside the Login component
    const effectCode = `  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [copiedSection, setCopiedSection] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('codevault_theme') || 'original';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);`;

    content = content.replace(
      `  const [email, setEmail] = useState('');\r\n  const [password, setPassword] = useState('');\r\n  const [loading, setLoading] = useState(false);\r\n  const [error, setError] = useState(null);\r\n  const { user } = useAuth();\r\n  const [showRequestModal, setShowRequestModal] = useState(false);\r\n  const [copiedSection, setCopiedSection] = useState('');`,
      effectCode
    );
    content = content.replace(
      `  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n  const { user } = useAuth();\n  const [showRequestModal, setShowRequestModal] = useState(false);\n  const [copiedSection, setCopiedSection] = useState('');`,
      effectCode
    );
  }

  // 2. Fix card background opacity (remove /60)
  content = content.replace(
    `className="bg-dark-surface/60 backdrop-blur-md p-6 rounded-2xl border border-primary/20 shadow-2xl space-y-4 relative overflow-hidden group transition-all duration-300 hover:border-primary/30 w-full"`,
    `className="bg-dark-surface backdrop-blur-md p-6 rounded-2xl border border-primary/20 shadow-2xl space-y-4 relative overflow-hidden group transition-all duration-300 hover:border-primary/30 w-full"`
  );

  // 3. Fix input backgrounds (change bg-dark-bg/60 to bg-transparent or bg-dark-bg)
  // We will change both inputs to use bg-dark-bg directly (which resolves to dark in dark mode and light in light mode)
  // and make sure text is text-dark-text (which is dark in light mode, and light in dark mode).
  const oldEmailInput = `className="w-full bg-dark-bg/60 border border-dark-border focus:border-primary/50 text-dark-text rounded-xl pl-12 pr-4 py-2.5 focus:outline-none transition-all font-sans placeholder-dark-muted text-xs"`;
  const newEmailInput = `className="w-full bg-transparent border border-dark-border focus:border-primary/50 text-dark-text rounded-xl pl-12 pr-4 py-2.5 focus:outline-none transition-all font-sans placeholder-dark-muted text-xs"`;
  
  content = content.replace(oldEmailInput, newEmailInput);
  // Replace the second one (password) too
  content = content.replace(oldEmailInput, newEmailInput);

  // 4. Fix title text color (change text-white to text-dark-text)
  content = content.replace(
    `<h2 className="text-xl font-bold font-serif text-white mb-0.5">Secure Access</h2>`,
    `<h2 className="text-xl font-bold font-serif text-dark-text mb-0.5">Secure Access</h2>`
  );

  // 5. Fix Request Account button (bg-transparent, text-dark-text)
  content = content.replace(
    `className="w-full bg-dark-bg/80 border border-dark-border hover:border-primary/50 text-white font-mono text-[11px] py-2 px-3 rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"`,
    `className="w-full bg-transparent border border-dark-border hover:border-primary/50 text-dark-text font-mono text-[11px] py-2 px-3 rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"`
  );

  // 6. Fix Android App Promo Banner (change bg-dark-surface/40 to bg-dark-surface)
  content = content.replace(
    `className="mt-3.5 bg-dark-surface/40 backdrop-blur-md p-4 rounded-xl border border-primary/20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`,
    `className="mt-3.5 bg-dark-surface backdrop-blur-md p-4 rounded-xl border border-primary/20 shadow-2xl flex items-center justify-between gap-3 animate-pulse-gold w-full"`
  );

  // 7. Force Request Modal to stay dark
  content = content.replace(
    `<div className="bg-dark-surface border border-primary/20 p-6 md:p-8 rounded-2xl max-w-lg w-full space-y-5 shadow-2xl relative">`,
    `<div className="bg-[#181818] border border-primary/20 p-6 md:p-8 rounded-2xl max-w-lg w-full space-y-5 shadow-2xl relative">`
  );
  
  // Replace inputs in the modal to stay dark
  content = content.replace(
    `<div className="flex items-center bg-dark-bg border border-dark-border rounded-xl p-2.5 gap-2">`,
    `<div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 gap-2">`
  );
  content = content.replace(
    `<div className="flex items-center bg-dark-bg border border-dark-border rounded-xl p-2.5 gap-2">`,
    `<div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 gap-2">`
  );

  // Replace pre-container background
  content = content.replace(
    `<div className="relative bg-dark-bg border border-dark-border rounded-xl p-4">`,
    `<div className="relative bg-neutral-950 border border-neutral-800 rounded-xl p-4">`
  );

  // Replace copy button in pre-container
  content = content.replace(
    `className="absolute right-3 bottom-3 bg-dark-surface border border-dark-border hover:border-primary/50 text-xs text-primary hover:text-primary/80 font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg cursor-pointer shadow-lg"`,
    `className="absolute right-3 bottom-3 bg-neutral-900 border border-neutral-800 hover:border-primary/50 text-xs text-primary hover:text-primary/80 font-mono flex items-center gap-1.5 px-3 py-1 rounded-lg cursor-pointer shadow-lg"`
  );

  fs.writeFileSync(loginPath, content, 'utf8');
  console.log('Successfully completed Login.jsx updates');
} else {
  console.error('Login.jsx not found');
}
