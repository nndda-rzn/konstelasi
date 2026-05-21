// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Note } from './note.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Canvas {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  // Relationship to User (owner)
  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  // Nested Canvas (Self-Relation)
  @Field(() => Canvas, { nullable: true })
  @ManyToOne(() => Canvas, { nullable: true })
  parent?: Canvas;

  @Field(() => [Canvas], { nullable: 'itemsAndList' })
  @OneToMany(() => Canvas, canvas => canvas.parent)
  children = new Collection<Canvas>(this);

  @Field(() => Int)
  @Property({ default: 0 })
  level: number = 0;

  @Field(() => Int)
  @Property({ default: 0 })
  order: number = 0;

  // One-to-many with Note (notes belong to a canvas)
  @Field(() => [Note], { nullable: 'itemsAndList' })
  @OneToMany(() => Note, note => note.canvas)
  notes = new Collection<Note>(this);

  @Field(() => Boolean)
  @Property({ default: false })
  isArchived: boolean = false;

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  archivedAt?: Date;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}