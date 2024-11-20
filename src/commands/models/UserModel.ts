import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser {
  userId: string;
  username: string;
  displayName: string;
  profileImage?: string | null;
  isBlocked: boolean;
}
    
interface IUserDocument extends Document, IUser {}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    displayName: { type: String, required: true },
    profileImage: { type: String, required: false, default: null },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

UserSchema.index({ userId: 1 }); 

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export { IUserDocument };
