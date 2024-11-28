import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { UsuarioEntity } from 'src/usuario/usuario.entity/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BonoEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    monto: number;
    
    @Column()
    calificacion: number;
    
    @Column()
    palabraClave: string; 
    
    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    usuario: UsuarioEntity;

    @ManyToOne(() => ClaseEntity, clase => clase.bonos)
    clase: ClaseEntity;
}