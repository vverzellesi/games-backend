import { Module } from '@nestjs/common';
import { PublishersService } from './publishers.service';
import { PublishersController } from './publishers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './schemas/publisher.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Publisher.name,
        schema: PublisherSchema,
      },
    ]),
  ],
  controllers: [PublishersController],
  providers: [PublishersService],
  exports: [PublishersService],
})
export class PublishersModule { }
