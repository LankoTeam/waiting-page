/**
 * 邮箱验证工具函数
 * 提供全面的邮箱格式验证和安全检查
 */

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  email?: string;
  details?: {
    length: number;
    localPartLength: number;
    domainPartLength: number;
  };
}

/**
 * 验证邮箱地址
 * @param email 待验证的邮箱地址
 * @returns EmailValidationResult 验证结果
 */
export function validateEmail(email: string): EmailValidationResult {
  try {
    // 1. 基础检查
    if (!email || typeof email !== 'string') {
      return { isValid: false, error: '邮箱地址不能为空' };
    }

    const emailStr = email.trim();
    
    // 2. 长度验证
    if (emailStr.length < 5 || emailStr.length > 254) {
      return { isValid: false, error: '邮箱地址长度无效' };
    }

    // 3. 格式验证 - 使用RFC 5322标准
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(emailStr)) {
      return { isValid: false, error: '邮箱地址格式无效' };
    }

    // 4. 特殊字符过滤 - 防止XSS和注入攻击
    const dangerousChars = /[<>\"'&]/;
    if (dangerousChars.test(emailStr)) {
      return { isValid: false, error: '邮箱地址包含无效字符' };
    }

    // 5. 分割邮箱地址
    const parts = emailStr.split('@');
    if (parts.length !== 2) {
      return { isValid: false, error: '邮箱地址格式无效' };
    }

    const localPart = parts[0];
    const domainPart = parts[1];

    // 6. 本地部分验证
    if (localPart.length > 64) {
      return { isValid: false, error: '邮箱用户名部分过长' };
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return { isValid: false, error: '邮箱用户名不能以点号开头或结尾' };
    }

    // 7. 域名部分验证
    if (domainPart.length > 63) {
      return { isValid: false, error: '邮箱域名过长' };
    }

    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
      return { isValid: false, error: '邮箱域名不能以点号开头或结尾' };
    }

    // 8. 连续点号检查
    if (emailStr.includes('..')) {
      return { isValid: false, error: '邮箱地址不能包含连续点号' };
    }

    // 9. 顶级域名验证
    const domainParts = domainPart.split('.');
    if (domainParts.length < 2) {
      return { isValid: false, error: '邮箱域名格式无效' };
    }

    const topLevelDomain = domainParts[domainParts.length - 1];
    if (topLevelDomain.length < 2) {
      return { isValid: false, error: '顶级域名长度不足' };
    }

    // 10. 验证通过
    return {
      isValid: true,
      email: emailStr,
      details: {
        length: emailStr.length,
        localPartLength: localPart.length,
        domainPartLength: domainPart.length,
      }
    };

  } catch (error) {
    console.error('邮箱验证过程中发生错误:', error);
    return { isValid: false, error: '邮箱验证失败' };
  }
}

/**
 * 清理和标准化邮箱地址
 * @param email 原始邮箱地址
 * @returns 清理后的邮箱地址
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }
  
  return email.trim().toLowerCase();
}

/**
 * 检查邮箱是否为常见临时邮箱
 * @param email 邮箱地址
 * @returns 是否为临时邮箱
 */
export function isTemporaryEmail(email: string): boolean {
  const tempDomains = [
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com',
    'tempmail.org',
    'throwaway.email',
    'yopmail.com',
    'dispostable.com',
    'mailnesia.com',
    'sharklasers.com',
    'getairmail.com'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return tempDomains.includes(domain || '');
}
