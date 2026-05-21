import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class WritingStreak {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => User)
  @OneToOne(() => User, { owner: true, unique: true })
  user!: User;

  @Field(() => Int)
  @Property({ default: 0 })
  currentStreak: number = 0;

  @Field(() => Int)
  @Property({ default: 0 })
  longestStreak: number = 0;

  @Field(() => Int)
  @Property({ default: 0 })
  totalWriteDays: number = 0;

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  lastWriteDate?: Date;

  @Field(() => Date)
  @Property()
  createdAt: Date = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
