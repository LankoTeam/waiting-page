// 腾讯云验证码配置
export const captchaConfig = {
  // 前端配置（公开）
  appId: process.env.NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID || '',
  
  // 后端配置（私有）
  appSecret: process.env.TENCENT_CAPTCHA_APP_SECRET || '',
  
  // API端点
  verifyUrl: 'https://captcha.tencentcloudapi.com/DescribeCaptchaResult',
  
  // 验证码配置选项
  options: {
    enableDarkMode: false,
    bizState: '',
  }
}

// 验证配置是否完整
export function validateCaptchaConfig(): { valid: boolean; message: string } {
  if (!captchaConfig.appId) {
    return { 
      valid: false, 
      message: '缺少 NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID 环境变量' 
    }
  }
  
  if (!captchaConfig.appSecret) {
    return { 
      valid: false, 
      message: '缺少 TENCENT_CAPTCHA_APP_SECRET 环境变量' 
    }
  }
  
  return { valid: true, message: '配置正确' }
}
