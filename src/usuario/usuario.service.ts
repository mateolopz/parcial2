import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}

    async crearUsuario(usuario: UsuarioEntity): Promise<UsuarioEntity> {
        if (usuario.rol === "Profesor" && usuario.grupoDeInvestigacion in ["TICSW","IMAGINE","COMIT"]) {
            return await this.usuarioRepository.save(usuario);
        }
        else if(usuario.rol === "Decana" && usuario.numeroExtension.toString().length === 8){
            return await this.usuarioRepository.save(usuario);
        }
        throw new BusinessLogicException('No se puede guardar el profesor',BusinessError.PRECONDITION_FAILED);
    }
    
    async findUsuarioById(id: string): Promise<UsuarioEntity> {
        const usuario: UsuarioEntity = await this.usuarioRepository.findOne({where: {id}, relations: ["bonos", "clases"] } );
        if (!usuario)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
        return usuario;
    }

    async eliminarUsuario(id: string) {
        const profesor: UsuarioEntity = await this.usuarioRepository.findOne({where:{id},relations: ['propuestas']});
        if (!profesor)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND);
        else if(profesor.propuestas.length > 0){
            for (let i = 0; i < profesor.propuestas.length; i++) {
                if(profesor.propuestas[i].proyecto != null){
                    throw new BusinessLogicException("The professor has a proposal with a project", BusinessError.NOT_FOUND);
                }
            }
        }
        await this.profesorRepository.remove(profesor);
    }

}
