import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection, Enum } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Note } from './note.entity';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum StoryType {
  LOVE_STORY = 'love_story',
  BIOGRAPHY = 'biography',
  CHARACTER_STUDY = 'character_study',
  MEMORY_COLLECTION = 'memory_collection',
  ADVENTURE = 'adventure',
  CUSTOM = 'custom',
}

export enum StoryStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum PrivacyLevel {
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only',
  PUBLIC = 'public',
}

registerEnumType(StoryType, { name: 'StoryType' });
registerEnumType(StoryStatus, { name: 'StoryStatus' });
registerEnumType(PrivacyLevel, { name: 'PrivacyLevel' });

@ObjectType()
@Entity()
export class Story {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => String)
  @Property()
  title!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  subtitle?: string;

  @Field(() => String, { nullable: true })
  @Property({ type: 'text', nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  coverImage?: string;

  @Field(() => StoryType)
  @Enum(() => StoryType)
  storyType: StoryType = StoryType.CUSTOM;

  @Field(() => StoryStatus)
  @Enum(() => StoryStatus)
  status: StoryStatus = StoryStatus.DRAFT;

  @Field(() => PrivacyLevel)
  @Enum(() => PrivacyLevel)
  privacyLevel: PrivacyLevel = PrivacyLevel.PRIVATE;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  theme?: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  authorNote?: string;

  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  user!: User;

  @Field(() => [Note], { nullable: 'itemsAndList' })
  @OneToMany(() => Note, note => (note as any).story)
  nodes = new Collection<Note>(this);

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
