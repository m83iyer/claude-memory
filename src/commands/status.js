import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { getiCloudPath, getMemoryPaths } from '../utils/icloud.js';
import { checkSymlink, getDotClaudePath } from '../utils/symlinks.js';

export async function statusCommand() {
  console.log(chalk.bold('\nclaude-memory status\n'));

  let allOk = true;

  // 1. iCloud
  const icloud = getiCloudPath();
  if (icloud) {
    console.log(chalk.green('✓ iCloud Drive'), chalk.dim(icloud));
  } else {
    console.log(chalk.red('✗ iCloud Drive not found'));
    allOk = false;
  }

  const paths = icloud ? getMemoryPaths() : null;

  // 2. Folder structure
  if (icloud && paths) {
    const folders = {
      'claude-memory/': paths.claudeMemory,
      'claude-memory/projects/': paths.projects,
      'claude-memory/system/': paths.system,
      'commands/': paths.commands,
    };
    for (const [label, folder] of Object.entries(folders)) {
      if (fs.existsSync(folder)) {
        console.log(chalk.green('✓'), label);
      } else {
        console.log(chalk.red('✗'), label, chalk.dim('(missing — run install)'));
        allOk = false;
      }
    }
  } else if (icloud && !paths) {
    console.log(chalk.red('✗ Failed to resolve memory paths'));
    allOk = false;
  }

  // 3. Symlinks
  if (icloud && paths) {
    console.log('');
    const dotClaude = getDotClaudePath();
    const symlinks = [
      ['~/.claude/CLAUDE.md', path.join(dotClaude, 'CLAUDE.md'), path.join(paths.system, 'CLAUDE.md')],
      ['~/.claude/commands/', path.join(dotClaude, 'commands'), paths.commands],
      ['~/.claude/settings.json', path.join(dotClaude, 'settings.json'), path.join(paths.system, 'settings.json')],
    ];
    for (const [label, link, target] of symlinks) {
      const result = checkSymlink(link, target);
      if (result && result.ok) {
        console.log(chalk.green('✓'), label, chalk.dim('→ iCloud'));
      } else {
        const reason = result ? result.reason : 'check failed';
        console.log(chalk.red('✗'), label, chalk.dim(`(${reason})`));
        allOk = false;
      }
    }
  }

  // Summary
  console.log('');
  if (allOk) {
    console.log(chalk.bold.green('All good — claude-memory is installed and healthy.\n'));
  } else {
    console.log(chalk.bold.yellow('Issues found. Run npx claude-memory install to fix.\n'));
  }
}
