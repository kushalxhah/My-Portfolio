import fs from 'fs';
const filesToDelete = [
  'src/components/Animated3DBackground.jsx',
  'src/components/CodeEditorMockup.jsx',
  'src/components/CodeEditorMockup.css',
  'src/components/MagicBentoContact.jsx',
  'src/components/MagicBentoContact.css',
  'src/components/ProjectCard.jsx',
  'src/components/ProjectCard.css',
  'src/components/ServicesGrid.jsx',
  'src/components/ServicesGrid.css',
  'src/components/InteractiveSkills.jsx',
  'src/components/InteractiveSkills.css',
  'src/components/SocialConnect.jsx',
  'src/components/SocialConnect.css',
  'src/components/SplitText.jsx',
  'src/index.css',
];
filesToDelete.forEach(f => {
  try { if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('Deleted: ' + f); } } catch(e) { console.error('Error: ' + f, e.message); }
});
console.log('Cleanup done!');
