import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ArgsType()
export class LoginReqDto {
    @Field()
    @ApiProperty()
    @IsString()
    readonly username: string;

    @Field()
    @ApiProperty()
    @IsString()
    readonly password: string;
}

@ArgsType()
@ObjectType()
export class LoginRspDto {
    @Field()
    @ApiProperty()
    @IsString()
    readonly session: string;
}
