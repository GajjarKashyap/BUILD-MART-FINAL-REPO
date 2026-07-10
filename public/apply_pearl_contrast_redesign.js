const fs = require('fs');
const path = require('path');

const targets = [
  { root: 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT', isMobile: false },
  { root: 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/mobile-app', isMobile: true }
];

targets.forEach(t => {
  console.log(`Processing directory: ${t.root}`);

  // 1. Update index.css
  const cssPath = path.join(t.root, 'src/index.css');
  if (fs.existsSync(cssPath)) {
    let css = fs.readFileSync(cssPath, 'utf8');
    const utilitiesMarker = `/* Global custom color-mix utilities for opacity */`;
    if (!css.includes(utilitiesMarker)) {
      const utilities = `\n\n${utilitiesMarker}
.theme-bg-primary-5 {
  background-color: color-mix(in srgb, var(--color-primary) 5%, transparent) !important;
}
.theme-bg-primary-10 {
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent) !important;
}
.theme-bg-primary-15 {
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent) !important;
}
.theme-border-primary-20 {
  border-color: color-mix(in srgb, var(--color-primary) 20%, transparent) !important;
}
.theme-border-primary-25 {
  border-color: color-mix(in srgb, var(--color-primary) 25%, transparent) !important;
}
.theme-border-primary-40 {
  border-color: color-mix(in srgb, var(--color-primary) 40%, transparent) !important;
}
.theme-border-primary-45 {
  border-color: color-mix(in srgb, var(--color-primary) 45%, transparent) !important;
}
`;
      css += utilities;
      fs.writeFileSync(cssPath, css, 'utf8');
      console.log(`- Updated index.css`);
    } else {
      console.log(`- index.css already has custom utilities`);
    }
  }

  // 2. Update Layout.jsx (sidebar hover)
  const layoutPath = path.join(t.root, 'src/components/Layout.jsx');
  if (fs.existsSync(layoutPath)) {
    let layout = fs.readFileSync(layoutPath, 'utf8');
    
    // Replace hover classes
    const oldHover = `text-dark-muted hover:text-white hover:bg-dark-border/40`;
    const newHover = `text-dark-muted hover:text-primary hover:theme-bg-primary-10`;
    
    if (layout.includes(oldHover)) {
      layout = layout.replace(oldHover, newHover);
      fs.writeFileSync(layoutPath, layout, 'utf8');
      console.log(`- Updated Layout.jsx`);
    }
  }

  // 3. Update SessionList.jsx
  const sessionListPath = path.join(t.root, 'src/pages/SessionList.jsx');
  if (fs.existsSync(sessionListPath)) {
    let list = fs.readFileSync(sessionListPath, 'utf8');
    list = list.replace(
      `<h2 className="text-2xl font-bold text-white`,
      `<h2 className="text-2xl font-bold text-dark-text`
    );
    list = list.replace(
      `<h3 className="text-white font-semibold font-sans`,
      `<h3 className="text-dark-text font-semibold font-sans`
    );
    fs.writeFileSync(sessionListPath, list, 'utf8');
    console.log(`- Updated SessionList.jsx`);
  }

  // 4. Update Archive.jsx
  const archivePath = path.join(t.root, 'src/pages/Archive.jsx');
  if (fs.existsSync(archivePath)) {
    let archive = fs.readFileSync(archivePath, 'utf8');
    archive = archive.replace(
      `<h2 className="text-2xl font-bold text-white`,
      `<h2 className="text-2xl font-bold text-dark-text`
    );
    archive = archive.replace(
      `className="text-white/80 font-semibold font-sans truncate"`,
      `className="text-dark-text opacity-80 font-semibold font-sans truncate"`
    );
    fs.writeFileSync(archivePath, archive, 'utf8');
    console.log(`- Updated Archive.jsx`);
  }

  // 5. Update Dashboard.jsx
  const dashboardPath = path.join(t.root, 'src/pages/Dashboard.jsx');
  if (fs.existsSync(dashboardPath)) {
    let dash = fs.readFileSync(dashboardPath, 'utf8');
    dash = dash.replace(
      `<h3 className="text-3xl font-bold text-white`,
      `<h3 className="text-3xl font-bold text-dark-text`
    );
    dash = dash.replace(
      `<h3 className="text-white font-bold font-serif text-lg`,
      `<h3 className="text-dark-text font-bold font-serif text-lg`
    );
    // Replace activity table header text-white
    dash = dash.replace(
      `className="bg-dark-bg/60 text-dark-muted text-[11px]`,
      `className="bg-dark-bg text-dark-muted text-[11px]`
    );
    fs.writeFileSync(dashboardPath, dash, 'utf8');
    console.log(`- Updated Dashboard.jsx`);
  }

  // 6. Update ChatDashboard.jsx
  const chatDashboardPath = path.join(t.root, 'src/pages/ChatDashboard.jsx');
  if (fs.existsSync(chatDashboardPath)) {
    let chatD = fs.readFileSync(chatDashboardPath, 'utf8');
    chatD = chatD.replace(
      `<h1 className="text-xl font-bold text-white font-serif`,
      `<h1 className="text-xl font-bold text-dark-text font-serif`
    );
    chatD = chatD.replace(
      `<h2 className="text-lg font-bold text-white mb-2"`,
      `<h2 className="text-lg font-bold text-dark-text mb-2"`
    );
    chatD = chatD.replace(
      `<h3 className="text-white font-bold truncate"`,
      `<h3 className="text-dark-text font-bold truncate"`
    );
    chatD = chatD.replace(
      `<h2 className="text-xl font-bold text-white font-serif mb-6`,
      `<h2 className="text-xl font-bold text-dark-text font-serif mb-6`
    );
    chatD = chatD.replace(
      `text-sm font-bold text-white truncate`,
      `text-sm font-bold text-dark-text truncate`
    );
    chatD = chatD.replace(
      `text-sm font-medium text-white`,
      `text-sm font-medium text-dark-text`
    );
    chatD = chatD.replace(
      `text-sm font-medium text-white`,
      `text-sm font-medium text-dark-text`
    );
    
    // Replace hover:text-white with hover:text-primary
    chatD = chatD.replaceAll(`hover:text-white`, `hover:text-primary`);
    // And input text-white
    chatD = chatD.replaceAll(`text-white focus:outline-none`, `text-dark-text focus:outline-none`);
    chatD = chatD.replaceAll(`text-white rounded-xl hover:bg-dark-border`, `text-dark-text rounded-xl hover:bg-dark-border`);
    
    fs.writeFileSync(chatDashboardPath, chatD, 'utf8');
    console.log(`- Updated ChatDashboard.jsx`);
  }

  // 7. Update ChatRoom.jsx
  const chatRoomPath = path.join(t.root, 'src/pages/ChatRoom.jsx');
  if (fs.existsSync(chatRoomPath)) {
    let chatR = fs.readFileSync(chatRoomPath, 'utf8');
    chatR = chatR.replace(
      `<h2 className="text-white font-bold font-sans tracking-wide`,
      `<h2 className="text-dark-text font-bold font-sans tracking-wide`
    );
    chatR = chatR.replaceAll(
      `<h4 className="font-bold text-white text-xs`,
      `<h4 className="font-bold text-dark-text text-xs`
    );
    chatR = chatR.replaceAll(
      `<h3 className="text-white font-bold font-sans`,
      `<h3 className="text-dark-text font-bold font-sans`
    );
    chatR = chatR.replaceAll(
      `text-white text-sm font-medium truncate`,
      `text-dark-text text-sm font-medium truncate`
    );
    
    // Replace hover:text-white with hover:text-primary
    chatR = chatR.replaceAll(`hover:text-white`, `hover:text-primary`);
    
    // Replace input background & text-white
    chatR = chatR.replaceAll(`text-white px-4 py-3`, `text-dark-text px-4 py-3`);
    chatR = chatR.replaceAll(`text-sm text-white focus:border-primary`, `text-sm text-dark-text focus:border-primary`);
    chatR = chatR.replaceAll(`text-white font-bold rounded-xl`, `text-dark-text font-bold rounded-xl`);
    chatR = chatR.replaceAll(`text-white hover:border-primary/50`, `text-dark-text hover:border-primary/50`);
    
    fs.writeFileSync(chatRoomPath, chatR, 'utf8');
    console.log(`- Updated ChatRoom.jsx`);
  }
});

console.log('All Pearl Light theme contrast fixes successfully applied.');
