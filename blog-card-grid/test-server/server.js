import http from 'node:http';
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  if (req.url === '/api/welcome' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from raw Node' }));
  } else if (req.url === '/api/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { 
        console.log('chunk received:', chunk.toString()); 
        body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: data }));
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});
server.listen(3000, () => console.log('Node server on 3000'));