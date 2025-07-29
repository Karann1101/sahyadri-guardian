const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📋 MongoDB URI:', process.env.MONGODB_URI ? '✅ Found' : '❌ Not found');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ Please set MONGODB_URI in your .env.local file');
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections in database:', collections.map(c => c.name));
    
    // Test creating a simple collection
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test document inserted successfully');
    
    // Clean up test document
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully!');
    console.log('\n🎉 Your MongoDB setup is ready!');
    console.log('💡 You can now use MongoDB Compass to view your database');
    console.log('🚀 Your authentication API endpoints are ready to use!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check your MONGODB_URI in .env.local');
    console.log('3. If using Atlas, ensure your IP is whitelisted');
    process.exit(1);
  }
}

testConnection(); 