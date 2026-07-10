const fs = require('fs');
const path = require('path');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';

if (fs.existsSync(loginPath)) {
  let content = fs.readFileSync(loginPath, 'utf8');

  // 1. Import Smartphone
  const targetImport = `import { Coffee, Mail, Lock, Terminal, Check, Copy } from 'lucide-react';`;
  const replacementImport = `import { Coffee, Mail, Lock, Terminal, Check, Copy, Smartphone } from 'lucide-react';`;
  
  if (content.includes(targetImport)) {
    content = content.replace(targetImport, replacementImport);
  }

  // 2. Add Android App Promo Banner
  const targetCardEnd = `        </div>\n\n        {/* System Footer Accent */}`;
  
  const replacementCardEnd = `        </div>

        {/* Android App Promotion Banner */}
        <div className="mt-4 bg-dark-surface/40 backdrop-blur-md p-4 rounded-xl border border-primary/10 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary border border-primary/20 shrink-0">
              <Smartphone size={18} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                Android App Available!
                <span className="text-[9px] font-bold text-dark-bg bg-primary px-1 rounded font-mono uppercase tracking-wider">New</span>
              </h4>
              <p className="text-[10px] text-dark-muted font-sans mt-0.5">Get the native mobile app for labs.</p>
            </div>
          </div>
          <a 
            href="https://github.com/GajjarKashyap/CodeValut/actions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/95 text-dark-bg font-sans font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shrink-0"
          >
            Download APK
          </a>
        </div>\n\n        {/* System Footer Accent */}`;

  if (content.includes(targetCardEnd)) {
    content = content.replace(targetCardEnd, replacementCardEnd);
    fs.writeFileSync(loginPath, content, 'utf8');
    console.log('Successfully updated Login.jsx with Android App promo');
  } else {
    // Try without carriage return if line endings differ
    const targetCardEndAlt = `        </div>\r\n\r\n        {/* System Footer Accent */}`;
    const replacementCardEndAlt = `        </div>

        {/* Android App Promotion Banner */}
        <div className="mt-4 bg-dark-surface/40 backdrop-blur-md p-4 rounded-xl border border-primary/10 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary border border-primary/20 shrink-0">
              <Smartphone size={18} />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                Android App Available!
                <span className="text-[9px] font-bold text-dark-bg bg-primary px-1 rounded font-mono uppercase tracking-wider">New</span>
              </h4>
              <p className="text-[10px] text-dark-muted font-sans mt-0.5">Get the native mobile app for labs.</p>
            </div>
          </div>
          <a 
            href="https://github.com/GajjarKashyap/CodeValut/actions" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/95 text-dark-bg font-sans font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer shadow-md shrink-0"
          >
            Download APK
          </a>
        </div>\r\n\r\n        {/* System Footer Accent */}`;
        
    if (content.includes(targetCardEndAlt)) {
      content = content.replace(targetCardEndAlt, replacementCardEndAlt);
      fs.writeFileSync(loginPath, content, 'utf8');
      console.log('Successfully updated Login.jsx with Android App promo (Alt line endings)');
    } else {
      console.log('Could not find target card end in Login.jsx.');
    }
  }
} else {
  console.error('Login.jsx not found');
}
