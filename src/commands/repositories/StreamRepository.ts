// import { ObjectId } from "mongoose";
// import CustomError from "../../shared/CustomError";
// import { StartStreamDTO } from "../dtos/startStreamDTO";
// import { IStream, StreamModel } from "../models/StreamModel";
// import { IUser, UserModel } from "../models/UserModel";
// import { Types } from "mongoose";  // Ensure we import Types here

// export class StreamRepository{

//     async findUserById(userId: ObjectId):Promise<IUser | null>{
//         try {
//             const user = await UserModel.findOne({userId: userId})
//             return user
//         } catch (error) {
//             throw new CustomError("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
//          }
//     }

//     async createNewStream(streamData: StartStreamDTO):Promise<IStream>{
//         try {
//             const newStream = new StreamModel({
//                 ...streamData,
//                 isLive: true,
//                 startTime: new Date(),
//             });

//             return await newStream.save();
//         } catch (error) {
//             throw new CustomError("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
//          }
//     }

//     async updateStreamKey(userId: string, streamKey: string): Promise<void> {
//         try {
//             await StreamModel.updateOne({ userId: userId }, { streamKey: streamKey });
//         } catch (error) {
//             throw new CustomError("Error updating stream key: " + (error instanceof Error ? error.message : "Unknown error"), 500);
//         }
//     }

//     // async findStreamByUserIdAndToken(userId: Types.ObjectId, streamToken: string): Promise<IStream | null> {
//     //     try {
//     //         const stream = await StreamModel.findOne({
//     //             userId: userId,
//     //             streamKey: { $regex: streamToken } // Search for streamToken within streamKey
//     //         });
//     //         return stream;
//     //     } catch (error) {
//     //         throw new CustomError("Error finding stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
//     //     }
//     // }

//     async findStreamByUserIdAndToken(userId: Types.ObjectId, streamToken: string): Promise<IStream | null> {
//         try {
//             console.log('Looking up stream with:', {
//                 userId: userId.toHexString(),
//                 streamToken
//             });

//             const stream = await StreamModel.findOne({
//                 userId: userId
//             });

//             console.log('Found stream:', stream);

//             if (!stream) {
//                 return null;
//             }

//             // Verify the stream key contains our token
//             if (!stream.streamKey.includes(streamToken)) {
//                 console.log('Stream key mismatch:', {
//                     stored: stream.streamKey,
//                     token: streamToken
//                 });
//                 return null;
//             }

//             return stream;
//         }  catch (error) {
//             throw new CustomError("Error finding stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
//         }
//     }
// }


import { ObjectId } from "mongoose";
import CustomError from "../../shared/CustomError";
import { StartStreamDTO } from "../dtos/startStreamDTO";
import { IStream, StreamModel } from "../models/StreamModel";
import { IUser, UserModel } from "../models/UserModel";
import { Types } from "mongoose";  // Ensure we import Types here

export class StreamRepository {

    async findUserById(userId: ObjectId): Promise<IUser | null> {
        try {
            const user = await UserModel.findOne({ userId: userId })
            return user
        } catch (error) {
            throw new CustomError("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }

    async createNewStream(streamData: StartStreamDTO): Promise<IStream> {
        try {
            const newStream = new StreamModel({
                ...streamData,
                isLive: true,
                startTime: new Date(),
            });

            return await newStream.save();
        } catch (error) {
            throw new CustomError("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }

    async updateStreamKey(userId: ObjectId, streamKey: string): Promise<void> {
        try {
            console.log("Updatig streaming key: ", userId, streamKey)
            // const streamToken = streamKey.slice(0, 16);

            await StreamModel.updateOne({ userId: userId }, { streamKey: streamKey });
            console.log("Success")
        } catch (error) {
            throw new CustomError("Error updating stream key: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }

    async findStreamByUserIdAndToken(userId: Types.ObjectId, streamToken: string): Promise<IStream | null> {
        try {
            console.log("finding stream by user id and tocken:", userId, streamToken)
            const stream = await StreamModel.findOne({ userId: userId, streamKey: streamToken });
            return stream;
        } catch (error) {
            throw new CustomError("Error finding user and token stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }

    async endStream(userId: Types.ObjectId, streamToken: string):Promise<void>{
        try {
            const stream = await this.findStreamByUserIdAndToken(userId, streamToken)
            if(!stream){
                throw new CustomError("Error finding stream", 404)
            }
            stream.isLive = false;
            await stream.save()
            
        } catch (error) {
            throw new CustomError("Error ending stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
        }
    }
}