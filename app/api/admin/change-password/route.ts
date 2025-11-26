import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// 获取当前密码哈希（优先从文件读取以避免 $ 符号问题）
function getCurrentPasswordHash(): string | null {
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
  
  return null;
}

// 更新 .env.local 文件中的密码哈希
function updatePasswordInEnv(newPasswordHash: string) {
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    // 读取现有的 .env.local 文件
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }
    
    // 更新或添加 ADMIN_PASSWORD_HASH（用双引号包裹以避免 $ 符号问题）
    const lines = envContent.split('\n');
    let updated = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('ADMIN_PASSWORD_HASH=')) {
        lines[i] = `ADMIN_PASSWORD_HASH="${newPasswordHash}"`;
        updated = true;
        break;
      }
    }
    
    if (!updated) {
      lines.push(`ADMIN_PASSWORD_HASH="${newPasswordHash}"`);
    }
    
    // 写回文件
    fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');
    
    // 更新环境变量（需要重启才能完全生效，但我们可以临时更新）
    process.env.ADMIN_PASSWORD_HASH = newPasswordHash;
    
    console.log('✅ 密码已更新到 .env.local');
    return true;
  } catch (error) {
    console.error('❌ 更新 .env.local 失败:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // 验证管理员权限
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: '令牌无效' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    // 验证输入
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '请提供当前密码和新密码' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码至少需要6个字符' },
        { status: 400 }
      );
    }

    // 验证当前密码
    const storedHash = getCurrentPasswordHash();
    
    if (!storedHash) {
      console.error('❌ 未找到 ADMIN_PASSWORD_HASH');
      return NextResponse.json(
        { error: '系统配置错误：未找到密码配置' },
        { status: 500 }
      );
    }
    
    console.log('✅ 成功获取密码哈希，开始验证...');
    
    const isValidPassword = await bcrypt.compare(currentPassword, storedHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '当前密码不正确' },
        { status: 401 }
      );
    }

    // 生成新密码的哈希
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // 更新 .env.local 文件
    const success = updatePasswordInEnv(newPasswordHash);

    if (!success) {
      return NextResponse.json(
        { error: '密码更新失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: '密码修改成功，请重新登录',
      success: true,
    });
  } catch (error) {
    console.error('修改密码错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
