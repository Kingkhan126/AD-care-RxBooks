import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
