// pages/_middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const PASSWORD = process.env.PASSWORD || 'titicampus2025'; // 在 Vercel 环境变量里设置正式密码

  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = Buffer.from(token, 'base64').toString();
      const [, password] = decoded.split(':');

      if (password === PASSWORD) {
        return NextResponse.next();
      }
    } catch (e) {
      // ignore invalid header
    }
  }

  // 返回自定义密码输入页面
  const html = `
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>访问受限 - 请登录</title>
    <style>
      body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f2f5; }
      .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); text-align: center; max-width: 380px; width: 90%; }
      h1 { margin: 0 0 20px; color: #1a1a1a; }
      input { width: 100%; padding: 14px; margin: 12px 0; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
      button { width: 100%; padding: 14px; background: #0066ff; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
      button:hover { background: #0055dd; }
      .error { color: #e74c3c; margin-top: 10px; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>🔒 站点访问密码</h1>
      <p>请输入密码以继续访问</p>
      <form id="form">
        <input type="password" id="pw" placeholder="密码" autocomplete="current-password" required autofocus />
        <button type="submit">登录</button>
        <div id="error" class="error"></div>
      </form>
    </div>
    <script>
      const saved = localStorage.getItem('moonPass');
      if (saved) document.getElementById('pw').value = saved;

      document.getElementById('form').onsubmit = (e) => {
        e.preventDefault();
        const pass = document.getElementById('pw').value.trim();
        if (!pass) {
          document.getElementById('error').textContent = '请输入密码';
          return;
        }
        localStorage.setItem('moonPass', pass);
        const auth = btoa(':' + pass);
        location.href = location.origin + location.pathname + '?auth=' + auth;
      };
    </script>
  </body>
</html>
`;

  return new NextResponse(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}