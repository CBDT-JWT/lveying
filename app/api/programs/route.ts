import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';

// 验证管理员权限的中间件
function verifyAdmin(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// GET - 获取节目单
export async function GET() {
  try {
    const programs = dataStore.getHierarchicalPrograms();
    return NextResponse.json({ programs });
  } catch (error) {
    return NextResponse.json(
      { error: '获取节目单失败' },
      { status: 500 }
    );
  }
}

// POST - 更新节目单（需要管理员权限）
export async function POST(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { programs } = await request.json();
    dataStore.updatePrograms(programs);

    return NextResponse.json({ success: true, programs });
  } catch (error) {
    return NextResponse.json(
      { error: '更新节目单失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新单个节目状态（需要管理员权限）
export async function PATCH(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { id, completed } = await request.json();
    dataStore.updateProgramStatus(id, completed);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '更新节目状态失败' },
      { status: 500 }
    );
  }
}

// PUT - 更新节目信息（需要管理员权限）
export async function PUT(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { id, title, performer, order, info, parentId, subOrder } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: '节目ID不能为空' },
        { status: 400 }
      );
    }

    // 如果提供了基本信息，更新基本信息
    if (title !== undefined && performer !== undefined && order !== undefined) {
      dataStore.updateProgramDetails(id, title, performer, order, parentId, subOrder);
    }
    
    // 如果提供了详情信息，更新详情
    if (info !== undefined) {
      dataStore.updateProgramInfo(id, info);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '更新节目信息失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除节目（需要管理员权限）
export async function DELETE(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: '节目ID不能为空' },
        { status: 400 }
      );
    }

    dataStore.deleteProgram(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: '删除节目失败' },
      { status: 500 }
    );
  }
}
