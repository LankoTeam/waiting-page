export class ZohoAuth {
  private static async getAccessToken(): Promise<string> {
    const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    
    if (!refreshToken || !clientId || !clientSecret) {
      throw new Error('Missing required Zoho OAuth credentials');
    }

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

    const data = await response.json();
    
    if (!data.access_token) {
      throw new Error('Failed to get access token: ' + JSON.stringify(data));
    }

    return data.access_token;
  }

  public static async getHeaders(): Promise<Headers> {
    const accessToken = await this.getAccessToken();
    return new Headers({
      'Authorization': `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    });
  }
}
