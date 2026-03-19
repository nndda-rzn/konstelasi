import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Note } from './note.entity';
import { NoteImage } from './note-image.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property({ unique: true })
  email!: string;

  @Field(() => [Note], { nullable: 'itemsAndList' })
  @OneToMany(() => Note, note => note.user)
  notes = new Collection<Note>(this);

  @Field(() => [NoteImage], { nullable: 'itemsAndList' })
  @OneToMany(() => NoteImage, image => image.user)
  images = new Collection<NoteImage>(this);

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}