import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sounds = {
  'new-report.mp3': 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  'critical-alert.mp3': 'https://assets.mixkit.co/active_storage/sfx/2865/2865-preview.mp3',
  'status-change.mp3': 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3',
  'message.mp3': 'https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3',
  'alert1.mp3': 'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3',
  'alert2.mp3': 'https://assets.mixkit.co/active_storage/sfx/2864/2864-preview.mp3',
  'alert3.mp3': 'https://assets.mixkit.co/active_storage/sfx/2863/2863-preview.mp3',
  'urgent1.mp3': 'https://assets.mixkit.co/active_storage/sfx/2862/2862-preview.mp3',
  'urgent2.mp3': 'https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3',
  'urgent3.mp3': 'https://assets.mixkit.co/active_storage/sfx/2860/2860-preview.mp3',
  'update1.mp3': 'https://assets.mixkit.co/active_storage/sfx/2859/2859-preview.mp3',
  'update2.mp3': 'https://assets.mixkit.co/active_storage/sfx/2858/2858-preview.mp3',
  'update3.mp3': 'https://assets.mixkit.co/active_storage/sfx/2857/2857-preview.mp3',
  'message1.mp3': 'https://assets.mixkit.co/active_storage/sfx/2856/2856-preview.mp3',
  'message2.mp3': 'https://assets.mixkit.co/active_storage/sfx/2855/2855-preview.mp3',
  'message3.mp3': 'https://assets.mixkit.co/active_storage/sfx/2854/2854-preview.mp3'
};

const soundsDir = path.join(__dirname, '../public/sounds');

// Create sounds directory if it doesn't exist
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// Download each sound file
Object.entries(sounds).forEach(([filename, url]) => {
  const filePath = path.join(soundsDir, filename);
  
  https.get(url, (response) => {
    const file = fs.createWriteStream(filePath);
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename}`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${filename}:`, err.message);
  });
}); 