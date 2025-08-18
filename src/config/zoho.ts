export const zohoConfig = {
  apiKey: process.env.ZOHO_CAMPAIGNS_API_KEY,
  listKey: process.env.ZOHO_CAMPAIGNS_LIST_KEY,
  apiBaseUrl: process.env.ZOHO_CAMPAIGNS_API_BASE_URL || 'https://campaigns.zoho.com/api/v1.1/json',
} as const;
