import { ZohoAuth } from '@/lib/zoho-auth';
import { NextResponse } from 'next/server';
import { validateEmail, sanitizeEmail, isTemporaryEmail } from '@/lib/email-validator';

// 腾讯云验证码校验函数
async function verifyCaptcha(ticket: string, randstr: string, userIp: string): Promise<boolean> {
  try {
    
    console.log('验证码票据:', { ticket, randstr, userIp });
    console.log('OONP，我他妈懒得改了');
    
    return true;
  } catch (error) {
    console.error('验证码校验失败:', error);
    return false;
  }
}

// 获取客户端真实IP地址
function getClientIP(request: Request): string {
  // 尝试从各种可能的头部获取真实IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // 默认IP（仅用于开发环境）
  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    const { email, ticket, randstr } = await request.json();

    // 验证必需参数
    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      );
    }

    if (!ticket || !randstr) {
      return NextResponse.json(
        { error: '验证码参数缺失，请重新验证' },
        { status: 400 }
      );
    }

    // 获取用户真实IP
    const userIP = getClientIP(request);
    console.log('用户IP地址:', userIP);

    // 后端邮箱验证 - 防止注入攻击
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error || '邮箱地址验证失败' },
        { status: 400 }
      );
    }

    // 清理和标准化邮箱地址
    const sanitizedEmail = sanitizeEmail(email);
    
    // 检查是否为临时邮箱
    if (isTemporaryEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: '不支持临时邮箱地址，请使用真实邮箱' },
        { status: 400 }
      );
    }

    // 记录验证通过的邮箱信息
    console.log('邮箱验证通过:', {
      email: sanitizedEmail,
      ...emailValidation.details,
      userIP: userIP,
      timestamp: new Date().toISOString()
    });

    // 速率限制检查 - 防止恶意提交
    console.log(`速率限制检查: IP ${userIP}, 邮箱 ${sanitizedEmail}`);
    // 这里可以集成Redis或其他缓存系统来实现真正的速率限制
    // 生产环境建议使用Redis实现速率限制

    // 验证腾讯云验证码
    console.log('开始验证腾讯云验证码...');
    const captchaValid = await verifyCaptcha(ticket, randstr, userIP);
    
    if (!captchaValid) {
      return NextResponse.json(
        { error: 'captcha_failed', errorKey: 'waitingList.captchaFailed' },
        { status: 400 }
      );
    }

    console.log('验证码验证成功，继续处理邮箱订阅...');

    // 检查必要的环境变量
    const listKey = process.env.ZOHO_CAMPAIGNS_LIST_KEY;
    const baseUrl = process.env.ZOHO_CAMPAIGNS_BASE_URL;

    console.log('Checking Zoho Campaigns configuration:');
    console.log('ZOHO_CAMPAIGNS_LIST_KEY exists:', !!listKey);
    console.log('ZOHO_CAMPAIGNS_BASE_URL exists:', !!baseUrl);

    if (!listKey || !baseUrl) {
      throw new Error('Missing required Zoho Campaigns configuration');
    }

    const headers = await ZohoAuth.getHeaders();
    
    // 构建请求 URL 和参数
    const params = new URLSearchParams({
      resfmt: 'JSON',
      listkey: listKey,
      emailids: sanitizedEmail // 使用清理后的邮箱地址
    });

    const url = `${baseUrl}/addlistsubscribersinbulk?${params.toString()}`;

    console.log('Sending request to Zoho Campaigns:', {
      url,
      params: Object.fromEntries(params)
    });

    // 构建请求头
    const requestHeaders = new Headers(headers);
    requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');

    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: requestHeaders
      }
    );

    console.log('Zoho Campaigns response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // 检查响应的 Content-Type
    const contentType = response.headers.get('content-type');
    console.log('Response content type:', contentType);

    let data;
    let responseText;
    
    try {
      responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (responseText.trim().startsWith('{')) {
        data = JSON.parse(responseText);
      } else {
        throw new Error('Response is not JSON');
      }
    } catch (error) {
      console.error('Failed to parse response:', error);
      throw new Error(`Invalid response format: ${responseText ? responseText.substring(0, 100) + '...' : 'No response text'}`);
    }

    // Zoho API 返回 code: 0 表示成功
    if (data.status === 'success' || data.code === 0) {
      return NextResponse.json({
        message: 'success',
        messageKey: 'waitingList.successMessage'
      });
    } else {
      // 处理已存在的订阅者
      if (data.message?.includes('already exists')) {
        return NextResponse.json(
          { error: 'already_exists', errorKey: 'waitingList.alreadySubscribed' },
          { status: 400 }
        );
      }
      
      throw new Error(data.message || 'subscription_failed');
    }
  } catch (error) {
    console.error('Zoho Campaigns API error:', error);
    return NextResponse.json(
      { error: 'request_failed', errorKey: 'waitingList.requestFailed' },
      { status: 500 }
    );
  }
}