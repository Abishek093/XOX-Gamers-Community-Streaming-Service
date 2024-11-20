"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const streamCommandController_1 = require("../../commands/controllers/streamCommandController");
const streamQueryController_1 = require("../../queries/controllers/streamQueryController");
const router = express_1.default.Router();
const streamCommandController = new streamCommandController_1.StreamCommandController();
const streamQueryController = new streamQueryController_1.StreamQueryController();
router.post("/upload-url", streamCommandController.generatePresignedUrl);
router.post('/start-stream', streamCommandController.startStream);
router.get('/streams', streamQueryController.getStreams);
router.post('/validate_stream', streamCommandController.validateStream);
exports.default = router;
