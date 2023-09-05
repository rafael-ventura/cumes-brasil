import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Fonte } from "./Fonte";  // Assumindo que você já criou a entidade Fonte

@Entity("variantes")
export class Variante {

    @PrimaryGeneratedColumn({ name: "variante_id" })
    varianteId!: number;

    @Column({ type: "varchar", length: 255 })
    vias!: string;

    @Column({ type: "float" })
    grau!: number;

    @Column({ type: "varchar", length: 50 })
    crux!: string;

    @Column({ type: "varchar", length: 50 })
    aid!: string;

    @Column({ type: "varchar", length: 50 })
    duracao!: string;

    @Column({ type: "varchar", length: 50 })
    exposicao!: string;

    @Column({ type: "int" })
    extensao!: number;

    @Column({ type: "text" })
    conquistadores!: string;

    @Column({ type: "date" })
    data!: Date;

    @ManyToOne(() => Fonte)
    @JoinColumn({ name: "source_id" })
    fonte!: Fonte;
}
