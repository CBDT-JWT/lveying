import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';

// 禁用缓存，确保每次都获取最新数据
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 验证管理员权限
function verifyAdmin(request: Request) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

// GET - 获取弹幕列表（需要管理员权限）
export async function GET(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const danmakus = dataStore.getDanmakus();
    return NextResponse.json({ danmakus });
  } catch (error) {
    return NextResponse.json(
      { error: '获取弹幕失败' },
      { status: 500 }
    );
  }
}

// POST - 发送弹幕（guest端）
export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '弹幕内容不能为空' },
        { status: 400 }
      );
    }

    if (content.trim().length > 40) {
      return NextResponse.json(
        { error: '弹幕不能超过40字' },
        { status: 400 }
      );
    }

  // 收集客户端 IP（仅用于审核与日志，不应暴露给公众）。
  // 如果部署在代理/负载均衡器后面，记得配置 X-Forwarded-For / X-Real-IP
  // 以便正确获取客户端 IP。
  // 注意：IP 地址应遵守隐私规范，仅供内部使用。
    // 尝试获取客户端 IP（优先使用 x-forwarded-for 或 x-real-ip）。
    // 一些代理或 Node 的 socket 可能返回 IPv6-mapped IPv4 ("::ffff:1.2.3.4")，
    // 所以在保存前进行规范化（尽量返回纯 IPv4）
    const ipHeader = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const rawIp = ipHeader ? ipHeader.split(',')[0].trim() : '';

    const normalizeIp = (ipStr: string) => {
      if (!ipStr) return '';
      // Remove square brackets from IPv6 literal [::1]
      let ip = ipStr.replace(/^\[|\]$/g, '');
      // Remove scope id if present (e.g. fe80::1%en0)
      ip = ip.split('%')[0];
      // If IPv6 mapped IPv4, extract IPv4
      const match = ip.match(/(?:.*::ffff:)?(\d+\.\d+\.\d+\.\d+)$/i);
      if (match) {
        return match[1];
      }
      return ip;
    };

    const ip = normalizeIp(rawIp);

    // 记录日志用于排查
    console.log('👋 新弹幕请求:', { rawIp, ip, content: content.trim() });

    // 如果 IP 已被封禁，则直接拒绝请求
    if (ip && dataStore.isIpBanned(ip)) {
      console.warn('⛔ 拒绝已封禁 IP 的请求', ip);
      return NextResponse.json({ error: '此IP已被封禁' }, { status: 403 });
    }

    const danmaku = dataStore.addDanmaku(content.trim(), ip);
    return NextResponse.json({ success: true, danmaku });
  } catch (error) {
    return NextResponse.json(
      { error: '发送弹幕失败' },
      { status: 500 }
    );
  }
}

// DELETE - 删除弹幕（需要管理员权限）
export async function DELETE(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // 如果没有传id，则清空所有弹幕
    if (!body.id) {
      dataStore.clearDanmakus();
      return NextResponse.json({ success: true });
    }
    
    // 删除单个弹幕
    const success = dataStore.deleteDanmaku(body.id);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '弹幕不存在' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '删除弹幕失败' },
      { status: 500 }
    );
  }
}

// PATCH - 更新弹幕审核状态（需要管理员权限）
export async function PATCH(request: Request) {
  try {
    const user = verifyAdmin(request);
    if (!user) {
      return NextResponse.json(
        { error: '未授权' },
        { status: 401 }
      );
    }

    const { id, censor } = await request.json();

    if (!id || typeof censor !== 'boolean') {
      return NextResponse.json(
        { error: '参数错误' },
        { status: 400 }
      );
    }

    const success = dataStore.updateDanmakuCensor(id, censor);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: '弹幕不存在' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: '更新审核状态失败' },
      { status: 500 }
    );
  }
}


