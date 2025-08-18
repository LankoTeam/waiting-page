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

    const headers = await ZohoAuth.getHeaders();
    
    // 构建 Zoho Campaigns API 请求
    const response = await fetch(
      `${process.env.ZOHO_CAMPAIGNS_BASE_URL}/json/listsubscribe`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          listkey: process.env.ZOHO_CAMPAIGNS_LIST_KEY,
          contactinfo: {
            Contact_Email: email,
            Contact_Source: 'LANKO Waiting List',
            First_Name: email.split('@')[0], // 使用邮箱前缀作为名字
          },
          resfmt: 'JSON',
        }),
      }
    );

    // 检查响应的 Content-Type
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      // 如果不是 JSON 响应，获取文本内容用于错误信息
      const text = await response.text();
      console.error('Unexpected response format:', text);
      throw new Error('API returned non-JSON response');
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