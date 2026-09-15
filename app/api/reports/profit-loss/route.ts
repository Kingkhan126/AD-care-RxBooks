import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Fetch active (non-void) invoices with line items
    const invoices = await prisma.invoice.findMany({
      where: { status: { not: 'void' } },
      include: { items: true }
    });

    // 2. Fetch catalog items for authoritative cost prices and SKUs
    const catalogItems = await prisma.item.findMany();
    const itemCostMap = new Map(catalogItems.map(i => [i.id, i.costPrice]));
    const itemSkuMap = new Map(catalogItems.map(i => [i.id, i.sku]));

    // 3. Compute Sales Revenue & COGS = SUM(quantity * unit_cost) for items sold
    let salesRevenue = 0;
    let cogs = 0;
    const itemSalesMap: Record<string, {
      itemId: string;
      itemName: string;
      sku: string;
      quantitySold: number;
      totalRevenue: number;
      totalCost: number;
      unitPrice: number;
      costPrice: number;
    }> = {};

    invoices.forEach(inv => {
      salesRevenue += inv.totalAmount;
      inv.items.forEach(line => {
        const costPrice = itemCostMap.get(line.itemId) ?? (line.unitPrice * 0.7);
        const sku = itemSkuMap.get(line.itemId) ?? 'MED-GEN-01';
        const lineCost = line.quantity * costPrice;
        cogs += lineCost;

        const key = line.itemId || line.itemName;
        if (!itemSalesMap[key]) {
          itemSalesMap[key] = {
            itemId: key,
            itemName: line.itemName,
            sku,
            quantitySold: 0,
            totalRevenue: 0,
            totalCost: 0,
            unitPrice: line.unitPrice,
            costPrice
          };
        }
        itemSalesMap[key].quantitySold += line.quantity;
        itemSalesMap[key].totalRevenue += line.amount;
        itemSalesMap[key].totalCost += lineCost;
      });
    });

    // 4. Fetch Operating Expenses (Rent, Software, Utilities)
    const expenses = await prisma.expense.findMany();
    const directExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    // 5. Accounting Financial Summaries
    const grossProfit = salesRevenue - cogs;
    const totalExpenses = cogs + directExpenses;
    const netIncome = salesRevenue - totalExpenses;

    const itemizedSummary = Object.values(itemSalesMap).map(item => ({
      ...item,
      grossProfit: item.totalRevenue - item.totalCost,
      profitMargin: item.totalRevenue > 0 ? ((item.totalRevenue - item.totalCost) / item.totalRevenue) * 100 : 0
    }));

    return NextResponse.json({
      salesRevenue,
      cogs,
      grossProfit,
      directExpenses,
      totalExpenses,
      netIncome,
      itemizedSummary
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
