import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@ArgsType()
@ObjectType()
export class CreateCollectionReqDto {
    @Field()
    @ApiProperty()
    @IsString()
    @Type()
    readonly collectionMetaUrl: string;

    @Field()
    @ApiProperty()
    @IsString()
    @Type()
    readonly nftBaseUri: string;

    @Field((type) => Int, { nullable: true })
    @ApiProperty({
        nullable: true,
        default: 0,
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    readonly nftBeginId?: number = 0;

    @Field((type) => Int, { nullable: true })
    @ApiProperty({
        nullable: true,
        default: 10,
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    readonly royaltyFactor?: number = 10;

    @Field((type) => Int, { nullable: true })
    @ApiProperty({
        nullable: true,
        default: 10,
    })
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    readonly royaltyBase?: number = 10;
}

@ObjectType()
export class CreateCollectionRspDto {
    @Field()
    @ApiProperty()
    readonly collectionAddress: string;

    @Field()
    @ApiProperty()
    readonly owner: string;

    @Field()
    @ApiProperty()
    readonly collectionDetail: string;

    @Field()
    @ApiProperty()
    readonly ownerDetail: string;

    @Field((type) => Int)
    @ApiProperty()
    @Type(() => Number)
    readonly seqno: number;
}
