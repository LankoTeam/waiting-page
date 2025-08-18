import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载 .env.local 文件
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const clientId = process.env.ZOHO_CLIENT_ID;

if (!clientId) {
  console.error('\x1b[31m错误：未找到 ZOHO_CLIENT_ID 环境变量！\x1b[0m');
  console.log('\n请确保您已经在 .env.local 文件中设置了以下内容：');
  console.log('\x1b[33mZOHO_CLIENT_ID=您的客户端ID\x1b[0m');
  process.exit(1);
}

const redirectUri = 'http://localhost:3000/api/auth/callback';
const scope = 'ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.READ';

const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

console.log('\x1b[32m请访问以下链接获取授权码：\x1b[0m');
console.log('\x1b[36m' + authUrl + '\x1b[0m');
