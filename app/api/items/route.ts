import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(items);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
