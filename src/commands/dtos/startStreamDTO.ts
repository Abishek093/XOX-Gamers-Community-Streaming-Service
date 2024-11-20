import { ObjectId } from "mongoose";

export interface StartStreamDTO {
    userId: ObjectId;
    title: string;
    description: string;
    game: string;
    thumbnailPath?: string;
  }
  