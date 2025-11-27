const fs = require('fs');
const path = require('path');

// Get current time in the desired format
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const hour = String(now.getHours()).padStart(2, '0');
const minute = String(now.getMinutes()).padStart(2, '0');

const buildTime = `${year}.${month}.${day} ${hour}:${minute}`;

// Write to a .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = `NEXT_PUBLIC_BUILD_TIME=${buildTime}\n`;

fs.writeFileSync(envPath, envContent);
console.log(`Build time set to: ${buildTime}`);
