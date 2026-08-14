import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcDir = path.join(rootDir, 'game_ready_assets');
const destDir = path.join(rootDir, 'public', 'assets');
const destGameReady = path.join(rootDir, 'public', 'game_ready_assets');

fs.mkdirSync(destDir, { recursive: true });
fs.mkdirSync(destGameReady, { recursive: true });

fs.cpSync(srcDir, destDir, { recursive: true });
fs.cpSync(srcDir, destGameReady, { recursive: true });

console.log('Successfully copied game_ready_assets to public/assets and public/game_ready_assets');
