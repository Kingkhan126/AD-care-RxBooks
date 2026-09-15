import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([]);
    }
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database unavailable' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.item.create({
      data: {
        name: data.name,
        sku: data.sku || `SKU-${Date.now()}`,
        type: data.type || 'product',
        unit: data.unit || 'unit',
        salesPrice: Number(data.salesPrice || 0),
        costPrice: Number(data.costPrice || 0),
        taxRate: Number(data.taxRate || 0),
        stockOnHand: Number(data.stockOnHand || 0),
        reorderPoint: Number(data.reorderPoint || 0),
        description: data.description || '',
        status: data.status || 'active'
      }
    });
    return NextResponse.json(item);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updated = await prisma.item.update({
      where: { id },
      data
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating item' }, { status: 500 });
  }
}
