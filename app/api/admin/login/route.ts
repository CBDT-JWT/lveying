import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { userManager } from '@/lib/userManager';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    console.log('=== 登录调试信息 ===');
    console.log('收到密码长度:', password?.length);

    if (!password) {
      return NextResponse.json(
        { error: '请输入密码' },
        { status: 400 }
      );
    }

    // 使用用户管理器验证admin密码
    const isValid = await userManager.verifyPassword('admin', password);
    
    console.log('密码验证结果:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成 JWT token
    const token = generateToken({ 
      username: 'admin', 
      role: 'admin',
      loginTime: new Date().toISOString()
    });

    console.log('✅ 登录成功，生成token');

    return NextResponse.json({ 
      success: true, 
      token,
      message: '登录成功'
    });
  } catch (error) {
    console.error('❌ 登录过程出错:', error);
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    );
  }
}
