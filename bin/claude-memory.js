#!/usr/bin/env node
import { program } from 'commander';
import { createRequire } from 'module';
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
  .action(installCommand);

program
  .command('add-project')
  .description('Wire the current folder as a pinned Claude Code project')
  .option('--full', 'Scaffold full .claude/ structure (rules, commands, hooks, agents)')
  .action((options) => addProjectCommand(options));

program
  .command('status')
  .description('Check claude-memory install health')
  .action(statusCommand);

program.parse();
