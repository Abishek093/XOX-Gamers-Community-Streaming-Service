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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamQueryController = void 0;
const getStreamsQueryHandler_1 = require("../queryHandlers/getStreamsQueryHandler");
class StreamQueryController {
    constructor() {
        this.getStreams = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const streams = yield this.getStreamsQueryHandler.execute(); // Call the execute method
                res.status(200).json({ streams });
            }
            catch (error) {
                console.error('Failed to retrieve streams:', error);
                res.status(500).json({ error: 'Failed to retrieve streams' });
            }
        });
        this.getStreamsQueryHandler = new getStreamsQueryHandler_1.GetStreamsQueryHandler(); // Instantiate the query handler
    }
}
exports.StreamQueryController = StreamQueryController;
