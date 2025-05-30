import { ApiProperty } from "@nestjs/swagger";

export class CreateRelCollectionUserAccessDto {
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    user_id: string;
    @ApiProperty({ example: 'a49e39b3-81aa-4beb-bed4-e7103f962e60' })
    collection_id: string;
    @ApiProperty({ example: 1 })
    permission_type_id: number;
}
