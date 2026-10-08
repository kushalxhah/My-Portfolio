import fs from 'fs';
import path from 'path';

const joyspoonSource = 'C:/Users/MASTER/.gemini/antigravity/brain/83bbfaf8-9de1-4d6c-815f-7f776eaffc25/.user_uploaded/media__1784994595582.png';
const targetDir = path.resolve('src/assets/images');

const copyFile = (source, targetName) => {
  const target = path.join(targetDir, targetName);
  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, target);
      console.log(`✅ Asset copied successfully: ${targetName}`);
    } else if (!fs.existsSync(target)) {
      console.log(`⚠️ Source not found: ${source}. Creating empty fallback.`);
      fs.writeFileSync(target, '');
    } else {
      console.log(`ℹ️ Source not found, but target ${targetName} already exists. Retaining existing file.`);
    }
  } catch (err) {
    console.error(`❌ Failed to copy asset ${targetName}:`, err.message);
  }
};

// Copy only active project images
copyFile(joyspoonSource, 'joyspoon_mukhvas.png');

// Copy resume.pdf to public/Kushal_Shah_CV.pdf so it is served as a downloadable static asset
const publicDir = path.resolve('public');
const resumeSource = path.resolve('resume.pdf');
const cvTarget = path.join(publicDir, 'Kushal_Shah_CV.pdf');

try {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (fs.existsSync(resumeSource)) {
    fs.copyFileSync(resumeSource, cvTarget);
    console.log('✅ resume.pdf copied to public/Kushal_Shah_CV.pdf successfully!');
  } else {
    console.log('⚠️ resume.pdf not found in root!');
  }
} catch (err) {
  console.error('❌ Failed to copy resume.pdf to public:', err.message);
}

// List of unused HTML, components, and image files to delete from the project directory
const filesToDelete = [
  // Root level unused html files
  path.resolve('about.html'),
  path.resolve('contact.html'),
  path.resolve('projects.html'),
  path.resolve('skills.html'),
  path.resolve('copy-joyspoon.js'),
  path.resolve('restore-image.js'),

  // Unused asset files
  path.resolve('src/assets/avatar_professional.png'),
  path.resolve('src/assets/avatar_waving.png'),
  path.resolve('src/assets/developer.png'),

  // Unused components and their styles
  path.resolve('src/components/ElectricBorder.css'),
  path.resolve('src/components/ElectricBorder.jsx'),
  path.resolve('src/components/GlareHover.css'),
  path.resolve('src/components/GlareHover.jsx'),
  path.resolve('src/components/GlassIcons.css'),
  path.resolve('src/components/GlassIcons.jsx'),
  path.resolve('src/components/Grain.jsx'),
  path.resolve('src/components/Header.jsx'),
  path.resolve('src/components/HumanShowcase.jsx'),
  path.resolve('src/components/InteractiveAvatar.css'),
  path.resolve('src/components/InteractiveAvatar.jsx'),
  path.resolve('src/components/InteractiveCanvas.jsx'),
  path.resolve('src/components/Loader.jsx'),
  path.resolve('src/components/LogoLoop.css'),
  path.resolve('src/components/LogoLoop.jsx'),
  path.resolve('src/components/Nav.jsx'),
  path.resolve('src/components/OptionWheel.css'),
  path.resolve('src/components/OptionWheel.jsx'),
  path.resolve('src/components/ScrollStack.css'),
  path.resolve('src/components/ScrollStack.jsx'),
  path.resolve('src/components/ServiceBgSvg.jsx'),
  path.resolve('src/components/SideRays.css'),
  path.resolve('src/components/SideRays.jsx'),
  path.resolve('src/components/SpecularButton.css'),
  path.resolve('src/components/SpecularButton.jsx'),
  path.resolve('src/components/TextType.css'),
  path.resolve('src/components/TextType.jsx'),
  path.resolve('src/components/ImageTrail.css'),
  path.resolve('src/components/ImageTrail.jsx'),
];

filesToDelete.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`🗑️ Deleted unused file: ${path.basename(file)}`);
    }
  } catch (err) {
    console.error(`❌ Failed to delete ${path.basename(file)}:`, err.message);
  }
});

// Recursive folder deletion helper
const deleteFolderRecursive = (directoryPath) => {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(directoryPath);
    console.log(`🗑️ Deleted unused directory: ${path.basename(directoryPath)}`);
  }
};

// Delete obsolete root directories
deleteFolderRecursive(path.resolve('css'));
deleteFolderRecursive(path.resolve('js'));
