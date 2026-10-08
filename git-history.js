import { execSync } from 'child_process';

try {
  const output = execSync('git log -p -n 3 src/components/ProjectCard.css', { encoding: 'utf8' });
  console.log('Git history for ProjectCard.css:');
  console.log(output);
} catch (err) {
  console.error('Failed to run git command:', err.message);
}
