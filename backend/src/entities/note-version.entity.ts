import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Note } from './note.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class NoteVersion {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => Note)
  @ManyToOne(() => Note, { deleteRule: 'cascade' })
  note!: Note;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  color?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  mood?: string;

  @Field(() => Int)
  @Property({ default: 1 })
  version: number = 1;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}
