import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', 'config.env') });

async function fixAuthIssues() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check existing admins
    const existingAdmins = await Admin.find({});
    console.log('\n📋 Existing Admins:');
    existingAdmins.forEach((admin, index) => {
      console.log(`${index + 1}. Name: ${admin.firstName} ${admin.lastName}`);
      console.log(`   Phone: ${admin.phoneNumber}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Is Active: ${admin.isActive}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log('');
    });

    // Test phone number from the login attempt
    const testPhoneNumber = '9552567681';
    
    // Find admin with this phone number
    const existingAdmin = await Admin.findOne({ phoneNumber: testPhoneNumber });
    
    if (existingAdmin) {
      console.log(`🔍 Found admin with phone ${testPhoneNumber}:`);
      console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Is Active: ${existingAdmin.isActive}`);
      
      // Test password comparison
      const testPassword = '123456';
      const isPasswordValid = await bcrypt.compare(testPassword, existingAdmin.password);
      console.log(`   Password '${testPassword}' valid: ${isPasswordValid}`);
      
      if (!isPasswordValid) {
        console.log(`\n🔧 Updating password for admin with phone ${testPhoneNumber}...`);
        const hashedPassword = await bcrypt.hash(testPassword, 12);
        await Admin.findByIdAndUpdate(existingAdmin._id, { 
          password: hashedPassword,
          isActive: true 
        });
        console.log('✅ Password updated successfully!');
      }
    } else {
      console.log(`\n🔧 Creating new admin with phone ${testPhoneNumber}...`);
      const testAdmin = new Admin({
        firstName: 'Test',
        lastName: 'Admin',
        email: 'test@admin.com',
        phoneNumber: testPhoneNumber,
        password: '123456',
        role: 'admin',
        isActive: true
      });

      await testAdmin.save();
      console.log('✅ Test admin created successfully!');
    }

    // Final verification
    console.log('\n🔍 Final verification:');
    const finalAdmin = await Admin.findOne({ phoneNumber: testPhoneNumber }).select('+password');
    if (finalAdmin) {
      const isPasswordValid = await bcrypt.compare('123456', finalAdmin.password);
      console.log(`✅ Admin exists: ${finalAdmin.firstName} ${finalAdmin.lastName}`);
      console.log(`✅ Phone: ${finalAdmin.phoneNumber}`);
      console.log(`✅ Password valid: ${isPasswordValid}`);
      console.log(`✅ Role: ${finalAdmin.role}`);
      console.log(`✅ Is Active: ${finalAdmin.isActive}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📤 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixAuthIssues();