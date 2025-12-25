import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { users, stores } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { fullName, email, password, storeName, storeUrl } = await request.json();

    if (!fullName || !email || !password || !storeName) {
      return NextResponse.json(
        { error: 'جميع الحقول المطلوبة يجب ملؤها' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    const [store] = await db
      .insert(stores)
      .values({
        storeName,
        storeUrl: storeUrl || null,
      })
      .returning();

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        fullName,
        email,
        passwordHash,
        storeId: store.id,
        role: 'user',
      })
      .returning();

    const token = await createSession({
      userId: user.id,
      storeId: user.storeId,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        storeId: user.storeId,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الحساب' },
      { status: 500 }
    );
  }
}
