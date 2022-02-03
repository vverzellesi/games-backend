import { HttpCode, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game } from './entities/game.entity';
import { GameDocument } from './schemas/game.schema';
import { PublishersService } from 'src/publishers/publishers.service';
import { Publisher } from 'src/publishers/schemas/publisher.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment';

@Injectable()
export class GamesService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<GameDocument>,
    private publisherService: PublishersService,
  ) { }

  async create(createGameDto: CreateGameDto): Promise<string> {
    try {
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
    } catch (error) {
      const errorMessage = 'Error to create new game...';
      Logger.error(errorMessage, error);
      throw new Error(errorMessage);
    }
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
      Logger.error(`Error to find game ${id}`, error);
      throw new NotFoundException('Could not find the specified game.');
    }
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    try {
      Logger.log(`Updating game ${id}...`);
      return await this.gameModel.findByIdAndUpdate(id, { $set: updateGameDto });
    } catch (error) {
      throw new NotFoundException('Could not find the specified game.');
    }
  }

  async remove(id: string) {
    try {
      Logger.log(`Removing game ${id}...`);
      return await this.gameModel.deleteOne({ _id: id });
    } catch (error) {
      Logger.error(`Error to delete game ${id}`);
      throw new NotFoundException('Could not delete the specified game.');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleOldGames() {
    const date12MonthsAgo = moment().subtract(12, 'months').toISOString();
    const date18MonthsAgo = moment().subtract(18, 'months').toISOString();

    // removes games older than 18 months
    const gamesToRemove = await this.gameModel.find({
      releaseDate: {
        $lte: date18MonthsAgo,
      }
    });

    for (const game of gamesToRemove) {
      Logger.log('Removing old game...', game);
      await this.remove(game._id.toString());
    }

    // applies a 20% discount to games released between 12 and 18 months ago
    const gamesToAddDiscount = await this.gameModel.find({
      discounted: false,
      releaseDate: {
        $lte: date12MonthsAgo,
        $gt: date18MonthsAgo,
      }
    }).populate('publisher');

    for (const game of gamesToAddDiscount) {
      Logger.log('Adding discount to game...', game);

      const discountedPrice = game.price * 0.8;
      await this.update(game._id.toString(), {
        price: discountedPrice, discounted: true
      });
    }

  }
}
