const fs = require('fs');
const path = require('path');

const target1 = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/src/lib/supabase.js';
const target2 = 'c:/Users/kasha/OneDrive/Desktop/CODE VAULT/mobile-app/src/lib/supabase.js';

const content = `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xuetoabqznzqpkgipbfk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_4izfwy39fTMJrSR5cdUfdQ_GO9YZqVh';

export const supabase = createClient(supabaseUrl, supabaseKey);
`;

try {
  fs.writeFileSync(target1, content, 'utf8');
  console.log('Successfully wrote target1');
} catch (e) {
  console.error('Error writing target1:', e);
}

try {
  fs.writeFileSync(target2, content, 'utf8');
  console.log('Successfully wrote target2');
} catch (e) {
  console.error('Error writing target2:', e);
}
