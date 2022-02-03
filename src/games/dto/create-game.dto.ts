import { Schema } from 'mongoose';

export class CreateGameDto {
    title: string;
    price: number;
    discounted: boolean;
    tags: string[];
    releaseDate: string;
    publisherId: Schema.Types.ObjectId;
}
