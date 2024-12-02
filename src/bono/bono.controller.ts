import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BonoService } from './bono.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { BonoDto } from './bono.dto';
import { BonoEntity } from './bono.entity/bono.entity';

@Controller('bono')
@UseInterceptors(BusinessErrorsInterceptor)
export class BonoController {
    constructor(private readonly bonoService: BonoService) {}

  @Get(':userId')
  async findAllBonosByUsuario(@Param('userId') userId: string) {
    return await this.bonoService.findAllBonosByUsuario(userId);
  }

  @Post()
  async crearBono(@Body() BonoDto: BonoDto) {
    const bono: BonoEntity = plainToInstance(BonoEntity, BonoDto);
    return await this.bonoService.crearBono(bono);
  }

  @Delete(':bonoId')
  @HttpCode(204)
  async deleteBono(@Param('bonoId') bonoId: string) {
    return await this.bonoService.deleteBono(bonoId);
  }
}