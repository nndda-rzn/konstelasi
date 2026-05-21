import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Story } from './story.entity';
import { Note } from './note.entity';
import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';

export enum BadgeType {
  MOVED = 'moved',
  FAVORITE = 'favorite',
  BOOKMARKED = 'bookmarked',
  THOUGHT_PROVOKING = 'thought_provoking',
  MEMORABLE = 'memorable',
}

registerEnumType(BadgeType, { name: 'BadgeType' });

@ObjectType()
@Entity()
export class StoryEngagement {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => Story)
  @ManyToOne(() => Story, { deleteRule: 'cascade' })
  story!: Story;

  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  @Field(() => Note, { nullable: true })
  @ManyToOne(() => Note, { nullable: true, deleteRule: 'set null' })
  node?: Note;

  @Field(() => String)
  @Property()
  type!: string; // 'bookmark' | 'badge' | 'view'

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  badgeType?: string;

  @Field(() => Int)
  @Property({ default: 0 })
  viewCount: number = 0;

  @Field(() => Int)
  @Property({ default: 0 })
  timeSpent: number = 0;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
