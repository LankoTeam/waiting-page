import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      );
    }

    // 记录授权码，方便您复制使用
    console.log('Authorization Code:', code);

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f0f2f5;
            }
            .container {
              background: white;
              padding: 2rem;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              text-align: center;
            }
            .code {
              background: #f5f5f5;
              padding: 1rem;
              border-radius: 4px;
              font-family: monospace;
              margin: 1rem 0;
              word-break: break-all;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>授权成功！</h1>
            <p>您的授权码是：</p>
            <div class="code">${code}</div>
            <p>请复制此授权码并按照说明继续配置。</p>
          </div>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json(
      { error: 'Failed to process authorization callback' },
      { status: 500 }
    );
  }
}
