import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Story } from './story.entity';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';

export enum AccessLevel {
  VIEW = 'view',
  EDIT = 'edit',
}

registerEnumType(AccessLevel, { name: 'AccessLevel' });

@ObjectType()
@Entity()
export class StoryAccess {
  @Field(() => String)
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @Field(() => Story)
  @ManyToOne(() => Story, { deleteRule: 'cascade' })
  story!: Story;

  @Field(() => User)
  @ManyToOne(() => User, { deleteRule: 'cascade' })
  grantedTo!: User;

  @Field(() => AccessLevel)
  @Enum(() => AccessLevel)
  accessLevel: AccessLevel = AccessLevel.VIEW;

  @Field(() => Date)
  @Property()
  grantedAt: Date = new Date();

  @Field(() => Date, { nullable: true })
  @Property({ nullable: true })
  expiresAt?: Date;
}
