/**
 * Unified Database Interface
 * Works with MongoDB, Firebase, and Local databases
 * Automatically selects the right implementation
 */

import { getCurrentDB } from './connection';
import { MessageCollection as FirebaseMessages } from './firebaseModels';
import { LocalMessageCollection } from './localDB';
import { Message as MongooseMessage } from './Message';

export interface MessageData {
  _id?: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
  functionCall?: {
    name: string;
    arguments: Record<string, any>;
  };
}

/**
 * Message Repository - Unified interface for all databases
 */
export const MessageRepo = {
  async create(data: Omit<MessageData, '_id' | 'createdAt'>) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        const msg = new MongooseMessage({
          conversationId: data.conversationId,
          userId: data.userId,
          role: data.role,
          content: data.content,
          functionCall: data.functionCall,
        });
        await msg.save();
        return msg.toObject();
      } else if (db === 'firebase') {
        return await FirebaseMessages.create(data);
      } else {
        return await LocalMessageCollection.create(data);
      }
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  },

  async findByConversationId(conversationId: string, limit = 50) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseMessage.find({ conversationId })
          .sort({ createdAt: 1 })
          .limit(limit)
          .lean();
      } else if (db === 'firebase') {
        return await FirebaseMessages.findByConversationId(conversationId, limit);
      } else {
        return await LocalMessageCollection.findByConversationId(conversationId, limit);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  async findByUserId(userId: string, limit = 200) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseMessage.find({ userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
      } else if (db === 'firebase') {
        return await FirebaseMessages.findByUserId(userId, limit);
      } else {
        return await LocalMessageCollection.findByUserId(userId, limit);
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
      return [];
    }
  },

  async deleteByConversationId(conversationId: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        await MongooseMessage.deleteMany({ conversationId });
      } else if (db === 'firebase') {
        await FirebaseMessages.deleteByConversationId(conversationId);
      } else {
        await LocalMessageCollection.deleteByConversationId(conversationId);
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
      throw error;
    }
  },
};

// ===== Conversation Repository =====

import { ConversationCollection as FirebaseConversations } from './firebaseModels';
import { LocalConversationCollection } from './localDB';
import { Conversation as MongooseConversation } from './Conversation';

export interface ConversationData {
  _id?: string;
  conversationId: string;
  userId: string;
  title: string;
  summary?: string;
  context: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export const ConversationRepo = {
  async create(data: Omit<ConversationData, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        const conv = new MongooseConversation({
          conversationId: data.conversationId,
          userId: data.userId,
          title: data.title,
          summary: data.summary,
          context: data.context,
        });
        await conv.save();
        return conv.toObject();
      } else if (db === 'firebase') {
        return await FirebaseConversations.create(data);
      } else {
        return await LocalConversationCollection.create(data);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  async findByConversationId(conversationId: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseConversation.findOne({ conversationId }).lean();
      } else if (db === 'firebase') {
        return await FirebaseConversations.findByConversationId(conversationId);
      } else {
        return await LocalConversationCollection.findByConversationId(conversationId);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      return null;
    }
  },

  async findByUserId(userId: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseConversation.find({ userId }).lean();
      } else if (db === 'firebase') {
        return await FirebaseConversations.findByUserId(userId);
      } else {
        return await LocalConversationCollection.findByUserId(userId);
      }
    } catch (error) {
      console.error('Error fetching user conversations:', error);
      return [];
    }
  },

  async updateById(id: string, updates: Partial<ConversationData>) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        const updated = await MongooseConversation.findByIdAndUpdate(id, updates, {
          new: true,
        }).lean();
        return updated;
      } else if (db === 'firebase') {
        return await FirebaseConversations.updateById(id, updates);
      } else {
        return await LocalConversationCollection.updateById(id, updates);
      }
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  },

  async deleteById(id: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        await MongooseConversation.findByIdAndDelete(id);
      } else if (db === 'firebase') {
        await FirebaseConversations.deleteById(id);
      } else {
        await LocalConversationCollection.deleteById(id);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },
};

// ===== User Repository =====

import { UserCollection as FirebaseUsers } from './firebaseModels';
import { LocalUserCollection } from './localDB';
import { User as MongooseUser } from './User';

export interface UserData {
  _id?: string;
  email: string;
  username: string;
  passwordHash: string;
  profile: {
    timezone: string;
    workStyle: string;
    preferences: Record<string, any>;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const UserRepo = {
  async create(data: Omit<UserData, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        const user = new MongooseUser({
          email: data.email,
          username: data.username,
          passwordHash: data.passwordHash,
          profile: data.profile,
        });
        await user.save();
        return user.toObject();
      } else if (db === 'firebase') {
        return await FirebaseUsers.create(data);
      } else {
        return await LocalUserCollection.create(data);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async findByEmail(email: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseUser.findOne({ email: email.toLowerCase() }).lean();
      } else if (db === 'firebase') {
        return await FirebaseUsers.findByEmail(email);
      } else {
        return await LocalUserCollection.findByEmail(email);
      }
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  async findByUsername(username: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseUser.findOne({ username }).lean();
      } else if (db === 'firebase') {
        return await FirebaseUsers.findByUsername(username);
      } else {
        return await LocalUserCollection.findByUsername(username);
      }
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    }
  },

  async findById(id: string) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        return await MongooseUser.findById(id).lean();
      } else if (db === 'firebase') {
        return await FirebaseUsers.findById(id);
      } else {
        return await LocalUserCollection.findById(id);
      }
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  },

  async updateById(id: string, updates: Partial<UserData>) {
    const db = getCurrentDB();
    
    try {
      if (db === 'mongodb') {
        const updated = await MongooseUser.findByIdAndUpdate(id, updates, {
          new: true,
        }).lean();
        return updated;
      } else if (db === 'firebase') {
        return await FirebaseUsers.updateById(id, updates);
      } else {
        return await LocalUserCollection.updateById(id, updates);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
};
