import { Schema } from "mongoose";

export class CreateGameDto {
    title: string;
    price: number;
    tags: string[];
    releaseDate: string;
    publisherId: Schema.Types.ObjectId;
}
