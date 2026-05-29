/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, ManyToMany } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { NoteImage } from './note-image.entity';
import { NoteLink } from './note-link.entity';
import { Tag } from './tag.entity';
import { Canvas } from './canvas.entity';
import { Story } from './story.entity';
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

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  mood?: string;

  /**
   * Font family for the note title (CSS value, e.g.
   * "var(--font-caveat), cursive"). Null/undefined means
   * fall back to the default UI font.
   */
  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  titleFont?: string;

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

  // Canvas relationship (Multi-canvas support)
  @Field(() => Canvas, { nullable: true })
  @ManyToOne(() => Canvas, { nullable: true })
  canvas?: Canvas;

  // Story relationship
  @Field(() => Story, { nullable: true })
  @ManyToOne(() => Story, { nullable: true })
  story?: Story;

  // Story node type (scene, memory, character, dialogue, moment, feeling, timeline_event, media, quote, reflection)
  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  storyNodeType?: string;

  // Story node metadata (JSON for flexible data)
  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  storyMetadata?: string;

  // Lock specific nodes for privacy
  @Field(() => Boolean)
  @Property({ default: false })
  isLocked: boolean = false;

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  unlockDate?: Date;

  @Field(() => Boolean)
  get isTimeLocked(): boolean {
    return Boolean(this.unlockDate && this.unlockDate.getTime() > Date.now());
  }

  // Tag relationship (Many-to-many)
  @Field(() => [Tag], { nullable: 'itemsAndList' })
  @ManyToMany(() => Tag, tag => tag.notes, { owner: true })
  tags = new Collection<Tag>(this);

  @Field(() => Boolean)
  @Property({ default: false })
  isArchived: boolean = false;

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  archivedAt?: Date;

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  eventDate?: Date;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  eventLocation?: string;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
