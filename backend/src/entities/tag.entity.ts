// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryKey, Property, ManyToMany, ManyToOne, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Note } from './note.entity';
import { User } from './user.entity';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  color?: string; // Hex color code for tag visualization

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  description?: string;

  // Relationship to User (owner)
  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  // Many-to-many relationship with Note
  @Field(() => [Note], { nullable: 'itemsAndList' })
  @ManyToMany({ entity: () => Note, mappedBy: 'tags' })
  notes = new Collection<Note>(this);

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}