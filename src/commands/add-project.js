import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { getiCloudPath } from '../utils/icloud.js';
import { writeTemplate } from '../utils/templates.js';

export async function addProjectCommand(options) {
  const cwd = process.cwd();
  const projectName = path.basename(cwd);
  const projectSlug = projectName.toLowerCase().replace(/\s+/g, '-');
  const icloud = getiCloudPath();
  const date = new Date().toISOString().split('T')[0];
  const machineName = os.hostname().replace('.local', '');

  console.log(chalk.bold(`\nclaude-memory add-project${options.full ? ' --full' : ''}\n`));
  console.log(`Project: ${chalk.cyan(projectName)}`);
  console.log(`Folder:  ${cwd}\n`);

  if (!icloud) {
    console.error(chalk.red('✗ iCloud Drive not found. Run npx claude-memory install first.'));
    process.exit(1);
  }

  const templateVars = {
    PROJECT_NAME: projectName,
    PROJECT_SLUG: projectSlug,
    ICLOUD_PATH: icloud,
    MACHINE_NAME: machineName,
    DATE: date,
  };

  // 1. Write CLAUDE.md
  const claudeResult = await writeTemplate(
    'project-CLAUDE.md',
    path.join(cwd, 'CLAUDE.md'),
    templateVars
  );
  logResult('CLAUDE.md', claudeResult);

  // 2. Write CLAUDE.local.md
  const localResult = await writeTemplate(
    'CLAUDE.local.md',
    path.join(cwd, 'CLAUDE.local.md'),
    templateVars
  );
  logResult('CLAUDE.local.md', localResult);

  // 3. Add CLAUDE.local.md to .gitignore
  const gitignorePath = path.join(cwd, '.gitignore');
  const gitignoreEntry = 'CLAUDE.local.md\n';
  if (fs.existsSync(gitignorePath)) {
    const existing = await fs.readFile(gitignorePath, 'utf8');
    if (!existing.includes('CLAUDE.local.md')) {
      await fs.appendFile(gitignorePath, '\n# claude-memory\n' + gitignoreEntry);
      console.log(chalk.green('✓ .gitignore — CLAUDE.local.md added'));
    } else {
      console.log(chalk.yellow('~ .gitignore — already includes CLAUDE.local.md'));
    }
  } else {
    await fs.writeFile(gitignorePath, '# claude-memory\n' + gitignoreEntry);
    console.log(chalk.green('✓ .gitignore — created'));
  }

  // 4. Create project memory file in iCloud
  const memoryDir = path.join(icloud, 'Claude', 'claude-memory', 'projects');
  const memoryFile = path.join(memoryDir, `${projectSlug}.md`);
  const memoryResult = await writeTemplate('project-memory.md', memoryFile, templateVars);
  logResult(`claude-memory/projects/${projectSlug}.md`, memoryResult);

  // 5. Full scaffold if --full
  if (options.full) {
    console.log(chalk.bold('\nScaffolding full .claude/ structure...\n'));
    const dotClaude = path.join(cwd, '.claude');

    const fullFiles = [
      ['full/rules/conventions.md', path.join(dotClaude, 'rules', 'conventions.md')],
      ['full/rules/style.md', path.join(dotClaude, 'rules', 'style.md')],
      ['full/commands/wrap.md', path.join(dotClaude, 'commands', 'wrap.md')],
      ['full/hooks/validate-bash.sh', path.join(dotClaude, 'hooks', 'validate-bash.sh')],
      ['full/agents/reviewer.md', path.join(dotClaude, 'agents', 'reviewer.md')],
    ];

    for (const [template, dest] of fullFiles) {
      const result = await writeTemplate(template, dest, templateVars);
      logResult(path.relative(cwd, dest), result);
    }

    // Make hook executable
    await fs.chmod(path.join(dotClaude, 'hooks', 'validate-bash.sh'), '755');
  }

  // Done
  console.log(chalk.bold.green('\nProject wired!\n'));
  console.log('Next steps:');
  console.log(`  1. Open ${chalk.cyan(cwd)} in Claude Code`);
  console.log('  2. Pin it in the sidebar (drag to top of Recents)');
  console.log('  3. Start a session — Claude will greet you with project context\n');
}

function logResult(label, result) {
  const icon = result.status === 'written' ? chalk.green('✓') : chalk.yellow('~');
  const note = result.status === 'written' ? '' : ` (${result.reason})`;
  console.log(`${icon} ${label}${note}`);
}
