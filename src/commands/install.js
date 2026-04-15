import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { getiCloudPath, getMemoryPaths } from '../utils/icloud.js';
import { createSymlink, getDotClaudePath } from '../utils/symlinks.js';
import { writeTemplate } from '../utils/templates.js';

export async function installCommand() {
  console.log(chalk.bold('\n🧠 claude-memory install\n'));

  // 1. Detect iCloud
  const icloud = getiCloudPath();
  if (!icloud) {
    console.error(chalk.red('✗ iCloud Drive not found.'));
    console.log('  Expected path: ~/Library/Mobile Documents/com~apple~CloudDocs');
    console.log('  Make sure iCloud Drive is enabled in System Settings → Apple ID → iCloud.');
    process.exit(1);
  }
  console.log(chalk.green('✓ iCloud Drive found:'), icloud);

  // 2. Create folder structure
  const paths = getMemoryPaths();
  const folders = [paths.claudeMemory, paths.projects, paths.system, paths.commands];
  for (const folder of folders) {
    await fs.ensureDir(folder);
  }
  console.log(chalk.green('✓ Folder structure created'));

  // 3. Write template files (skip if already exist)
  const date = new Date().toISOString().split('T')[0];
  const templateVars = { ICLOUD_PATH: icloud, DATE: date };

  const fileMap = [
    ['CLAUDE.md', path.join(paths.system, 'CLAUDE.md')],
    ['_index.md', path.join(paths.claudeMemory, '_index.md')],
    ['wrap.md', path.join(paths.commands, 'wrap.md')],
    ['route.md', path.join(paths.commands, 'route.md')],
  ];

  for (const [template, dest] of fileMap) {
    const result = await writeTemplate(template, dest, templateVars);
    const icon = result.status === 'written' ? chalk.green('✓') : chalk.yellow('~');
    const label = result.status === 'written' ? 'written' : 'skipped (exists)';
    console.log(`${icon} ${path.relative(icloud, dest)} — ${label}`);
  }

  // 4. Create settings.json if missing
  const settingsPath = path.join(paths.system, 'settings.json');
  if (!fs.existsSync(settingsPath)) {
    await fs.writeJson(settingsPath, {
      enabledPlugins: {},
      extraKnownMarketplaces: {}
    }, { spaces: 2 });
    console.log(chalk.green('✓ settings.json — written'));
  } else {
    console.log(chalk.yellow('~ settings.json — skipped (exists)'));
  }

  // 5. Set up ~/.claude symlinks
  console.log(chalk.bold('\nSetting up ~/.claude symlinks...\n'));
  const dotClaude = getDotClaudePath();

  const symlinks = [
    [path.join(paths.system, 'CLAUDE.md'), path.join(dotClaude, 'CLAUDE.md')],
    [paths.commands, path.join(dotClaude, 'commands')],
    [path.join(paths.system, 'settings.json'), path.join(dotClaude, 'settings.json')],
  ];

  for (const [target, link] of symlinks) {
    const result = await createSymlink(target, link);
    const icon = result.status === 'created' ? chalk.green('✓') : chalk.yellow('~');
    console.log(`${icon} ~/.claude/${path.basename(link)} → iCloud (${result.reason})`);
  }

  // Done
  console.log(chalk.bold.green('\n✅ claude-memory installed!\n'));
  console.log('Next steps:');
  console.log('  1. Restart Claude Code to pick up the new CLAUDE.md');
  console.log('  2. Run ' + chalk.cyan('npx claude-memory add-project') + ' inside any project folder');
  console.log('  3. Open that folder in Claude Code and pin it in the sidebar\n');
}
