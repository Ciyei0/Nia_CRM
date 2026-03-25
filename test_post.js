const https = require('https');
const data = JSON.stringify({ name: 'AI Test', email: 'aitest123666@niacrmbot.com', password: 'password123', phone: '12345' });
const options = {
  hostname: 'backend.niacrmbot.com',
  port: 443,
  path: '/companies/cadastro',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
};
const req = https.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});
req.on('error', error => console.error(error));
req.write(data);
req.end();
