import { ApiProperty } from "@nestjs/swagger";

export class CreateRelQuestionCollectionDto {
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    question_id: string;
    @ApiProperty({ example: 'b49e39b3-81aa-4beb-bed4-e7103f962e60' })
    collection_id: string;
}
