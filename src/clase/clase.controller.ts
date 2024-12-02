import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClaseService } from './clase.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ClaseDto } from './clase.dto';
import { ClaseEntity } from './clase.entity/clase.entity';

@Controller('clase')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClaseController {
    constructor(private readonly claseService: ClaseService) {}

  @Get(':claseId')
  async findClaseById(@Param('claseId') claseId: string) {
    return await this.claseService.findClaseById(claseId);
  }

  @Post()
  async crearClase(@Body() ClaseDto: ClaseDto) {
    const clase: ClaseEntity = plainToInstance(ClaseEntity, ClaseDto);
    return await this.claseService.crearClase(clase);
  }
}