import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { PublishersModule } from 'src/publishers/publishers.module';

@Module({
  imports: [
    PublishersModule,
    MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema,
      },
    ]),
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule { }
