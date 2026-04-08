import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  conversationId: string;
  userId: string;
  title: string;
  summary?: string;
  context: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: String,
    context: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>(
  'Conversation',
  ConversationSchema
);
