import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';

@Injectable()
export class ClaseService {
    constructor(
        @InjectRepository(ClaseEntity)
        private readonly claseRepository: Repository<ClaseEntity>
    ){}

    async crearClase(clase: ClaseEntity): Promise<ClaseEntity> {
        if (clase.codigo.length === 10) {
            return await this.claseRepository.save(clase);
        }
        throw new BusinessLogicException('No se puede guardar la clase',BusinessError.PRECONDITION_FAILED);
    }

    async findClaseById(id: string): Promise<ClaseEntity> {
        const clase: ClaseEntity = await this.claseRepository.findOne({where: {id}, relations: ["usuario", "bonos"] } );
        if (!clase)
          throw new BusinessLogicException("The class with the given code was not found", BusinessError.NOT_FOUND);
    
        return clase;
    }

    }
