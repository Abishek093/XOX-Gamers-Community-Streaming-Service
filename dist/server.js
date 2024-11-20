"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const mongo_1 = __importDefault(require("./infrastructure/database/mongo"));
const queueSubcribers_1 = require("./events/subscribers/queueSubcribers");
const stream_routes_ts_1 = __importDefault(require("./api/routes/stream.routes.ts"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = process.env.PORT || 3003;
app.use(express_1.default.json());
app.use(express_1.default.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/streaming', stream_routes_ts_1.default);
(0, mongo_1.default)().then(() => {
    (0, queueSubcribers_1.startQueueConsumer)();
    server.listen(PORT, () => {
        console.log(`streaming service running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Content Service: Failed to start service due to DB connection error:', err.message);
});
