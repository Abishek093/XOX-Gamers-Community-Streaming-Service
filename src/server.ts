import dotenv from 'dotenv'
dotenv.config()
import express, { NextFunction, Request, Response } from 'express'
import { createServer, Server } from 'http'
import connectDB from './infrastructure/database/mongo' 
import { startQueueConsumer } from './events/subscribers/queueSubcribers'
import streamRoutes from './api/routes/stream.routes.ts'
// import Hls from 'hls.js';

const app = express()
const server = createServer(app)

const PORT = process.env.PORT||3003


app.use(express.json());
app.use(express.raw({ type: 'application/x-www-form-urlencoded' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/streaming', streamRoutes);



connectDB().then(()=>{
    startQueueConsumer()
    server.listen(PORT, ()=>{
        console.log(`streaming service running on http://localhost:${PORT}`);
    })
}).catch((err) => {
    console.error('Content Service: Failed to start service due to DB connection error:', err.message);
});