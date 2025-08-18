import { ZohoAuth } from '@/lib/zoho-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      );
    }

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
    
    // 构建请求体
    const requestBody = {
      listkey: listKey,
      contactinfo: {
        Contact_Email: email,
        Contact_Source: 'LANKO Waiting List',
        First_Name: email.split('@')[0],
      },
      resfmt: 'JSON',
    };

    console.log('Sending request to Zoho Campaigns:', {
      url: `${baseUrl}/json/listsubscribe`,
      body: requestBody
    });

    // 构建 Zoho Campaigns API 请求
    const response = await fetch(
      `${baseUrl}/json/listsubscribe`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
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
      throw new Error(`Invalid response format: ${responseText.substring(0, 100)}...`);
    }

    // Zoho API 返回 code: 0 表示成功
    if (data.status === 'success' || data.code === 0) {
      return NextResponse.json({
        message: '感谢您的订阅，我们会在LANKO蓝扣上线时通知您。',
      });
    } else {
      // 处理已存在的订阅者
      if (data.message?.includes('already exists')) {
        return NextResponse.json(
          { error: '该邮箱地址已经在等候列表中了。' },
          { status: 400 }
        );
      }
      
      throw new Error(data.message || '订阅失败');
    }
  } catch (error) {
    console.error('Zoho Campaigns API error:', error);
    return NextResponse.json(
      { error: '抱歉，提交过程中出现了问题，请稍后再试。' },
      { status: 500 }
    );
  }
}