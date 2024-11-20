"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamCommandController = void 0;
const setStreamCommandHandler_1 = require("../commandHandlers/setStreamCommandHandler");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const CustomError_1 = __importDefault(require("../../shared/CustomError"));
class StreamCommandController {
    constructor() {
        this.startStream = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const streamData = req.body;
            console.log(streamData);
            try {
                const streamKey = yield this.streamCommandHandler.startStreamCommandHandler(streamData);
                res.status(200).json(streamKey);
            }
            catch (error) {
                next(error);
            }
        });
        this.generatePresignedUrl = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { userId, fileType } = req.body;
            if (!userId) {
                res.status(400).json({ message: 'UserId is required' });
                return;
            }
            try {
                const region = process.env.AWS_REGION;
                const bucket = process.env.AWS_BUCKET_NAME;
                // Initialize S3Client
                const s3Client = new client_s3_1.S3Client({ region });
                // Ensure distinct key generation
                const key = `${userId}-${fileType}.jpg`;
                const params = {
                    Bucket: bucket,
                    Key: key,
                    ContentType: 'image/jpeg',
                };
                // Create a command to upload to S3
                const command = new client_s3_1.PutObjectCommand(params);
                const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 600 });
                res.status(200).json({ uploadUrl: signedUrl, key });
            }
            catch (error) {
                next(error);
            }
        });
        this.validateStream = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let streamKey = null;
                if (Buffer.isBuffer(req.body)) {
                    const bodyString = req.body.toString('utf8');
                    // Extract everything between 'name=' and the next '&' or end of string
                    const nameMatch = bodyString.match(/name=(.*?)(&|$)/);
                    streamKey = nameMatch ? decodeURIComponent(nameMatch[1]) : null;
                }
                else if (typeof req.body === 'object') {
                    streamKey = req.body.name;
                }
                else if (typeof req.body === 'string') {
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
                    const validationResult = yield this.streamCommandHandler.validateStream(cleanedStreamKey);
                    if (validationResult.isValid) {
                        res.status(200).send('OK');
                    }
                    else {
                        res.status(403).json({
                            status: 'error',
                            message: validationResult.errors || 'Invalid stream key'
                        });
                    }
                }
                catch (error) {
                    if (error instanceof CustomError_1.default) {
                        res.status(error.statusCode).json({
                            status: 'error',
                            message: error.message,
                            details: {
                                originalKey: streamKey,
                                cleanedKey: cleanedStreamKey
                            }
                        });
                    }
                    else {
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
            }
            catch (error) {
                next(error);
            }
        });
        this.streamCommandHandler = new setStreamCommandHandler_1.StreamCommandHandler();
    }
}
exports.StreamCommandController = StreamCommandController;
