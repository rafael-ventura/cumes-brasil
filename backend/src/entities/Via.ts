// entities/Via.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn, CreateDateColumn, UpdateDateColumn
} from "typeorm";
import { Montanha } from "./Montanha";  // Assumindo que você também terá uma entidade Montanha
import { Face } from "./Face";          // Assumindo que você também terá uma entidade Face
import { Fonte } from "./Fonte";        // Assumindo que você também terá uma entidade Fonte
import { Variante } from "./Variante";


@Entity("vias")
export class Via {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    vias!: string;

    @Column({ type: "float", nullable: true })
    grau?: number;

    @Column({ type: "varchar", length: 50, nullable: true })
    crux?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    aid?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    duracao?: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    exposicao?: string;

    @Column({ type: "int", nullable: true })
    extensao?: number;

    @Column({ type: "text", nullable: true })
    conquistadores?: string;

    @Column({ type: "date", nullable: true })
    data?: Date;

    @ManyToOne(() => Montanha)
    @JoinColumn({ name: "mount_id" })
    montanha!: Montanha;

    @ManyToOne(() => Face)
    @JoinColumn({ name: "face_id" })
    face!: Face;

    @ManyToOne(() => Fonte)
    @JoinColumn({ name: "source_id" })
    fonte!: Fonte;

    @ManyToOne(() => Variante)
    @JoinColumn({ name: "variante_id" })
    variante!: Variante;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;


}
