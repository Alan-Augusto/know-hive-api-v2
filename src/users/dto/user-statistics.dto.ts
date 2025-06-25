import { ApiProperty } from "@nestjs/swagger";

export class RecentItemDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Título da questão ou coleção' })
  title: string;

  @ApiProperty({ example: 'Enunciado da questão', required: false })
  statment?: string;

  @ApiProperty({ example: '2025-06-24T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ example: 'João Silva' })
  author_name?: string;

  @ApiProperty({ example: ['Matemática', 'Álgebra'], type: [String], required: false })
  tags?: string[];

  @ApiProperty({ example: 'https://example.com/profile.jpg', required: false })
  profile_picture?: string;

  @ApiProperty({ example: 'question' })
  type: 'question' | 'collection';

  @ApiProperty({ example: false })
  is_owned: boolean;

  @ApiProperty({ example: true })
  is_liked: boolean;
}

export class TagStatisticDto {
  @ApiProperty({ example: 'uuid-v4' })
  id: string;

  @ApiProperty({ example: 'Matemática' })
  name: string;

  @ApiProperty({ example: 15 })
  usage_count: number;
}

export class UserStatisticsDto {
  @ApiProperty({ example: 45 })
  questions_created: number;

  @ApiProperty({ example: 12 })
  collections_created: number;

  @ApiProperty({ example: 127 })
  shared_items_count: number;

  @ApiProperty({ example: 23 })
  favorites_count: number;

  @ApiProperty({ example: 156 })
  total_responses: number;

  @ApiProperty({ example: 89 })
  correct_responses: number;

  @ApiProperty({ example: 57.05 })
  accuracy_percentage: number;

  @ApiProperty({ type: [RecentItemDto] })
  recent_questions: RecentItemDto[];

  @ApiProperty({ type: [RecentItemDto] })
  recent_collections: RecentItemDto[];

  @ApiProperty({ type: [TagStatisticDto] })
  most_used_tags: TagStatisticDto[];

  @ApiProperty({ example: 8 })
  collections_with_access: number;

  @ApiProperty({ example: 45 })
  questions_with_access: number;
}
