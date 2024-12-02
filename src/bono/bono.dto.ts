import {IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';
import { UsuarioDto } from '../usuario/usuario.dto';
import { ClaseDto } from '../clase/clase.dto';

export class BonoDto {

 @IsString()
 @IsNotEmpty()
 readonly id: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly monto: number;
 
 @IsNumber()
 @IsNotEmpty()
 readonly calificación: number;
 
 @IsString()
 @IsNotEmpty()
 readonly palabraClave: string;
 
 @ValidateNested({ each: true })
 @Type(() => UsuarioDto) 
 readonly usuario: UsuarioDto;

 @ValidateNested({ each: true })
 @Type(() => ClaseDto) 
 readonly clase: ClaseDto;
}

