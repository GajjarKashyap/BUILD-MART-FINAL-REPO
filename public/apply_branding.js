const fs = require('fs');
const path = require('path');

const loginPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/pages/Login.jsx';
const layoutPath = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/components/Layout.jsx';

// 1. Modify Login.jsx
if (fs.existsSync(loginPath)) {
  let loginContent = fs.readFileSync(loginPath, 'utf8');
  
  const targetText = `          <h1 className="text-4xl font-bold font-serif text-white mb-2 tracking-tight">CodeVault</h1>
          <p className="text-dark-muted font-sans text-sm">Secure practical notebook for college labs</p>
        </div>`;
        
  const replacementText = `          <h1 className="text-4xl font-bold font-serif text-white mb-2 tracking-tight">CodeVault</h1>
          <p className="text-dark-muted font-sans text-sm">Secure practical notebook for college labs</p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs uppercase tracking-wider font-semibold">
            Developed by Kashyap Gajjar
          </div>
        </div>`;

  if (loginContent.includes(targetText)) {
    loginContent = loginContent.replace(targetText, replacementText);
    fs.writeFileSync(loginPath, loginContent, 'utf8');
    console.log('Successfully updated Login.jsx');
  } else {
    console.log('Target text in Login.jsx not found or already modified.');
  }
} else {
  console.error('Login.jsx not found');
}

// 2. Modify Layout.jsx
if (fs.existsSync(layoutPath)) {
  let layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  const targetText = `          <div className="font-medium font-mono text-xs text-dark-muted tracking-wide">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </div>`;
          
  const replacementText = `          <div className="font-medium font-mono text-xs text-dark-muted tracking-wide flex items-center gap-3">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            <span className="text-primary/40 hidden sm:inline">|</span>
            <span className="text-primary font-sans text-[10px] font-semibold bg-primary/10 border border-primary/20 rounded px-2 py-0.5 whitespace-nowrap">Developed by Kashyap Gajjar</span>
          </div>`;

  if (layoutContent.includes(targetText)) {
    layoutContent = layoutContent.replace(targetText, replacementText);
    fs.writeFileSync(layoutPath, layoutContent, 'utf8');
    console.log('Successfully updated Layout.jsx');
  } else {
    console.log('Target text in Layout.jsx not found or already modified.');
  }
} else {
  console.error('Layout.jsx not found');
}
