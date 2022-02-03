import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PublisherDocument = Publisher & Document;

@Schema()
export class Publisher {
    @Prop()
    name: string;

    @Prop()
    siret: number;

    @Prop()
    phone: string;

}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
