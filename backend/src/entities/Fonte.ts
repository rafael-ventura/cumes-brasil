import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@Entity("fontes")
export class Fonte {

    @PrimaryGeneratedColumn({ name: "source_id" })
    sourceId!: number;

    @Column({ type: "text" })
    fontes!: string;
}
