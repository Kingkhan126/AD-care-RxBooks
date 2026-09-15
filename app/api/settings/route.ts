import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        name: 'Adcare Meds & Pharmacy Online Home Service',
        legalName: 'AD CARE Meds & Pharmacy',
        tagline: 'Online Home Delivery & Pharmacy Service',
        taxId: 'PK-984712093',
        email: 'info@adcare.pk',
        phone: '0342-3010508',
        website: 'https://adcarerxbooks.com',
        currency: 'PKR',
        fiscalYearStart: 'January',
        address: 'Peshawar, Khyber Pakhtunkhwa',
        city: 'Peshawar',
        country: 'Pakistan'
      });
    }
    let settings = await prisma.organizationSettings.findFirst();
    if (!settings) {
      settings = await prisma.organizationSettings.create({
        data: {
          name: 'Adcare Meds & Pharmacy Online Home Service',
          legalName: 'AD CARE Meds & Pharmacy',
          tagline: 'Online Home Delivery & Pharmacy Service',
          taxId: 'PK-984712093',
          email: 'info@adcare.pk',
          phone: '0342-3010508',
          website: 'https://adcarerxbooks.com',
          currency: 'PKR',
          fiscalYearStart: 'January',
          address: 'Peshawar, Khyber Pakhtunkhwa',
          city: 'Peshawar',
          country: 'Pakistan'
        }
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("API Error (GET /api/settings):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    let settings = await prisma.organizationSettings.findFirst();
    if (settings) {
      settings = await prisma.organizationSettings.update({
        where: { id: settings.id },
        data
      });
    } else {
      settings = await prisma.organizationSettings.create({
        data
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("API Error (PUT /api/settings):", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
