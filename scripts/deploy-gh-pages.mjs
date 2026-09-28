import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const distPath = path.resolve('dist');
const tempIndex = path.resolve('.git', 'temp_gh_pages_index');

try {
  if (fs.existsSync(tempIndex)) fs.unlinkSync(tempIndex);
  
  const env = { ...process.env, GIT_INDEX_FILE: tempIndex };
  
  console.log('Adding dist files to temporary index...');
  execSync(`git --work-tree="${distPath}" add -f --all`, { env, stdio: 'inherit' });
  
  const treeId = execSync('git write-tree', { env }).toString().trim();
  console.log('Created tree:', treeId);
  
  let parentArg = '';
  try {
    const parent = execSync('git rev-parse origin/gh-pages').toString().trim();
    if (parent) parentArg = `-p ${parent}`;
  } catch (e) {
    console.log('No previous gh-pages branch found, creating root commit');
  }
  
  const commitId = execSync(
    `git commit-tree ${treeId} ${parentArg} -m "Deploy: unified multi-camera video wall with all views and angles in one window"`, 
    { env }
  ).toString().trim();
  console.log('Created commit:', commitId);
  
  console.log('Pushing to origin/gh-pages...');
  execSync(`git push origin ${commitId}:refs/heads/gh-pages`, { stdio: 'inherit' });
  console.log('🎉 Successfully deployed to GitHub Pages!');
} catch (error) {
  console.error('Deployment error:', error);
  process.exit(1);
} finally {
  if (fs.existsSync(tempIndex)) {
    try { fs.unlinkSync(tempIndex); } catch (_) {}
  }
}
