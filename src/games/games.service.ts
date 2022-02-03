import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Game } from './entities/game.entity';
import { GameDocument } from './schemas/game.schema';
import { PublishersService } from 'src/publishers/publishers.service';
import { Publisher } from 'src/publishers/schemas/publisher.schema';

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

    Logger.log('Inserting new game...', result);

    return result.id;
  }

  async findAll(): Promise<GameDocument[]> {
    Logger.log('Getting all games...');
    return await this.gameModel.find().populate('publisher');
  }

  async findOne(id: string, publisherOnly: boolean): Promise<GameDocument | Publisher> {
    try {
      const game = await this.gameModel.findById(id).populate('publisher');

      if (publisherOnly) {
        Logger.log(`Fetching Publisher data for game ${id}...`);
        return game.publisher;
      }

      Logger.log(`Finding game by id ${id}...`);
      return game;
    } catch (error) {
      throw new NotFoundException('Could not find the specified game.');
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    Logger.log(`Updating game ${id}...`);
    return await this.gameModel.findByIdAndUpdate(id, updateGameDto, { upsert: true });
  }

  async remove(id: string) {
    Logger.log(`Removing game ${id}...`);
    return await this.gameModel.deleteOne({ _id: id });
  }
}
