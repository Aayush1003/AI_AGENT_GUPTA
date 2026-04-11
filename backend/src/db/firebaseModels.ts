import admin from 'firebase-admin';
import { getFirestore } from './firebaseConnection';
import { v4 as uuidv4 } from 'uuid';

// Firebase User adapter
export interface FirebaseUser {
  _id?: string;
  email: string;
  username: string;
  passwordHash: string;
  profile: {
    timezone: string;
    workStyle: string;
    preferences: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const UserCollection = {
  async create(user: Omit<FirebaseUser, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = getFirestore();
    const id = uuidv4();
    const now = new Date();
    const userData = {
      _id: id,
      ...user,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('users').doc(id).set(userData);
    return userData;
  },

  async findById(id: string): Promise<FirebaseUser | null> {
    const db = getFirestore();
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? (doc.data() as FirebaseUser) : null;
  },

  async findByEmail(email: string): Promise<FirebaseUser | null> {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();
    return querySnapshot.empty
      ? null
      : (querySnapshot.docs[0].data() as FirebaseUser);
  },

  async findByUsername(username: string): Promise<FirebaseUser | null> {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();
    return querySnapshot.empty
      ? null
      : (querySnapshot.docs[0].data() as FirebaseUser);
  },

  async updateById(id: string, updates: Partial<FirebaseUser>) {
    const db = getFirestore();
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await db.collection('users').doc(id).update(updateData);
    return { _id: id, ...updateData };
  },

  async deleteById(id: string) {
    const db = getFirestore();
    await db.collection('users').doc(id).delete();
  },
};

// Firebase Conversation adapter
export interface FirebaseConversation {
  _id?: string;
  conversationId: string;
  userId: string;
  title: string;
  summary?: string;
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export const ConversationCollection = {
  async create(
    conversation: Omit<FirebaseConversation, '_id' | 'createdAt' | 'updatedAt'>
  ) {
    const db = getFirestore();
    const id = uuidv4();
    const now = new Date();
    const conversationData = {
      _id: id,
      ...conversation,
      createdAt: now,
      updatedAt: now,
    };
    await db.collection('conversations').doc(id).set(conversationData);
    return conversationData;
  },

  async findByConversationId(conversationId: string) {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('conversations')
      .where('conversationId', '==', conversationId)
      .limit(1)
      .get();
    return querySnapshot.empty
      ? null
      : (querySnapshot.docs[0].data() as FirebaseConversation);
  },

  async findByUserId(userId: string): Promise<FirebaseConversation[]> {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('conversations')
      .where('userId', '==', userId)
      .get();
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseConversation);
  },

  async updateById(id: string, updates: Partial<FirebaseConversation>) {
    const db = getFirestore();
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };
    await db.collection('conversations').doc(id).update(updateData);
    return { _id: id, ...updateData };
  },

  async deleteById(id: string) {
    const db = getFirestore();
    await db.collection('conversations').doc(id).delete();
  },
};

// Firebase Message adapter
export interface FirebaseMessage {
  _id?: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export const MessageCollection = {
  async create(
    message: Omit<FirebaseMessage, '_id' | 'createdAt'>
  ) {
    const db = getFirestore();
    const id = uuidv4();
    const messageData = {
      _id: id,
      ...message,
      createdAt: new Date(),
    };
    await db.collection('messages').doc(id).set(messageData);
    return messageData;
  },

  async findByConversationId(
    conversationId: string,
    limit = 50
  ): Promise<FirebaseMessage[]> {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return querySnapshot.docs
      .map((doc) => doc.data() as FirebaseMessage)
      .reverse(); // Reverse to show oldest first
  },

  async findByUserId(userId: string, limit = 200): Promise<FirebaseMessage[]> {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('messages')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return querySnapshot.docs.map((doc) => doc.data() as FirebaseMessage);
  },

  async deleteByConversationId(conversationId: string) {
    const db = getFirestore();
    const querySnapshot = await db
      .collection('messages')
      .where('conversationId', '==', conversationId)
      .get();
    const batch = db.batch();
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  },
};
