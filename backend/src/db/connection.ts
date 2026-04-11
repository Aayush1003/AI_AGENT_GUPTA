import mongoose from 'mongoose';
import { initFirebase, disconnectFirebase } from './firebaseConnection';
import { initLocalDB } from './localDB';

export type DBType = 'mongodb' | 'firebase' | 'local';

let currentDB: DBType = 'local';

export const connectDB = async (mongoUri?: string, dbType?: DBType) => {
  try {
    // Auto-detect from env or parameter, default to local
    const db = dbType || (process.env.DB_TYPE as DBType) || 'local';
    currentDB = db;

    if (db === 'firebase') {
      await initFirebase();
      console.log('🔥 Using Firebase Firestore');
    } else if (db === 'mongodb') {
      const uri = mongoUri || process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-agent';
      await mongoose.connect(uri);
      console.log('✅ MongoDB connected successfully');
    } else if (db === 'local') {
      await initLocalDB();
      console.log('📁 Using Local File-Based Database');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // For local DB, don't exit on error
    if (currentDB !== 'local') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    if (currentDB === 'firebase') {
      await disconnectFirebase();
    } else if (currentDB === 'mongodb') {
      await mongoose.disconnect();
      console.log('✅ MongoDB disconnected');
    }
    // Local DB doesn't need disconnection
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
  }
};

export const getCurrentDB = (): DBType => currentDB;
