import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const DB_DIR = path.join(process.cwd(), '.local-db');

// Ensure DB directory exists
async function ensureDBDir() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Helper to read JSON files
async function readJSON<T>(filePath: string): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Helper to write JSON files
async function writeJSON<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export interface LocalUser {
  _id: string;
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

export const LocalUserCollection = {
  async create(user: Omit<LocalUser, '_id' | 'createdAt' | 'updatedAt'>) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    const users = await readJSON<LocalUser>(filePath);
    const id = uuidv4();
    const now = new Date();
    const newUser = { _id: id, ...user, createdAt: now, updatedAt: now };
    users.push(newUser);
    await writeJSON(filePath, users);
    return newUser;
  },

  async findById(id: string): Promise<LocalUser | null> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    const users = await readJSON<LocalUser>(filePath);
    return users.find((u) => u._id === id) || null;
  },

  async findByEmail(email: string): Promise<LocalUser | null> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    const users = await readJSON<LocalUser>(filePath);
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findByUsername(username: string): Promise<LocalUser | null> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    const users = await readJSON<LocalUser>(filePath);
    return users.find((u) => u.username === username) || null;
  },

  async updateById(id: string, updates: Partial<LocalUser>) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    const users = await readJSON<LocalUser>(filePath);
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates, updatedAt: new Date() };
    await writeJSON(filePath, users);
    return users[index];
  },

  async deleteById(id: string) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'users.json');
    let users = await readJSON<LocalUser>(filePath);
    users = users.filter((u) => u._id !== id);
    await writeJSON(filePath, users);
  },
};

export interface LocalConversation {
  _id: string;
  conversationId: string;
  userId: string;
  title: string;
  summary?: string;
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export const LocalConversationCollection = {
  async create(
    conversation: Omit<LocalConversation, '_id' | 'createdAt' | 'updatedAt'>
  ) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'conversations.json');
    const conversations = await readJSON<LocalConversation>(filePath);
    const id = uuidv4();
    const now = new Date();
    const newConversation = {
      _id: id,
      ...conversation,
      createdAt: now,
      updatedAt: now,
    };
    conversations.push(newConversation);
    await writeJSON(filePath, conversations);
    return newConversation;
  },

  async findByConversationId(conversationId: string) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'conversations.json');
    const conversations = await readJSON<LocalConversation>(filePath);
    return conversations.find((c) => c.conversationId === conversationId) || null;
  },

  async findByUserId(userId: string): Promise<LocalConversation[]> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'conversations.json');
    const conversations = await readJSON<LocalConversation>(filePath);
    return conversations.filter((c) => c.userId === userId);
  },

  async updateById(id: string, updates: Partial<LocalConversation>) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'conversations.json');
    const conversations = await readJSON<LocalConversation>(filePath);
    const index = conversations.findIndex((c) => c._id === id);
    if (index === -1) throw new Error('Conversation not found');
    conversations[index] = {
      ...conversations[index],
      ...updates,
      updatedAt: new Date(),
    };
    await writeJSON(filePath, conversations);
    return conversations[index];
  },

  async deleteById(id: string) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'conversations.json');
    let conversations = await readJSON<LocalConversation>(filePath);
    conversations = conversations.filter((c) => c._id !== id);
    await writeJSON(filePath, conversations);
  },
};

export interface LocalMessage {
  _id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export const LocalMessageCollection = {
  async create(message: Omit<LocalMessage, '_id' | 'createdAt'>) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'messages.json');
    const messages = await readJSON<LocalMessage>(filePath);
    const id = uuidv4();
    const newMessage = { _id: id, ...message, createdAt: new Date() };
    messages.push(newMessage);
    await writeJSON(filePath, messages);
    return newMessage;
  },

  async findByConversationId(
    conversationId: string,
    limit = 50
  ): Promise<LocalMessage[]> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'messages.json');
    const messages = await readJSON<LocalMessage>(filePath);
    return messages
      .filter((m) => m.conversationId === conversationId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
      .slice(-limit);
  },

  async findByUserId(userId: string, limit = 200): Promise<LocalMessage[]> {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'messages.json');
    const messages = await readJSON<LocalMessage>(filePath);
    return messages
      .filter((m) => m.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  },

  async deleteByConversationId(conversationId: string) {
    await ensureDBDir();
    const filePath = path.join(DB_DIR, 'messages.json');
    let messages = await readJSON<LocalMessage>(filePath);
    messages = messages.filter((m) => m.conversationId !== conversationId);
    await writeJSON(filePath, messages);
  },
};

export const initLocalDB = async () => {
  await ensureDBDir();
  console.log('📁 Local file-based database initialized');
};
