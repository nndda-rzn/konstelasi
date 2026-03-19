// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { NoteImage } from './note-image.entity';
import { NoteLink } from './note-link.entity';
import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Note {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property()
  title!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  content?: string;

  @Field(() => String)
  @Property({ default: 'default' })
  type: string = 'default';

  @Field(() => Float)
  @Property({ type: 'float', default: 0 })
  positionX: number = 0;

  @Field(() => Float)
  @Property({ type: 'float', default: 0 })
  positionY: number = 0;

  @Field(() => Float, { nullable: true })
  @Property({ nullable: true })
  width?: number;

  @Field(() => Float, { nullable: true })
  @Property({ nullable: true })
  height?: number;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  color?: string;

  // Fitur Grouping (Self-Relation)
  @Field(() => Note, { nullable: true })
  @ManyToOne(() => Note, { nullable: true })
  parent?: Note;

  @Field(() => [Note], { nullable: 'itemsAndList' })
  @OneToMany(() => Note, note => note.parent)
  children = new Collection<Note>(this);

  @Field(() => [NoteImage], { nullable: 'itemsAndList' })
  @OneToMany(() => NoteImage, image => image.note)
  images = new Collection<NoteImage>(this);

  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  // Relasi Kabel (Edges)
  @Field(() => [NoteLink], { nullable: 'itemsAndList' })
  @OneToMany(() => NoteLink, link => link.source)
  outgoingEdges = new Collection<NoteLink>(this);

  @Field(() => [NoteLink], { nullable: 'itemsAndList' })
  @OneToMany(() => NoteLink, link => link.target)
  incomingEdges = new Collection<NoteLink>(this);

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}