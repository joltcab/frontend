import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/joltcab';

// Definir el schema del usuario admin
const userSchema = new mongoose.Schema({
  unique_id: Number,
  user_type: Number,
  first_name: String,
  last_name: String,
  email: String,
  country_phone_code: String,
  phone: String,
  password: String,
  gender: String,
  picture: String,
  device_token: String,
  device_type: String,
  bio: String,
  address: String,
  city: String,
  country: String,
  zipcode: String,
  wallet: Number,
  wallet_currency_code: String,
  is_use_wallet: Boolean,
  is_approved: Boolean,
  is_document_uploaded: Boolean,
  social_unique_id: String,
  login_by: String,
  referral_code: String,
  referred_by: mongoose.Schema.Types.ObjectId,
  is_referral: Boolean,
  total_referrals: Number,
  refferal_credit: Number,
  total_request: Number,
  completed_request: Number,
  cancelled_request: Number,
  rate: Number,
  rate_count: Number,
  promo_count: Number,
  token: String,
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

const User = mongoose.model('user', userSchema);

async function createAdmin() {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ email: 'admin@joltcab.com' });
    
    if (existingAdmin) {
      console.log('⚠️  El administrador ya existe');
      console.log('📧 Email: admin@joltcab.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Encriptar password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Crear administrador
    const admin = await User.create({
      unique_id: 1,
      user_type: 1, // 1 = Admin
      first_name: 'Admin',
      last_name: 'JoltCab',
      email: 'admin@joltcab.com',
      country_phone_code: '+1',
      phone: '+11111111111',
      password: hashedPassword,
      gender: 'male',
      picture: '',
      device_token: '',
      device_type: '',
      bio: 'Administrador del sistema',
      address: '',
      city: '',
      country: 'USA',
      zipcode: '',
      wallet: 0,
      wallet_currency_code: 'USD',
      is_use_wallet: false,
      is_approved: true,
      is_document_uploaded: true,
      social_unique_id: '',
      login_by: 'manual',
      referral_code: 'ADMIN001',
      is_referral: false,
      total_referrals: 0,
      refferal_credit: 0,
      total_request: 0,
      completed_request: 0,
      cancelled_request: 0,
      rate: 5,
      rate_count: 0,
      promo_count: 0,
      token: '',
    });

    console.log('✅ Administrador creado exitosamente!');
    console.log('');
    console.log('📋 Credenciales del Administrador:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@joltcab.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Tipo:     Administrador (user_type: 1)');
    console.log('🆔 ID:       ' + admin._id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 Puedes hacer login en:');
    console.log('   Frontend: http://localhost:5173/login');
    console.log('   API:      POST http://localhost:4000/api/v1/auth/login');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creando administrador:', error.message);
    process.exit(1);
  }
}

createAdmin();
