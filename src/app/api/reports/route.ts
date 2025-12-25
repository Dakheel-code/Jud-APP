import { NextResponse } from 'next/server';
import { getDb } from '@/db';
import { reports } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const db = getDb();
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const storeReports = await db
      .select()
      .from(reports)
      .where(eq(reports.storeId, session.storeId))
      .orderBy(desc(reports.createdAt));

    return NextResponse.json({ reports: storeReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب التقارير' },
      { status: 500 }
    );
  }
}
