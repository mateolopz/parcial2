import { Test, TestingModule } from '@nestjs/testing';
import { BonoService } from './bono.service';
import { Repository } from 'typeorm';
import { BonoEntity } from './bono.entity/bono.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';

describe('BonoService', () => {
  let service: BonoService;
  let repository: Repository<BonoEntity>;
  let userRepository: Repository<UsuarioEntity>;
  let bonoList: BonoEntity[];
  let usuarioList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService, UsuarioEntity],
    }).compile();

    service = module.get<BonoService>(BonoService);
    repository = module.get<Repository<BonoEntity>>(getRepositoryToken(BonoEntity));
    userRepository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    userRepository.clear();
    bonoList = [];
    usuarioList = [];
    for(let i = 0; i < 5; i++){
        const bono: BonoEntity = await repository.save({
        id: faker.number.int().toString(),
        monto: faker.number.int(), 
        calificacion: 3, 
        palabraClave: faker.lorem.sentence()});
        bonoList.push(bono);
    }
    const usuario: UsuarioEntity = await userRepository.save({
      id: "1",
      cedula: faker.number.int(),
      nombre: faker.lorem.sentence(),
      grupoDeInvestigacion: faker.lorem.sentence(),
      numeroExtension: faker.number.int(),
      rol: "Profesor",
      jefe: faker.lorem.sentence(),
      bonos: bonoList,
    });
    usuarioList.push(usuario);
  }

  it('crearBono with the correct attributes should return a new bono', async () => {

    
    const bono: BonoEntity = {
      id: faker.number.int().toString(),
      monto: 10, 
      calificacion: faker.number.int(), 
      palabraClave: faker.lorem.sentence(),
      usuario: usuarioList[0],
      clase: null   
    };
    
    const newBono: BonoEntity = await service.crearBono(bono);
    expect(newBono).not.toBeNull();
      
    const storedBono: BonoEntity = await repository.findOne({where: {id: newBono.id}})
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(newBono.monto)
    expect(storedBono.calificacion).toEqual(newBono.calificacion)
    expect(storedBono.palabraClave).toEqual(newBono.palabraClave)
  });

  it('crearBono with incorrect attributes should not return a new bono', async () => {
    const bono: BonoEntity = {
      id: faker.number.int().toString(),
      monto: -10, 
      calificacion: faker.number.int(), 
      palabraClave: faker.lorem.sentence(),
      usuario: {id: faker.number.int().toString(), cedula: faker.number.int(), nombre: faker.lorem.sentence(), grupoDeInvestigacion: faker.lorem.sentence(), numeroExtension: faker.number.int(), rol: "asd", jefe: faker.lorem.sentence(), bonos: [], clases: []},
      clase: null   
    };
    
    await expect(() => service.crearBono(bono)).rejects.toHaveProperty("message", "El valor del bono es invalido o el usuario no es profesor")
  });

  it('findAllBonosByUsuario should return a list of bonos', async () => {
    const storedUsuario: UsuarioEntity = usuarioList[0];
    const bonos: BonoEntity[] = await service.findAllBonosByUsuario(storedUsuario.id);
    expect(bonos).not.toBeNull();
    for (let i = 0; i < bonos.length; i++){
      expect(bonos[i].calificacion).toEqual(bonoList[i].calificacion)
      expect(bonos[i].monto).toEqual(bonoList[i].monto)
      expect(bonos[i].palabraClave).toEqual(bonoList[i].palabraClave)
      expect(bonos[i].id).toEqual(bonoList[i].id)
    }
  });

  it('findAllBonosByUsuario should throw an exception for an invalid id', async () => {
    await expect(() => service.findAllBonosByUsuario("asdasd")).rejects.toHaveProperty("message", "The bonus with the given id was not found")
  });

  it('deleteBono should remove a bono', async () => {
    const bono: BonoEntity = bonoList[0];
    await service.deleteBono(bono.id);
     const deletedBono: BonoEntity = await repository.findOne({ where: { id: bono.id } })
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception for an invalid bono', async () => {
    const bono: BonoEntity = bonoList[0];
    await expect(() => service.deleteBono("asd")).rejects.toHaveProperty("message", "The bonus with the given id was not found")
  });
});
