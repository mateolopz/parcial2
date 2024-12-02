import {IsArray, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { UsuarioDto } from '../usuario/usuario.dto';
import { BonoDto } from '../bono/bono.dto';

export class ClaseDto {

 @IsString()
 @IsNotEmpty()
 readonly id: string;
 
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly codigo: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly numeroCreditos: number;
 
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => BonoDto) 
 readonly bonos: BonoDto[];

 @ValidateNested({ each: true })
 @Type(() => UsuarioDto) 
 readonly usuario: UsuarioDto[];
}