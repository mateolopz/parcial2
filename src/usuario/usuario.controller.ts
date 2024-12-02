import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UsuarioService } from './usuario.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { UsuarioDto } from './usuario.dto';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Controller('usuario')
@UseInterceptors(BusinessErrorsInterceptor)
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

  @Get(':userId')
  async findUsuarioById(@Param('userId') userId: string) {
    return await this.usuarioService.findUsuarioById(userId);
  }

  @Post()
  async crearUsuario(@Body() UsuarioDto: UsuarioDto) {
    const bono: UsuarioEntity = plainToInstance(UsuarioEntity, UsuarioDto);
    return await this.usuarioService.crearUsuario(bono);
  }

  @Delete(':usuarioId')
  @HttpCode(204)
  async eliminarUsuario(@Param('usuarioId') usuarioId: string) {
    return await this.usuarioService.eliminarUsuario(usuarioId);
  }
}