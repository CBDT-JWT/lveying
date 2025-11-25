import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';

// 默认管理员密码: admin123
// 这是 admin123 的 bcrypt 哈希值（与.env.local中的匹配）
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$wk0XSi7rOwEqDM1fQCNnxu96nXtwlKAsIa9SzWQtmH9ccZaIg4a5m';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    console.log('=== 登录调试信息 ===');
    console.log('收到密码长度:', password?.length);
    console.log('使用的哈希值:', ADMIN_PASSWORD_HASH);
    console.log('环境变量中的哈希:', process.env.ADMIN_PASSWORD_HASH);

    if (!password) {
      return NextResponse.json(
        { error: '请输入密码' },
        { status: 400 }
      );
    }

    // 验证密码
    console.log('开始验证密码...');
    const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
    console.log('密码验证结果:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 生成JWT token
    const token = generateToken({ role: 'admin' });
    console.log('Token生成成功');

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    );
  }
}
