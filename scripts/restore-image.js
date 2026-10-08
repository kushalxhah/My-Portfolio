import fs from 'fs';
import path from 'path';

const source = 'C:\\Users\\MASTER\\.gemini\\antigravity\\brain\\83bbfaf8-9de1-4d6c-815f-7f776eaffc25\\.user_uploaded\\media__1784994595582.png';
const target = path.resolve('src/assets/joyspoon_mukhvas.png');

console.log('Checking paths:');
console.log('Source path:', source);
console.log('Source exists:', fs.existsSync(source));
console.log('Target path:', target);
console.log('Target exists:', fs.existsSync(target));

try {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target);
    console.log('🎉 Successfully restored joyspoon_mukhvas.png!');
  } else {
    console.log('❌ Source file not found at:', source);
  }
} catch (err) {
  console.error('❌ Copy failed:', err.message);
}
