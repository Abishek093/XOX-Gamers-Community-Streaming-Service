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
exports.startQueueConsumer = void 0;
const UserModel_1 = require("../../commands/models/UserModel");
const RabbitMQConsumer_1 = require("../../infrastructure/broker/RabbitMQConsumer");
const CustomError_1 = __importDefault(require("../../shared/CustomError"));
const startQueueConsumer = () => {
    (0, RabbitMQConsumer_1.consumeQueue)('streaming-service-create-user', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = {
                userId: userData.userId,
                username: userData.username,
                displayName: userData.displayName,
                profileImage: userData.profileImage,
                isBlocked: userData.isBlocked,
            };
            yield UserModel_1.UserModel.create(newUser);
            console.log('User created successfully in streaming service:', newUser);
        }
        catch (error) {
            console.error("Failed to create user:", error);
            throw new CustomError_1.default("Failed to create user: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
        }
    }));
    (0, RabbitMQConsumer_1.consumeQueue)('streaming-service-update-user', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('userData', userData);
        }
        catch (error) {
            console.error("Failed to update user:", error);
            throw new CustomError_1.default("Failed to update user: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
        }
    }));
    (0, RabbitMQConsumer_1.consumeQueue)('streaming-service-update-profile-image', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('userData', userData);
        }
        catch (error) {
            console.error("Failed to update profile image user:", error);
            throw new CustomError_1.default("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
        }
    }));
    (0, RabbitMQConsumer_1.consumeQueue)('streaming-service-update-profile-image', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('userData', userData);
        }
        catch (error) {
            console.error("Failed to update profile image user:", error);
            throw new CustomError_1.default("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
        }
    }));
    (0, RabbitMQConsumer_1.consumeQueue)('streaming-service-block-user', (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('userData', userData);
        }
        catch (error) {
            console.error("Failed to update profile image user:", error);
            throw new CustomError_1.default("Failed to update profile image user: " + (error instanceof Error || error instanceof CustomError_1.default ? error.message : "Unknown error"), 500);
        }
    }));
};
exports.startQueueConsumer = startQueueConsumer;
