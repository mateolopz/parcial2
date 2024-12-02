import { Injectable, PreconditionFailedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';

@Injectable()
export class BonoService {
    constructor(
        @InjectRepository(BonoEntity)
        private readonly bonoRepository: Repository<BonoEntity>
    ){}

    async crearBono(bono: BonoEntity): Promise<BonoEntity> {
        if (bono.monto > 0 && bono.usuario.rol === "Profesor") {
            return await this.bonoRepository.save(bono);
        }
        throw new BusinessLogicException('El valor del bono es invalido o el usuario no es profesor',BusinessError.PRECONDITION_FAILED);
    }

    async findBonoByCodigo(cod: string): Promise<BonoEntity> {
        const bono: BonoEntity = await this.bonoRepository.findOne({where: {palabraClave:cod}, relations: ["usuario", "clase"] } );
        if (!bono)
          throw new BusinessLogicException("The bonus with the given code was not found", BusinessError.NOT_FOUND);
    
        return bono;
    }

    async findAllBonosByUsuario(userID: string): Promise<BonoEntity[]> {
        const bono: BonoEntity[] = await this.bonoRepository.find({where: {usuario:{id:userID}}, relations: ["usuario", "clase"] } );
        if (bono.length === 0 || !bono)
          throw new BusinessLogicException("The bonus with the given id was not found", BusinessError.NOT_FOUND);
    
        return bono;
    }

    async deleteBono(id: string) {
        const bono: BonoEntity = await this.bonoRepository.findOne({where:{id},relations: ["usuario", "clase"]});
        if (!bono)
          throw new BusinessLogicException("The bonus with the given id was not found", BusinessError.NOT_FOUND);
        else if(bono.calificacion > 4){
            throw new BusinessLogicException("The bonus calification is bigger than 4", BusinessError.PRECONDITION_FAILED);
            }
        await this.bonoRepository.remove(bono);
    }
}
