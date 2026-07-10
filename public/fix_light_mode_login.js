const fs = require('fs');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';

if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');

  // 1. Import useEffect
  content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

  // 2. Add useEffect to load theme
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
  // Also try with Unix line endings
  content = content.replace(
    `  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [loading, setLoading] = useState(false);\n  const [error, setError] = useState(null);\n  const { user } = useAuth();\n  const [showRequestModal, setShowRequestModal] = useState(false);\n  const [copiedSection, setCopiedSection] = useState('');`,
    effectCode
  );

  // 3. Change "Secure Access" title text-white to text-dark-text
  content = content.replace(
    `<h2 className="text-xl font-bold font-serif text-white mb-0.5">`,
    `<h2 className="text-xl font-bold font-serif text-dark-text mb-0.5">`
  );

  // 4. Change "Request Account" button text-white to text-dark-text
  content = content.replace(
    `className="w-full bg-dark-bg/80 border border-dark-border hover:border-primary/50 text-white font-mono text-[11px] py-2 px-3 rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"`,
    `className="w-full bg-dark-bg/80 border border-dark-border hover:border-primary/50 text-dark-text font-mono text-[11px] py-2 px-3 rounded-xl transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"`
  );

  // 5. Force the Request Modal to stay dark
  content = content.replace(
    `<div className="bg-dark-surface border border-primary/20 p-6 md:p-8 rounded-2xl max-w-lg w-full space-y-5 shadow-2xl relative">`,
    `<div className="bg-[#181818] border border-primary/20 p-6 md:p-8 rounded-2xl max-w-lg w-full space-y-5 shadow-2xl relative">`
  );
  
  // Replace inputs in the modal to also stay dark
  content = content.replace(
    `<div className="flex items-center bg-dark-bg border border-dark-border rounded-xl p-2.5 gap-2">`,
    `<div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 gap-2">`
  );
  // Do it twice for Subject field too
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
  console.log('Successfully applied theme visibility fixes to Login.jsx');
} else {
  console.error('Login.jsx not found');
}
