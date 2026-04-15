import fs from 'fs-extra';
import path from 'path';
import os from 'os';

/**
 * Creates a symlink from linkPath → targetPath.
 * If already correct symlink, skips.
 * If existing file/folder at linkPath, backs it up first.
 */
export async function createSymlink(targetPath, linkPath) {
  if (fs.existsSync(linkPath)) {
    try {
      const existing = fs.readlinkSync(linkPath);
      if (existing === targetPath) {
        return { status: 'skipped', reason: 'already correct' };
      }
    } catch (e) {
      // Not a symlink — back it up
    }
    const backup = `${linkPath}.backup-${Date.now()}`;
    await fs.move(linkPath, backup);
    return await _createLink(targetPath, linkPath, `backed up existing file`);
  }
  return await _createLink(targetPath, linkPath, 'created');
}

async function _createLink(target, link, reason) {
  await fs.ensureDir(path.dirname(link));
  await fs.symlink(target, link);
  return { status: 'created', reason };
}

/**
 * Returns the ~/.claude path.
 */
export function getDotClaudePath() {
  return path.join(os.homedir(), '.claude');
}

/**
 * Checks if a symlink exists and points to the right target.
 */
export function checkSymlink(linkPath, expectedTarget) {
  if (!fs.existsSync(linkPath)) return { ok: false, reason: 'missing' };
  try {
    const actual = fs.readlinkSync(linkPath);
    if (actual === expectedTarget) return { ok: true };
    return { ok: false, reason: `points to ${actual} instead of ${expectedTarget}` };
  } catch (e) {
    return { ok: false, reason: 'not a symlink (regular file exists)' };
  }
}
