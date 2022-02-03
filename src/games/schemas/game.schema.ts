import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Publisher } from "src/publishers/schemas/publisher.schema";

export type GameDocument = Game & Document;

@Schema()
export class Game {
    @Prop()
    title: string;

    @Prop()
    price: number;

    @Prop({ default: false })
    discounted: boolean;

    @Prop()
    tags: string[];

    @Prop()
    releaseDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Publisher.name })
    publisher: Publisher;
}

export const GameSchema = SchemaFactory.createForClass(Game);
