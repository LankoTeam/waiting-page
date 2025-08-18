require('dotenv').config({ path: '.env.local' });

const authCode = '1000.1e1d5db36c57765564fe7e9029aa76df.09c99541ca28fef4e73bcd21d0ec3734';
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/api/auth/callback';

async function getToken() {
  try {
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: authCode,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();
    
    if (data.refresh_token) {
      console.log('\n✅ 成功获取令牌！\n');
      console.log('请将以下内容添加到 .env.local 文件中：\n');
      console.log(`ZOHO_REFRESH_TOKEN=${data.refresh_token}`);
      console.log('\n访问令牌（1小时后过期）：');
      console.log(`Access Token: ${data.access_token}`);
    } else {
      console.error('\n❌ 获取令牌失败：', data.error || '未知错误');
    }
  } catch (error) {
    console.error('\n❌ 请求失败：', error);
  }
}

getToken();
