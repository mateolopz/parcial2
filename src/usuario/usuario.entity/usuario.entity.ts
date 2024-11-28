import { BonoEntity } from 'src/bono/bono.entity/bono.entity';
import { ClaseEntity } from 'src/clase/clase.entity/clase.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UsuarioEntity {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    cedula: number;
    
    @Column()
    nombre: string;
    
    @Column()
    grupoDeInvestigacion: string;
    
    @Column()
    numeroExtension: number;   

    @Column()
    rol: string;  
    
    @Column()
    jefe: string;

    @OneToMany(() => BonoEntity, bono => bono.usuario)
    @JoinColumn()
    bonos: BonoEntity[];

    @OneToMany(() => ClaseEntity, clase => clase.usuario)
    clases: ClaseEntity[];
}
