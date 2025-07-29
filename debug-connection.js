require('dotenv').config({ path: '.env.local' });

console.log('🔍 Debugging MongoDB Connection...');
console.log('📋 Environment variables loaded:', process.env.MONGODB_URI ? '✅ MONGODB_URI found' : '❌ MONGODB_URI missing');

if (process.env.MONGODB_URI) {
  const uri = process.env.MONGODB_URI;
  console.log('🔗 Connection string format check:');
  console.log('   - Starts with mongodb+srv://:', uri.startsWith('mongodb+srv://') ? '✅' : '❌');
  console.log('   - Contains @ symbol:', uri.includes('@') ? '✅' : '❌');
  console.log('   - Contains .mongodb.net:', uri.includes('.mongodb.net') ? '✅' : '❌');
  console.log('   - Contains database name:', uri.includes('/sahyadri_guardian') ? '✅' : '❌');
  
  // Mask the password for security
  const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
  console.log('🔐 Masked connection string:', maskedUri);
}

console.log('\n💡 If any checks failed, please fix your connection string format.'); 