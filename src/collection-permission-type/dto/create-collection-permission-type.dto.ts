import { ApiProperty } from "@nestjs/swagger";

export class CreateCollectionPermissionTypeDto {
    @ApiProperty({enum: ['read', 'write', 'admin'], example: 'read'})
    name: string;
    @ApiProperty({ example: 'Permissão de leitura para a coleção.' })
    description?: string;
}
