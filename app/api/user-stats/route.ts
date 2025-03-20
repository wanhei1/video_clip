import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { config } from "@/auth";

// 模拟数据存储 - 在实际应用中，这应该使用数据库
const userStats: Record<
  string,
  { videosProcessed: number; clipsCreated: number }
> = {};

// 获取用户统计数据
export async function GET(req: NextRequest) {
  const session = await getServerSession(config);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // 如果用户没有统计数据，初始化为0
  if (!userStats[userId]) {
    userStats[userId] = { videosProcessed: 0, clipsCreated: 0 };
  }

  return NextResponse.json(userStats[userId]);
}

// 更新用户统计数据
export async function POST(req: NextRequest) {
  const session = await getServerSession(config);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { videosProcessed = 0, clipsCreated = 0 } = await req.json();

  // 如果用户没有统计数据，初始化
  if (!userStats[userId]) {
    userStats[userId] = { videosProcessed: 0, clipsCreated: 0 };
  }

  // 更新统计数据
  if (videosProcessed > 0) {
    userStats[userId].videosProcessed += videosProcessed;
  }

  if (clipsCreated > 0) {
    userStats[userId].clipsCreated += clipsCreated;
  }

  return NextResponse.json(userStats[userId]);
}
