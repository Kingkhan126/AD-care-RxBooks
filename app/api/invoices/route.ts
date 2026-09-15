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
    const invoices = await prisma.invoice.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Database unavailable' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        customerId: data.customerId,
        customerName: data.customerName,
        customerEmail: data.customerEmail || '',
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        subtotal: Number(data.subtotal || 0),
        taxTotal: Number(data.taxTotal || 0),
        discountTotal: Number(data.discountTotal || 0),
        shippingTotal: Number(data.shippingTotal || 0),
        totalAmount: Number(data.totalAmount || 0),
        amountPaid: Number(data.amountPaid || 0),
        balanceDue: Number(data.balanceDue || 0),
        status: data.status || 'sent',
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
    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating invoice' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, items, ...data } = await req.json();
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const updated = await prisma.invoice.update({
      where: { id },
      data,
      include: { items: true }
    });
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating invoice' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.invoice.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting invoice' }, { status: 500 });
  }
}
