import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { userManager } from '@/lib/userManager';

export async function POST(request: Request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: '未授权：缺少token' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: '未授权：无效的管理员权限' },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: '请输入当前密码和新密码' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度不能少于6位' },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await userManager.verifyPassword('admin', currentPassword);
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: '当前密码不正确' },
        { status: 400 }
      );
    }

    const success = await userManager.updatePassword('admin', newPassword);
    
    if (!success) {
      return NextResponse.json(
        { error: '密码更新失败，请重试' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: '密码修改成功！请使用新密码重新登录。'
    });

  } catch (error) {
    console.error('修改密码过程出错:', error);
    return NextResponse.json(
      { error: '修改密码失败，请重试' },
      { status: 500 }
    );
  }
}