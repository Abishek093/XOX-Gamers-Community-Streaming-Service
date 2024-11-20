"use strict";
// import { IStream, StreamModel } from '../models/StreamModel';
// import { StartStreamDTO } from '../dtos/startStreamDTO';
// import { StreamRepository } from '../repositories/StreamRepository';
// import CustomError from '../../shared/CustomError';
// import { decryptCompositeKey, generateCompositeKey, generateStreamToken } from '../../utils/generateCompositeKey';
// import dayjs from 'dayjs';
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
exports.StreamCommandHandler = void 0;
const StreamRepository_1 = require("../repositories/StreamRepository");
const CustomError_1 = __importDefault(require("../../shared/CustomError"));
const generateCompositeKey_1 = require("../../utils/generateCompositeKey");
const dayjs_1 = __importDefault(require("dayjs"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
function generateStreamToken(length = 16) {
    return crypto_1.default.randomBytes(length)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}
class StreamCommandHandler {
    constructor() {
        this.startStreamCommandHandler = (streamData) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.streamRepository.findUserById(streamData.userId);
                const EXPIRATION_TIME_IN_MINUTES = parseInt(process.env.STREAM_EXPIRATION_MINUTES || '20', 20);
                if (!user) {
                    throw new CustomError_1.default("User not found", 404);
                }
                const newStream = yield this.streamRepository.createNewStream(streamData);
                if (!newStream) {
                    throw new CustomError_1.default("Failed to create stream", 500);
                }
                const userId = newStream.userId;
                const streamToken = generateStreamToken();
                const expirationTimestamp = (0, dayjs_1.default)().add(EXPIRATION_TIME_IN_MINUTES, 'minute').unix();
                const streamKey = (0, generateCompositeKey_1.generateCompactKey)(userId, streamToken, expirationTimestamp);
                console.log("Generated StreamKey:", streamKey);
                const streamServer = process.env.STREAMINGURL;
                yield this.streamRepository.updateStreamKey(userId, streamToken);
                return { streamKey, streamServer };
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                console.error(error);
                throw new CustomError_1.default("Internal Server Error", 500);
            }
        });
        this.validateStream = (streamKey) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!streamKey) {
                    throw new CustomError_1.default('Stream key is required', 400);
                }
                const { userId, streamToken, expirationTimestamp } = (0, generateCompositeKey_1.extractCompactKey)(streamKey);
                if ((0, dayjs_1.default)().unix() > expirationTimestamp) {
                    throw new CustomError_1.default('Stream key has expired', 401);
                }
                // Convert the string userId to ObjectId
                let userObjectId;
                try {
                    userObjectId = new mongoose_1.Types.ObjectId(userId);
                    console.log("userObjectId: ", userObjectId);
                }
                catch (error) {
                    throw new CustomError_1.default('Invalid user ID format', 400);
                }
                const stream = yield this.streamRepository.findStreamByUserIdAndToken(userObjectId, streamToken);
                if (!stream) {
                    throw new CustomError_1.default('Invalid stream key or stream not found', 404);
                }
                stream.isValid = true;
                return stream;
            }
            catch (error) {
                if (error instanceof CustomError_1.default) {
                    throw error;
                }
                console.error(error);
                throw new CustomError_1.default("Internal Server Error", 500);
            }
        });
        this.streamRepository = new StreamRepository_1.StreamRepository();
    }
}
exports.StreamCommandHandler = StreamCommandHandler;
