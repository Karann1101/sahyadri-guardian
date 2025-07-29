import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  displayName: { 
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, { 
  timestamps: true 
});

// Add index for better query performance
userSchema.index({ email: 1 });

export const User = models.User || model('User', userSchema); 