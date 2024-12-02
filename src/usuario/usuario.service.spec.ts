import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuarioList: UsuarioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(getRepositoryToken(UsuarioEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuarioList = [];
    for(let i = 0; i < 5; i++){
        const usuario: UsuarioEntity = await repository.save({
        id: faker.number.int().toString(),
        cedula: faker.number.int(), 
        nombre: faker.lorem.sentence(), 
        grupoDeInvestigacion: faker.lorem.sentence(), 
        numeroExtension: faker.number.int(),
        rol: faker.lorem.sentence(),
        jefe: faker.lorem.sentence()});
        usuarioList.push(usuario);
    }
  }

  it('crearUsuario with the correct attributes should return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int().toString(),
      cedula: faker.number.int(), 
      nombre: faker.lorem.sentence(), 
      grupoDeInvestigacion: "IMAGINE", 
      numeroExtension: faker.number.int(),
      rol: "Profesor",
      jefe: faker.lorem.sentence(),
      bonos: [],
      clases: []        
    };
    
    const newUsuario: UsuarioEntity = await service.crearUsuario(usuario);
    expect(newUsuario).not.toBeNull();
      
    const storedUsuario: UsuarioEntity = await repository.findOne({where: {id: newUsuario.id}})
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.cedula).toEqual(newUsuario.cedula)
    expect(storedUsuario.nombre).toEqual(newUsuario.nombre)
    expect(storedUsuario.grupoDeInvestigacion).toEqual(newUsuario.grupoDeInvestigacion)
    expect(storedUsuario.numeroExtension).toEqual(newUsuario.numeroExtension)
    expect(storedUsuario.rol).toEqual(newUsuario.rol)
    expect(storedUsuario.jefe).toEqual(newUsuario.jefe)
  });

  it('crearUsuario with incorrect attributes should not return a new usuario', async () => {
    const usuario: UsuarioEntity = {
      id: faker.number.int().toString(),
      cedula: faker.number.int(), 
      nombre: faker.lorem.sentence(), 
      grupoDeInvestigacion: "rectoria", 
      numeroExtension: faker.number.int(),
      rol: "secretario",
      jefe: faker.lorem.sentence(),
      bonos: [],
      clases: []        
    };
    
    await expect(() => service.crearUsuario(usuario)).rejects.toHaveProperty("message", "No se puede guardar el profesor")
  });

  it('findUsuarioById should return a usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuarioList[0];
    const usuario: UsuarioEntity = await service.findUsuarioById(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.cedula).toEqual(storedUsuario.cedula)
    expect(usuario.nombre).toEqual(storedUsuario.nombre)
    expect(usuario.grupoDeInvestigacion).toEqual(storedUsuario.grupoDeInvestigacion)
    expect(usuario.numeroExtension).toEqual(storedUsuario.numeroExtension)
    expect(usuario.rol).toEqual(storedUsuario.rol)
    expect(usuario.jefe).toEqual(storedUsuario.jefe)
  });

  it('findUsuarioById should throw an exception for an invalid id', async () => {
    await expect(() => service.findUsuarioById("asdasd")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });

  it('eliminarUsuario should remove a usuario', async () => {
    const usuario: UsuarioEntity = usuarioList[0];
    await service.eliminarUsuario(usuario.id);
     const deletedUsuario: UsuarioEntity = await repository.findOne({ where: { id: usuario.id } })
    expect(deletedUsuario).toBeNull();
  });

  it('eliminarUsuario should throw an exception for an invalid usuario', async () => {
    const asistencia: UsuarioEntity = usuarioList[0];
    await expect(() => service.eliminarUsuario("asd")).rejects.toHaveProperty("message", "The user with the given id was not found")
  });
});
