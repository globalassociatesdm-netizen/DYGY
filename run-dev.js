const { spawn } = require('child_process');

console.log('Starting Dygytaly Full-Stack Development Environment...');

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  shell: true
});

const client = spawn('npx', ['vite', '--port', '3000'], {
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  server.kill();
  client.kill();
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
