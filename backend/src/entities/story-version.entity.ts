import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { v4 } from 'uuid';
import { Story } from './story.entity';

@ObjectType()
@Entity()
export class StoryVersion {
  @Field()
  @PrimaryKey()
  id: string = v4();

  @ManyToOne(() => Story)
  story!: Story;

  @Field(() => Int)
  @Property()
  version!: number;

  @Field({ nullable: true })
  @Property({ nullable: true })
  label?: string;

  @Field({ nullable: true })
  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Field()
  @Property({ type: 'text' })
  snapshot!: string;

  @Field(() => Int)
  @Property({ default: 0 })
  nodeCount: number = 0;

  @Field(() => Int)
  @Property({ default: 0 })
  wordCount: number = 0;

  @Field()
  @Property()
  createdAt: Date = new Date();
}
