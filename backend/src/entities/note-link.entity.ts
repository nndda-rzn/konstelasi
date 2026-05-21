// eslint-disable-next-line prettier/prettier
import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Note } from './note.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
@Unique({ properties: ['source', 'target'] }) // Mencegah duplikasi rute kabel
export class NoteLink {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => Note)
  @ManyToOne(() => Note, { deleteRule: 'cascade' })
  source!: Note;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  sourceHandle?: string;

  @Field(() => Note)
  @ManyToOne(() => Note, { deleteRule: 'cascade' })
  target!: Note;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  targetHandle?: string;

  @Field(() => String)
  @Property({ default: 'default' })
  type: string = 'default';

  @Field(() => Boolean)
  @Property({ default: false })
  animated: boolean = false;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  label?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  color?: string;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();
}
