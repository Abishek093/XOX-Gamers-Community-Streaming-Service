"use strict";
// import { ObjectId } from "mongoose";
// import CustomError from "../../shared/CustomError";
// import { StartStreamDTO } from "../dtos/startStreamDTO";
// import { IStream, StreamModel } from "../models/StreamModel";
// import { IUser, UserModel } from "../models/UserModel";
// import { Types } from "mongoose";  // Ensure we import Types here
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
exports.StreamRepository = void 0;
const CustomError_1 = __importDefault(require("../../shared/CustomError"));
const StreamModel_1 = require("../models/StreamModel");
const UserModel_1 = require("../models/UserModel");
class StreamRepository {
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.UserModel.findOne({ userId: userId });
                return user;
            }
            catch (error) {
                throw new CustomError_1.default("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
            }
        });
    }
    createNewStream(streamData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStream = new StreamModel_1.StreamModel(Object.assign(Object.assign({}, streamData), { isLive: true, startTime: new Date() }));
                return yield newStream.save();
            }
            catch (error) {
                throw new CustomError_1.default("Error creating new stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
            }
        });
    }
    updateStreamKey(userId, streamKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Updatig streaming key: ", userId, streamKey);
                const streamToken = streamKey.slice(0, 16);
                yield StreamModel_1.StreamModel.updateOne({ userId: userId }, { streamKey: streamToken });
                console.log("Success");
            }
            catch (error) {
                throw new CustomError_1.default("Error updating stream key: " + (error instanceof Error ? error.message : "Unknown error"), 500);
            }
        });
    }
    findStreamByUserIdAndToken(userId, streamToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("finding stream by user id and tocken:", userId, streamToken);
                const stream = yield StreamModel_1.StreamModel.findOne({ userId: userId, streamKey: streamToken });
                return stream;
            }
            catch (error) {
                throw new CustomError_1.default("Error finding user and token stream: " + (error instanceof Error ? error.message : "Unknown error"), 500);
            }
        });
    }
}
exports.StreamRepository = StreamRepository;
