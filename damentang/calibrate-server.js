// 校准服务器 — 在 damentang 目录下运行: node calibrate-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = 3456;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && (req.url === '/save' || req.url === '/save-bedroom' || req.url === '/save-dark_passage' || req.url === '/save-seal_chamber')) {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const coords = JSON.parse(body);
        const sceneId = req.url === '/save-bedroom' ? 'bedroom' : (req.url === '/save-dark_passage' ? 'dark_passage' : (req.url === '/save-seal_chamber' ? 'seal_chamber' : 'study'));
        const result = applyCoords(coords, sceneId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ ok: false, msg: e.message }));
      }
    });
    return;
  }

  // Static files
  let filePath = req.url === '/' ? '/calibrate.html' : req.url;
  filePath = path.normalize(path.join(ROOT, filePath));
  if (!filePath.startsWith(ROOT)) { res.writeHead(404); res.end('404'); return; }

  const ext = path.extname(filePath);
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  } catch (e) { res.writeHead(404); res.end('404'); }
});

function applyCoords(coords, sceneId) {
  const dataPath = path.join(ROOT, 'js', 'data.js');
  let content = fs.readFileSync(dataPath, 'utf-8');
  const updated = [];

  // Locate the scene block in data.js
  const sceneMarker = new RegExp(
    "(id:\\s*'" + sceneId + "')[\\s\\S]*?elements:\\s*\\["
  );
  const sceneMatch = sceneMarker.exec(content);
  if (!sceneMatch) {
    console.log('  ERROR: scene not found: ' + sceneId);
    return { ok: false, msg: 'Scene not found: ' + sceneId };
  }
  const sceneStart = sceneMatch.index + sceneMatch[0].length;
  // Find matching closing bracket for elements array
  let depth = 1, sceneEnd = sceneStart;
  for (let i = sceneStart; i < content.length && depth > 0; i++) {
    if (content[i] === '[') depth++;
    if (content[i] === ']') depth--;
    sceneEnd = i;
  }
  const sceneBlock = content.substring(sceneStart, sceneEnd);

  for (const c of coords) {
    const escaped = c.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      "(\\{?\\s*id:\\s*'" + escaped + "')[\\s\\S]*?" +
      "(?=\\s*\\}\\s*,?\\s*(?:\\{|\\]|$))",
      'g'
    );
    const match = regex.exec(sceneBlock);
    if (!match) {
      console.log('  NOT FOUND in ' + sceneId + ': ' + c.id);
      continue;
    }

    let block = match[0];
    const origBlock = block;

    block = block.replace(/\bx:\s*\d+/, 'x: ' + c.x);
    block = block.replace(/\by:\s*\d+/, 'y: ' + c.y);

    if (c.bgW !== undefined) {
      block = block.replace(/(bgOverlay:\s*\{[^}]*?\bw:\s*)\d+/, '$1' + c.bgW);
    }
    if (c.bgH !== undefined) {
      block = block.replace(/(bgOverlay:\s*\{[^}]*?\bh:\s*)\d+/, '$1' + c.bgH);
    }

    if (block !== origBlock) {
      content = content.replace(origBlock, block);
      updated.push(c.id + ' {x:' + c.x + ', y:' + c.y +
        (c.bgW !== undefined ? ', bgW:' + c.bgW : '') +
        (c.bgH !== undefined ? ', bgH:' + c.bgH : '') + '}');
    } else {
      console.log('  NO CHANGE: ' + c.id);
    }
  }

  fs.writeFileSync(dataPath, content, 'utf-8');
  console.log('Saved ' + updated.length + ' elements in ' + sceneId);
  return { ok: true, msg: '已更新 ' + sceneId + ' 中 ' + updated.length + ' 个元素', updated };
}

server.listen(PORT, () => {
  console.log('校准服务器已启动: http://localhost:' + PORT);
  console.log('按 Ctrl+C 停止');
});
