import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateNoteInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  positionX?: number;

  @Field(() => Float, { nullable: true })
  positionY?: number;

  @Field(() => String, { nullable: true })
  canvasId?: string;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}

@InputType()
export class UpdateNotePositionInput {
  @Field(() => String)
  id!: string;

  @Field(() => Float)
  positionX!: number;

  @Field(() => Float)
  positionY!: number;
}

@InputType()
export class UpdateNoteContentInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  content?: string;

  @Field(() => String, { nullable: true })
  color?: string;

  @Field(() => String, { nullable: true })
  type?: string;

  @Field(() => String, { nullable: true })
  mood?: string;

  @Field(() => String, { nullable: true })
  canvasId?: string;

  @Field(() => [String], { nullable: true })
  tagIds?: string[];
}

@InputType()
export class UpdateNoteSizeInput {
  @Field(() => String)
  id!: string;

  @Field(() => Float)
  width!: number;

  @Field(() => Float)
  height!: number;
}

@InputType()
export class BatchUpdateNoteInput {
  @Field(() => String)
  id!: string;

  @Field(() => Float, { nullable: true })
  positionX?: number;

  @Field(() => Float, { nullable: true })
  positionY?: number;

  @Field(() => Float, { nullable: true })
  width?: number;

  @Field(() => Float, { nullable: true })
  height?: number;
}

@InputType()
export class CreateNoteLinkInput {
  @Field(() => String)
  sourceId!: string;

  @Field(() => String)
  targetId!: string;

  @Field(() => String, { nullable: true })
  sourceHandle?: string;

  @Field(() => String, { nullable: true })
  targetHandle?: string;
}

@InputType()
export class AddNoteImageInput {
  @Field(() => String)
  noteId!: string;

  @Field(() => String)
  imageUrl!: string;

  @Field(() => String, { nullable: true })
  caption?: string;
  
  @Field(() => Int, { nullable: true })
  order?: number;
}

@InputType()
export class UpdateNoteLinkInput {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  label?: string;

  @Field(() => String, { nullable: true })
  color?: string;
}
