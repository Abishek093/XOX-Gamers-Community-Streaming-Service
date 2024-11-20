import mongoose, { Document, ObjectId, Schema } from 'mongoose';

export interface IStream extends Document {
  userId: ObjectId;
  title: string;
  description: string;
  game: string;
  thumbnailUrl: string | null;
  startTime: Date;
  isLive: boolean;
  streamKey: string;
  isValid?: boolean; 
}


const StreamSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  game: { type: String },
  thumbnailUrl: { type: String, default: null },
  startTime: { type: Date, default: Date.now },
  isLive: { type: Boolean, default: true },
  streamKey: { type: String},
  isValid: {type: Boolean}
});

export const StreamModel = mongoose.models.Stream || mongoose.model<IStream>('Stream', StreamSchema);
