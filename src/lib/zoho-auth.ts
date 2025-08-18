export class ZohoAuth {
  private static async getAccessToken(): Promise<string> {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    
    // 检查环境变量
    console.log('Checking environment variables:');
    console.log('ZOHO_REFRESH_TOKEN exists:', !!refreshToken);
    console.log('ZOHO_CLIENT_ID exists:', !!clientId);
    console.log('ZOHO_CLIENT_SECRET exists:', !!clientSecret);
    
    if (!refreshToken || !clientId || !clientSecret) {
      throw new Error('Missing required Zoho OAuth credentials');
    }

    try {
      console.log('Requesting new access token...');
      const response = await fetch(
        'https://accounts.zoho.com/oauth/v2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
          }),
        }
      );

      // 检查响应状态
      if (!response.ok) {
        const text = await response.text();
        console.error('Token request failed:', {
          status: response.status,
          statusText: response.statusText,
          response: text
        });
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Token response:', {
        success: !!data.access_token,
        error: data.error,
        error_description: data.error_description
      });
      
      if (!data.access_token) {
        throw new Error('Failed to get access token: ' + JSON.stringify(data));
      }

      return data.access_token;
    } catch (error) {
      console.error('Token request error:', error);
      throw error;
    }
  }

  public static async getHeaders(): Promise<Headers> {
    const accessToken = await this.getAccessToken();
    console.log('Using access token:', accessToken.substring(0, 10) + '...');
    return new Headers({
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    });
  }
}
