import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from "typeorm";

@Entity("montanhas")
export class Montanha {

    @PrimaryGeneratedColumn({ name: "mount_id" })
    mountId!: number;

    @Column({ type: "varchar", length: 255 })
    montanhas!: string;

    @Column({ type: "int" })
    altitude!: number;
}
