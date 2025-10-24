import { auth } from '@/lib/better-auth-setup/auth';
import { prisma } from '@/lib/prisma-setup/db';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    const origin = await prisma.origin.create({
      data: { name: name.trim() },
    });

    revalidatePath('/');

    return NextResponse.json(origin, { status: 201 });
  } catch (error) {
    console.error('Error creating origin:', error);
    return NextResponse.json(
      { error: 'Failed to create origin' },
      { status: 500 }
    );
  }
}
