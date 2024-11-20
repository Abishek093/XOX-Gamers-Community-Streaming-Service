import { Request, Response } from 'express';
import { GetStreamsQueryHandler } from '../queryHandlers/getStreamsQueryHandler'; 


export class StreamQueryController {
    private getStreamsQueryHandler: GetStreamsQueryHandler;

    constructor() {
        this.getStreamsQueryHandler = new GetStreamsQueryHandler(); // Instantiate the query handler
    }

    public getStreams = async (req: Request, res: Response) => {
        try {
            const streams = await this.getStreamsQueryHandler.execute(); // Call the execute method
            res.status(200).json({ streams });
        } catch (error) {
            console.error('Failed to retrieve streams:', error);
            res.status(500).json({ error: 'Failed to retrieve streams' });
        }
    };
}
