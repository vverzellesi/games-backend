import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './entities/game.entity';
import { GameDocument } from './schemas/game.schema';
import { PublishersService } from 'src/publishers/publishers.service';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    private publisherService: PublishersService,
  ) { }

  async create(createGameDto: CreateGameDto): Promise<string> {
    const { title, price, tags, releaseDate } = createGameDto;

    const publisher = await this.publisherService.getPublisherById(createGameDto.publisherId);

    const newGame = new this.gameModel({
      title,
      price,
      tags,
      releaseDate,
      publisher,
    });
    const result = await newGame.save();

    console.log('Inserting new game...', result);

    return result.id;
  }

  async findAll(): Promise<GameDocument[]> {
    console.log('Getting all games...');
    return await this.gameModel.find().populate('publisher');
  }

  async findOne(id: string): Promise<GameDocument> {
    try {
      console.log(`Finding game by id ${id}...`);
      return await this.gameModel.findById(id).populate('publisher');
    } catch (error) {
      throw new NotFoundException('Could not find the specified game.');
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    console.log(`Updating game ${id}...`);
    return await this.gameModel.findByIdAndUpdate(id, updateGameDto, { upsert: true });
  }

  async remove(id: string) {
    console.log(`Removing game ${id}...`);
    return await this.gameModel.deleteOne({ _id: id });
  }
}
