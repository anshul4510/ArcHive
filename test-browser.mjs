import { chromium } from 'playwright';
import { exec } from 'child_process';

const server = exec('npm run dev');

setTimeout(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));
    
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    console.log('VISITED: /login');
    await page.goto('http://localhost:5173/signup', { waitUntil: 'networkidle' });
    console.log('VISITED: /signup');
    
    await browser.close();
    server.kill();
    process.exit(0);
  } catch (err) {
    console.error('TEST ERROR:', err);
    server.kill();
    process.exit(1);
  }
}, 5000);
