import { StreamModel } from '../models/StreamModel';

export class GetStreamsQueryHandler {
    public execute = async () => {
        return await StreamModel.find(); 
    };
}
