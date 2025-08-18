import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as dotenv from 'dotenv';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.resolve(process.cwd(), '.env.local');

// 检查是否已存在 .env.local 文件
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  console.log('\x1b[36m=== Zoho Campaigns 配置向导 ===\x1b[0m\n');
  
  // 获取 Client ID
  const clientId = await question('请输入您的 Zoho Client ID: ');
  if (!clientId) {
    console.error('\x1b[31m错误：Client ID 不能为空！\x1b[0m');
    process.exit(1);
  }

  // 获取 Client Secret
  const clientSecret = await question('请输入您的 Zoho Client Secret: ');
  if (!clientSecret) {
    console.error('\x1b[31m错误：Client Secret 不能为空！\x1b[0m');
    process.exit(1);
  }

  // 创建或更新 .env.local 文件
  const envContent = `# Zoho OAuth Configuration
ZOHO_CLIENT_ID=${clientId}
ZOHO_CLIENT_SECRET=${clientSecret}
ZOHO_CAMPAIGNS_BASE_URL=https://campaigns.zoho.com/api/v1.1`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n\x1b[32m✓ 配置已保存到 .env.local 文件\x1b[0m');

  // 生成授权 URL
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const scope = 'ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.READ';
  const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

  console.log('\n\x1b[33m下一步：\x1b[0m');
  console.log('1. 请访问以下链接获取授权码：');
  console.log('\x1b[36m' + authUrl + '\x1b[0m');
  console.log('\n2. 登录您的 Zoho 账号并授权应用');
  console.log('3. 您将被重定向到回调页面，在那里可以看到授权码');
  
  const authCode = await question('\n请输入获取到的授权码: ');
  if (!authCode) {
    console.error('\x1b[31m错误：授权码不能为空！\x1b[0m');
    process.exit(1);
  }

  // 使用授权码获取刷新令牌
  console.log('\n\x1b[33m正在获取刷新令牌...\x1b[0m');
  
  try {
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
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

    const data = await tokenResponse.json();
    
    if (data.refresh_token) {
      // 更新 .env.local 文件，添加刷新令牌
      const newEnvContent = envContent + `\nZOHO_REFRESH_TOKEN=${data.refresh_token}`;
      fs.writeFileSync(envPath, newEnvContent);
      
      console.log('\n\x1b[32m✓ 成功获取刷新令牌！配置已更新。\x1b[0m');
    } else {
      console.error('\n\x1b[31m获取刷新令牌失败：\x1b[0m', data.error || '未知错误');
    }
  } catch (error) {
    console.error('\n\x1b[31m请求失败：\x1b[0m', error);
  }

  rl.close();
}

main().catch(console.error);
