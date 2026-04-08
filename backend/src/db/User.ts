import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
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

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profile: {
      timezone: {
        type: String,
        default: 'UTC',
      },
      workStyle: {
        type: String,
        enum: ['deep-work', 'collaborative', 'balanced'],
        default: 'balanced',
      },
      preferences: {
        type: Schema.Types.Mixed,
        default: {},
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
