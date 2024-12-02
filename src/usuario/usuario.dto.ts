import { Type } from 'class-transformer';
import {IsArray, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested} from 'class-validator';
import { BonoDto } from 'src/bono/bono.dto';
import { ClaseDto } from 'src/clase/clase.dto';
export class UsuarioDto {

 @IsString()
 @IsNotEmpty()
 readonly id: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly cedula: number;
 
 @IsString()
 @IsNotEmpty()
 readonly nombre: string;
 
 @IsString()
 @IsNotEmpty()
 readonly grupoDeInvestigacion: string;
 
 @IsNumber()
 @IsNotEmpty()
 readonly numeroExtension: number;

 @IsString()
 @IsNotEmpty()
 readonly rol: string;

 @IsString()
 @IsNotEmpty()
 readonly jefe: string;

 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => BonoDto) 
 readonly bonos: BonoDto[];

 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => ClaseDto) 
 readonly clases: ClaseDto[];
}