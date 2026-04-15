import os from 'os';
import path from 'path';
import fs from 'fs-extra';

/**
 * Returns the iCloud Drive path on macOS, or null if not found.
 * Standard path: ~/Library/Mobile Documents/com~apple~CloudDocs
 */
export function getiCloudPath() {
  const macPath = path.join(
    os.homedir(),
    'Library',
    'Mobile Documents',
    'com~apple~CloudDocs'
  );
  if (fs.existsSync(macPath)) return macPath;
  return null;
}

/**
 * Returns the claude-memory base path: {iCloud}/Claude
 */
export function getMemoryBasePath() {
  const icloud = getiCloudPath();
  if (!icloud) return null;
  return path.join(icloud, 'Claude');
}

/**
 * Returns full paths for all claude-memory folders.
 */
export function getMemoryPaths() {
  const base = getMemoryBasePath();
  if (!base) return null;
  return {
    base,
    claudeMemory: path.join(base, 'claude-memory'),
    projects: path.join(base, 'claude-memory', 'projects'),
    system: path.join(base, 'claude-memory', 'system'),
    commands: path.join(base, 'commands'),
  };
}
