import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Montanha } from "./Montanha";  // Assumindo que você já criou a entidade Montanha

@Entity("faces")
export class Face {

    @PrimaryGeneratedColumn({ name: "face_id" })
    faceId!: number;

    @Column({ type: "varchar", length: 255 })
    faces!: string;

    @ManyToOne(() => Montanha)
    @JoinColumn({ name: "mount_id" })
    montanha!: Montanha;
}
