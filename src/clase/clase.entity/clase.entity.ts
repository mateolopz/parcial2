import { BonoEntity } from '../../bono/bono.entity/bono.entity';
import { UsuarioEntity } from '../../usuario/usuario.entity/usuario.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ClaseEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    nombre: string;
    
    @Column()
    codigo: string;
    
    @Column()
    numeroCreditos: number; 
    
    @OneToMany(() => BonoEntity, bono => bono.clase)
    @JoinColumn()
    bonos: BonoEntity[];

    @ManyToOne(() => UsuarioEntity, usuario => usuario.bonos)
    @JoinColumn()
    usuario: UsuarioEntity;
}
