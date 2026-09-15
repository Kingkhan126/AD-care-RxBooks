import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("API Error (GET /api/audit-logs):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const log = await prisma.auditLog.create({
      data: {
        timestamp: data.timestamp || new Date().toLocaleString(),
        userName: data.userName || 'Admin',
        action: data.action,
        module: data.module,
        details: data.details,
        ipAddress: data.ipAddress || '127.0.0.1'
      }
    });
    return NextResponse.json(log);
  } catch (error: any) {
    console.error("API Error (POST /api/audit-logs):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
