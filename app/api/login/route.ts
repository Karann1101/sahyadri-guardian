import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import { User } from '@/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Define LoginEvent schema and model
const loginEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});
const LoginEvent = mongoose.models.LoginEvent || mongoose.model('LoginEvent', loginEventSchema);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDB();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: 'Account is deactivated' }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log the sign-in event
    await LoginEvent.create({
      userId: user._id,
      email: user.email,
      timestamp: new Date()
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          displayName: user.displayName,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 