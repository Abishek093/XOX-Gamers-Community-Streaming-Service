import express from 'express';
import { StreamCommandController } from '../../commands/controllers/streamCommandController'; 
import { StreamQueryController } from '../../queries/controllers/streamQueryController'; 

const router = express.Router();

const streamCommandController = new StreamCommandController();
const streamQueryController = new StreamQueryController();


router.post("/upload-url", streamCommandController.generatePresignedUrl);
router.post('/start-stream', streamCommandController.startStream);
router.post('/stream_done', streamCommandController.endStream);
router.get('/streams', streamQueryController.getStreams);
router.post('/validate_stream', streamCommandController.validateStream)

export default router;
 