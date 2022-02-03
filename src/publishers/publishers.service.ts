import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { Publisher, PublisherDocument } from './schemas/publisher.schema';

@Injectable()
export class PublishersService {
    constructor(@InjectModel(Publisher.name) private publisherModel: Model<PublisherDocument>) { }

    async getPublisherById(id: ObjectId): Promise<Publisher> {
        return await this.publisherModel.findById(id);
    }

    async create(createPublisherDto: CreatePublisherDto): Promise<ObjectId> {
        const newPublisher = new this.publisherModel(createPublisherDto);
        const result = await newPublisher.save();

        Logger.log('Inserting new publisher...', result);

        return result.id;
    }

}
