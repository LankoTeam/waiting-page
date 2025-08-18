require('dotenv').config({ path: '.env.local' });

const clientId = process.env.ZOHO_CLIENT_ID;

if (!clientId) {
  console.log('\n请先在 .env.local 文件中设置您的 Zoho 凭证：\n');
  console.log('ZOHO_CLIENT_ID=您的客户端ID');
  console.log('ZOHO_CLIENT_SECRET=您的客户端密钥');
  process.exit(1);
}

const redirectUri = 'http://localhost:3000/api/auth/callback';
const scope = 'ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.READ';
const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

console.log('\n请访问以下链接获取授权码：\n');
console.log(authUrl);
