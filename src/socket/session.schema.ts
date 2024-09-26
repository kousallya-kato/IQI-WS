import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  strict: true,
})
export class Session {
  @Prop({ ref: 'User', type: MongooseSchema.Types.ObjectId, required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ ref: 'Table', type: MongooseSchema.Types.ObjectId, required: true })
  table: MongooseSchema.Types.ObjectId;


  @Prop({ ref: 'Contractor', type: MongooseSchema.Types.ObjectId, required: true })
  contractor: MongooseSchema.Types.ObjectId;


  @Prop({ ref: 'Admin', type: MongooseSchema.Types.ObjectId })
  admin: MongooseSchema.Types.ObjectId;

  @Prop({ ref: 'User', type: [MongooseSchema.Types.ObjectId] })
  assignees: MongooseSchema.Types.ObjectId[];

  @Prop({
    type: [{
      sender:  {type: String} , 
      content: { type: String, required: true },                    
      createdAt: { type: Date, default: Date.now },                
    }],
  })
  messages: {
    sender: string;
    content: string;
    createdAt: Date;
  }[];

  @Prop({ default: false, type: Boolean })
  archived: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
