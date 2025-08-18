import { zohoConfig } from '@/config/zoho'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: '邮箱地址是必需的' },
        { status: 400 }
      )
    }

    // 构建 Zoho Campaigns API 请求
    const response = await fetch(`${zohoConfig.apiBaseUrl}/listsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resfmt: 'JSON',
        listkey: zohoConfig.listKey,
        apikey: zohoConfig.apiKey,
        contactinfo: {
          Contact_Email: email,
          Contact_Source: 'LANKO Waiting List',
        },
      }),
    })

    const data = await response.json()

    // Zoho API 返回 code: 0 表示成功
    if (data.status === 'success' || data.code === 0) {
      return NextResponse.json({
        message: '感谢您的订阅，我们会在LANKO蓝扣上线时通知您。',
      })
    } else {
      // 处理已存在的订阅者
      if (data.message?.includes('already exists')) {
        return NextResponse.json(
          { error: '该邮箱地址已经在等候列表中了。' },
          { status: 400 }
        )
      }
      
      throw new Error(data.message || '订阅失败')
    }
  } catch (error) {
    console.error('Zoho Campaigns API error:', error)
    return NextResponse.json(
      { error: '抱歉，提交过程中出现了问题，请稍后再试。' },
      { status: 500 }
    )
  }
}
