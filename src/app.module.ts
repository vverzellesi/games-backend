import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesModule } from './games/games.module';
import { PublishersModule } from './publishers/publishers.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GamesModule,
    PublishersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
