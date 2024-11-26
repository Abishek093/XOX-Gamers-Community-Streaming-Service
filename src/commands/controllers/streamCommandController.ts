import { NextFunction, Request, Response } from 'express';
import { StartStreamDTO } from '../dtos/startStreamDTO';
import { StreamCommandHandler } from '../commandHandlers/setStreamCommandHandler';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'; 
import CustomError from '../../shared/CustomError';

export class StreamCommandController {
    private streamCommandHandler: StreamCommandHandler;

    constructor() {
        this.streamCommandHandler = new StreamCommandHandler();
    }

    startStream = async (req: Request, res: Response, next: NextFunction) => {
        const streamData: StartStreamDTO = req.body;
        console.log(streamData);
        try {
            const streamKey = await this.streamCommandHandler.startStreamCommandHandler(streamData);
            res.status(200).json(streamKey);
        } catch (error) {
            next(error);
        }
    };

    generatePresignedUrl = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { userId, fileType } = req.body;
        if (!userId) {
            res.status(400).json({ message: 'UserId is required' });
            return;
        }

        try {
            const region = process.env.AWS_REGION;
            const bucket = process.env.AWS_BUCKET_NAME;

            // Initialize S3Client
            const s3Client = new S3Client({ region });

            // Ensure distinct key generation
            const key = `${userId}-${fileType}.jpg`;

            const params = {
                Bucket: bucket,
                Key: key,
                ContentType: 'image/jpeg',
            };

            // Create a command to upload to S3
            const command = new PutObjectCommand(params);
            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

            res.status(200).json({ uploadUrl: signedUrl, key });
        } catch (error) {
            next(error);
        }
    };

    validateStream = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let streamKey: string | null = null;
    
            if (Buffer.isBuffer(req.body)) {
                const bodyString = req.body.toString('utf8');
                // Extract everything between 'name=' and the next '&' or end of string
                const nameMatch = bodyString.match(/name=(.*?)(&|$)/);
                streamKey = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
            } else if (typeof req.body === 'object') {
                streamKey = req.body.name;
            } else if (typeof req.body === 'string') {
                const nameMatch = req.body.match(/name=(.*?)(&|$)/);
                streamKey = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
            }
    
            if (!streamKey) {
                res.status(400).json({
                    status: 'error',
                    message: 'No stream key provided',
                    details: { bodyType: typeof req.body }
                });
                return;
            }
    
            const cleanedStreamKey = streamKey.trim();
    
            // Debugging logs
            console.log("Original Stream Key:", streamKey);
            console.log("Cleaned Stream Key:", cleanedStreamKey);
    
            try {
                const validationResult = await this.streamCommandHandler.validateStream(cleanedStreamKey);
    
                if (validationResult.isValid) {
                    res.status(200).send('OK');
                } else {
                    res.status(403).json({
                        status: 'error',
                        message: validationResult.errors || 'Invalid stream key'
                    });
                }
            } catch (error) {
                if (error instanceof CustomError) {
                    res.status(error.statusCode).json({
                        status: 'error',
                        message: error.message,
                        details: {
                            originalKey: streamKey,
                            cleanedKey: cleanedStreamKey
                        }
                    });
                } else {
                    res.status(500).json({
                        status: 'error',
                        message: 'Stream validation failed',
                        details: {
                            originalKey: streamKey,
                            cleanedKey: cleanedStreamKey
                        }
                    });
                }
            }
        } catch (error) {
            next(error);
        }
    };

    endStream = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
        try {
            let streamKey: string | null = null;
    
            if (Buffer.isBuffer(req.body)) {
                const bodyString = req.body.toString('utf8');
                const nameMatch = bodyString.match(/name=(.*?)(&|$)/);
                streamKey = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
                console.log("End stream: ",streamKey)
            } else if (typeof req.body === 'object') {
                streamKey = req.body.name;
                console.log("End stream: ",streamKey)
            } else if (typeof req.body === 'string') {
                const nameMatch = req.body.match(/name=(.*?)(&|$)/);
                streamKey = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
                console.log("End stream: ",streamKey)
            }
            if (!streamKey) {
                res.status(400).json({
                    status: 'error',
                    message: 'No stream key provided',
                    details: { bodyType: typeof req.body }
                });
                return;
            }
            await this.streamCommandHandler.endtStreamCommandHandler(streamKey)
            res.status(200).send('OK');
        } catch (error) {
            next(error);
        }
    };
}