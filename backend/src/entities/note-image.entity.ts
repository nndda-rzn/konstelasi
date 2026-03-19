import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Note } from './note.entity';
import { User } from './user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class NoteImage {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property()
  imageUrl!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  caption?: string;

  @Field(() => Int)
  @Property({ default: 0 })
  order: number = 0;

  @Field(() => Note)
  @ManyToOne(() => Note, { deleteRule: 'cascade' })
  note!: Note;

  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}