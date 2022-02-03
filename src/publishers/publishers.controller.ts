import { Body, Controller, Post } from '@nestjs/common';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { PublishersService } from './publishers.service';

@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) { }

  @Post()
  async create(@Body() createPublisherDto: CreatePublisherDto) {
    return this.publishersService.create(createPublisherDto);
  }
}
