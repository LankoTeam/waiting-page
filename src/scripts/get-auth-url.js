const clientId = process.env.ZOHO_CLIENT_ID;
const redirectUri = 'http://localhost:3000/api/auth/callback';
const scope = 'ZohoCampaigns.contact.CREATE,ZohoCampaigns.contact.READ';

const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${redirectUri}`;

console.log('请访问以下链接获取授权码：');
console.log(authUrl);
