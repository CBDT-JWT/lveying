import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// 获取当前密码哈希（优先从文件读取以避免 $ 符号问题）
function getCurrentPasswordHash(): string {
  // 优先从 .env.local 文件直接读取（避免环境变量的 $ 符号问题）
  const envPath = path.join(process.cwd(), '.env.local');
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const match = envContent.match(/ADMIN_PASSWORD_HASH=["']?(.+?)["']?\s*$/m);
      if (match && match[1]) {
        const hash = match[1].trim();
        console.log('✅ 从 .env.local 文件读取密码哈希');
        return hash;
      }
    }
  } catch (error) {
    console.error('❌ 读取 .env.local 失败:', error);
  }
  
  // 如果文件读取失败，尝试从环境变量读取
  if (process.env.ADMIN_PASSWORD_HASH) {
    console.log('✅ 从环境变量读取密码哈希');
    return process.env.ADMIN_PASSWORD_HASH;
  }
  
  // 如果都失败了，返回默认哈希（admin123）
  console.log('⚠️  使用默认密码哈希 (admin123)');
  return '$2a$10$wk0XSi7rOwEqDM1fQCNnxu96nXtwlKAsIa9SzWQtmH9ccZaIg4a5m';
}

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // 获取当前密码哈希
    const ADMIN_PASSWORD_HASH = getCurrentPasswordHash();

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
