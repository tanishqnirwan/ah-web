import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, category } = body;

    if (!name || !email || !phone || !category) {
      return NextResponse.json(
        { error: 'Name, email, phone, and category are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const waitlistEntry = await prisma.waitlist.create({
      data: {
        name,
        email,
        phone,
        message: message || null,
        category,
      },
    });

    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist',
        id: waitlistEntry.id 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('Waitlist submission error:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('email')) {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}