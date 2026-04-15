import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', '..', 'templates');

/**
 * Reads a template file and replaces {{VARIABLE}} placeholders.
 * @param {string} templatePath - relative path from templates/ directory
 * @param {object} vars - key/value pairs for placeholder replacement
 */
export async function renderTemplate(templatePath, vars = {}) {
  const fullPath = path.join(TEMPLATES_DIR, templatePath);
  let content;
  try {
    content = await fs.readFile(fullPath, 'utf8');
  } catch (e) {
    throw new Error(`Template not found: ${templatePath} (looked in ${fullPath})`);
  }
  for (const [key, value] of Object.entries(vars)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }
  return content;
}

/**
 * Writes a rendered template to a destination path.
 * Skips if file already exists (unless overwrite: true).
 */
export async function writeTemplate(templatePath, destPath, vars = {}, { overwrite = false } = {}) {
  if (!overwrite && fs.existsSync(destPath)) {
    return { status: 'skipped', reason: 'already exists' };
  }
  const content = await renderTemplate(templatePath, vars);
  await fs.ensureDir(path.dirname(destPath));
  await fs.writeFile(destPath, content, 'utf8');
  return { status: 'written' };
}
