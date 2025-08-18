const https = require('https');

// 这些值需要您填写
const authorizationCode = 'YOUR_AUTHORIZATION_CODE'; // 从回调URL获取的授权码
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/api/auth/callback';

const data = new URLSearchParams({
  code: authorizationCode,
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  grant_type: 'authorization_code'
}).toString();

const options = {
  hostname: 'accounts.zoho.com',
  path: '/oauth/v2/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    const response = JSON.parse(responseData);
    console.log('\n获取的令牌信息：');
    console.log(JSON.stringify(response, null, 2));
    
    if (response.refresh_token) {
      console.log('\n请将以下内容添加到 .env.local 文件中：');
      console.log(`ZOHO_REFRESH_TOKEN=${response.refresh_token}`);
    } else {
      console.log('\n获取刷新令牌失败！');
      console.log('错误信息：', response.error || '未知错误');
    }
  });
});

req.on('error', (error) => {
  console.error('请求失败：', error);
});

req.write(data);
req.end();

console.log('正在获取刷新令牌...');
