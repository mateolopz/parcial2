import { Test, TestingModule } from '@nestjs/testing';
import { ClaseService } from './clase.service';
import { Repository } from 'typeorm';
import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker/.';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let claseList: ClaseEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    claseList = [];
    for(let i = 0; i < 5; i++){
        const clase: ClaseEntity = await repository.save({
        id: faker.number.int().toString(),
        nombre: faker.lorem.sentence(), 
        codigo: faker.lorem.sentence(), 
        numeroCreditos: faker.number.int()});
        claseList.push(clase);
    }
  }

  it('crearClase with the correct attributes should return a new clase', async () => {
    const clase: ClaseEntity = {
      id: faker.number.int().toString(),
      nombre: faker.lorem.sentence(), 
      codigo: "1324567890", 
      numeroCreditos: faker.number.int(),
      bonos: [],
      usuario: null     
    };
    
    const newClase: ClaseEntity = await service.crearClase(clase);
    expect(newClase).not.toBeNull();
      
    const storedClase: ClaseEntity = await repository.findOne({where: {id: newClase.id}})
    expect(storedClase).not.toBeNull();
    expect(storedClase.codigo).toEqual(newClase.codigo)
    expect(storedClase.nombre).toEqual(newClase.nombre)
    expect(storedClase.numeroCreditos).toEqual(newClase.numeroCreditos)
  });

  it('crearClase with incorrect attributes should not return a new clase', async () => {
    const clase: ClaseEntity = {
      id: faker.number.int().toString(),
      nombre: faker.lorem.sentence(), 
      codigo: "1324567asdasd890", 
      numeroCreditos: faker.number.int(),
      bonos: [],
      usuario: null     
    };
    
    await expect(() => service.crearClase(clase)).rejects.toHaveProperty("message", "No se puede guardar la clase")
  });

  it('findClaseById should return a clase by id', async () => {
    const storedClase: ClaseEntity = claseList[0];
    const clase: ClaseEntity = await service.findClaseById(storedClase.id);
    expect(clase).not.toBeNull();
    expect(clase.codigo).toEqual(storedClase.codigo)
    expect(clase.nombre).toEqual(storedClase.nombre)
    expect(clase.numeroCreditos).toEqual(storedClase.numeroCreditos)
  });

  it('findUsuarioById should throw an exception for an invalid id', async () => {
    await expect(() => service.findClaseById("asdasd")).rejects.toHaveProperty("message", "The class with the given code was not found")
  });
});
