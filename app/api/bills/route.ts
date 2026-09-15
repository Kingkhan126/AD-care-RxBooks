import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bills);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const bill = await prisma.bill.create({
      data: {
        billNumber: data.billNumber,
        vendorId: data.vendorId,
        vendorName: data.vendorName,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        subtotal: Number(data.subtotal || 0),
        taxTotal: Number(data.taxTotal || 0),
        discountTotal: Number(data.discountTotal || 0),
        shippingTotal: Number(data.shippingTotal || 0),
        totalAmount: Number(data.totalAmount || 0),
        amountPaid: Number(data.amountPaid || 0),
        balanceDue: Number(data.balanceDue || 0),
        status: data.status || 'received',
        notes: data.notes || '',
        terms: data.terms || '',
        items: {
          create: (data.items || []).map((it: any) => ({
            itemId: it.itemId || '',
            itemName: it.itemName || '',
            description: it.description || '',
            quantity: Number(it.quantity || 1),
            unitPrice: Number(it.unitPrice || 0),
            taxRate: Number(it.taxRate || 0),
            amount: Number(it.amount || 0)
          }))
        }
      },
      include: { items: true }
    });
    return NextResponse.json(bill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, items, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updated = await prisma.bill.update({
      where: { id },
      data,
      include: { items: true }
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.bill.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
