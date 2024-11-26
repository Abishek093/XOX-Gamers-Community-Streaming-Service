import { IStream, StreamModel } from '../models/StreamModel';
import { StartStreamDTO } from '../dtos/startStreamDTO';
import { StreamRepository } from '../repositories/StreamRepository';
import CustomError from '../../shared/CustomError';
import { extractCompactKey, generateCompactKey } from '../../utils/generateCompositeKey';
import dayjs from 'dayjs';
import crypto from 'crypto';
import { Types } from 'mongoose';

function generateStreamToken(length = 16): string {
    return crypto.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

export class StreamCommandHandler {
    private streamRepository: StreamRepository;

    constructor() {
        this.streamRepository = new StreamRepository();
    }

    startStreamCommandHandler = async (streamData: StartStreamDTO) => {
        try {
            const user = await this.streamRepository.findUserById(streamData.userId);
            const EXPIRATION_TIME_IN_MINUTES = parseInt(process.env.STREAM_EXPIRATION_MINUTES || '20', 20);

            if (!user) {
                throw new CustomError("User not found", 404);
            }

            const newStream = await this.streamRepository.createNewStream(streamData);
            
            if (!newStream) {
                throw new CustomError("Failed to create stream", 500);
            }

            const userId = newStream.userId;
            const streamToken = generateStreamToken();
            const expirationTimestamp = dayjs().add(EXPIRATION_TIME_IN_MINUTES, 'minute').unix();
            
            const streamKey = generateCompactKey(userId, streamToken, expirationTimestamp);
            console.log("Generated StreamKey:", streamKey);
            
            const streamServer = process.env.STREAMINGURL;
            // await this.streamRepository.updateStreamKey(userId, streamToken);
            await this.streamRepository.updateStreamKey(userId, streamKey);

            return { streamKey, streamServer };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            console.error(error);
            throw new CustomError("Internal Server Error", 500);
        }
    };

    validateStream = async (streamKey: string): Promise<IStream> => {
        try {
            if (!streamKey) {
                throw new CustomError('Stream key is required', 400);
            }

            const { userId, streamToken, expirationTimestamp } = extractCompactKey(streamKey);

            if (dayjs().unix() > expirationTimestamp) {
                throw new CustomError('Stream key has expired', 401);
            }

            // Convert the string userId to ObjectId
            let userObjectId: Types.ObjectId;
            try {
                userObjectId = new Types.ObjectId(userId);
                console.log("userObjectId: ",userObjectId)
            } catch (error) {
                throw new CustomError('Invalid user ID format', 400);
            }

            const stream = await this.streamRepository.findStreamByUserIdAndToken(userObjectId, streamKey);

            if (!stream) {
                throw new CustomError('Invalid stream key or stream not found', 404);
            }
            stream.isValid = true
            return stream;

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            console.error(error);
            throw new CustomError("Internal Server Error", 500);
        }
    };

    endtStreamCommandHandler = async (streamKey: string): Promise<void> => {
        try {
            if (!streamKey) {
                throw new CustomError('Stream key is required', 400);
            }
            const { userId, streamToken, expirationTimestamp } = extractCompactKey(streamKey);
            let userObjectId: Types.ObjectId;
            try {
                userObjectId = new Types.ObjectId(userId);
                console.log("userObjectId: ",userObjectId)
            } catch (error) {
                throw new CustomError('Invalid user ID format', 400);
            }
            const stream = await this.streamRepository.findStreamByUserIdAndToken(userObjectId, streamKey);

            if (!stream) {
                throw new CustomError('Invalid stream key or stream not found', 404);
            }

            await this.streamRepository.endStream(userObjectId, streamKey)
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            console.error(error);
            throw new CustomError("Internal Server Error", 500);
        }
    };
}

