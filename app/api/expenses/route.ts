import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const expense = await prisma.expense.create({
      data: {
        expenseNumber: data.expenseNumber,
        category: data.category,
        amount: Number(data.amount || 0),
        taxAmount: Number(data.taxAmount || 0),
        date: data.date,
        vendorId: data.vendorId || null,
        vendorName: data.vendorName || null,
        paymentMode: data.paymentMode || 'Cash',
        account: data.account || '',
        description: data.description || '',
        receiptUrl: data.receiptUrl || null
      }
    });
    return NextResponse.json(expense);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
