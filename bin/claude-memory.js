#!/usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'module';
import chalk from 'chalk';
import { installCommand } from '../src/commands/install.js';
import { addProjectCommand } from '../src/commands/add-project.js';
import { statusCommand } from '../src/commands/status.js';

const require = createRequire(import.meta.url);
const { version } = require('../package.json');

program
  .name('claude-memory')
  .description('Zero-infrastructure persistent memory for Claude Code')
  .version(version);

program
  .command('install')
  .description('Set up claude-memory on this machine (iCloud folder + ~/.claude symlinks)')
  .action(async () => {
    try {
      await installCommand();
    } catch (err) {
      console.error(chalk.red('\n✗ Install failed:'), err.message);
      process.exit(1);
    }
  });

program
  .command('add-project')
  .description('Wire the current folder as a pinned Claude Code project')
  .option('--full', 'Scaffold full .claude/ structure (rules, commands, hooks, agents)')
  .action(async (options) => {
    try {
      await addProjectCommand(options);
    } catch (err) {
      console.error(chalk.red('\n✗ add-project failed:'), err.message);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Check claude-memory install health')
  .action(async () => {
    try {
      await statusCommand();
    } catch (err) {
      console.error(chalk.red('\n✗ Status check failed:'), err.message);
      process.exit(1);
    }
  });

program.parse();
