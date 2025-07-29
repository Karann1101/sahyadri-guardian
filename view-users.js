const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function viewUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ Connected to MongoDB!');
    
    // Get the database
    const db = mongoose.connection.db;
    
    // Get all users from the users collection
    const users = await db.collection('users').find({}).toArray();
    
    console.log(`\n📊 Found ${users.length} user(s) in the database:`);
    console.log('=' .repeat(50));
    
    if (users.length === 0) {
      console.log('❌ No users found in the database');
    } else {
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Display Name: ${user.displayName || 'Not set'}`);
        console.log(`   Role: ${user.role || 'user'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
        console.log(`   Active: ${user.isActive ? 'Yes' : 'No'}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

viewUsers(); 