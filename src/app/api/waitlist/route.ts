import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  console.log('=== WAITLIST API CALLED ===');
  
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');
    
    // Test database connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('Database connected successfully');

    const body = await request.json();
    console.log('Request body received:', { ...body, email: body.email ? '***@***.***' : undefined });
    
    const { name, email, phone, message, category } = body;

    // Validation logging
    console.log('Validation check:', { 
      hasName: !!name, 
      hasEmail: !!email, 
      hasPhone: !!phone, 
      hasCategory: !!category 
    });

    if (!name || !email || !phone || !category) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Name, email, phone, and category are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Validation failed - invalid email format');
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('Creating waitlist entry...');
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        name,
        email,
        phone,
        message: message || null,
        category,
      },
    });

    console.log('Waitlist entry created successfully:', waitlistEntry.id);
    return NextResponse.json(
      { 
        message: 'Successfully added to waitlist',
        id: waitlistEntry.id 
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error('=== ERROR DETAILS ===');
    console.error('Error type:', typeof error);
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    if (error && typeof error === 'object') {
      console.error('Error object keys:', Object.keys(error));
      if ('code' in error) console.error('Error code:', error.code);
      if ('meta' in error) console.error('Error meta:', error.meta);
    }

    // Check for duplicate email error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002' && 'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('email')) {
      console.log('Duplicate email error detected');
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      );
    }

    console.error('=== END ERROR DETAILS ===');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}