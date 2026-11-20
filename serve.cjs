// Refah Man - tiny local web server (any OS with Node.js, no npm install needed)
// Usage: node serve.cjs   ->  http://localhost:5180
const http = require('http')
const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const root = path.join(__dirname, 'dist')
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8',
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error("dist/index.html not found. Run 'npm install' and 'npm run build' first.")
  process.exit(1)
}

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html'
  let file = path.resolve(root, rel)
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (path.extname(rel)) {
      res.writeHead(404)
      return res.end()
    }
    file = path.join(root, 'index.html')
  }
  res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})

function listen(port) {
  server.once('error', () => (port < 5190 ? listen(port + 1) : console.error('No free port between 5180 and 5190.')))
  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}/`
    console.log(`\n  Refah Man is running at ${url}\n  Login: username 1111 / password 1111 (all codes are 1111)\n  Press Ctrl+C to stop.\n`)
    const open = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`
    exec(open)
  })
}
listen(5180)
