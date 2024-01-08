import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Via } from './Via'; // Certifique-se de importar corretamente a entidade Via

@Entity()
export class Fonte {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @OneToMany(() => Via, (via: Via) => via.id_fonte)
    vias: Via[];

    @Column()
    referencia: string;

    constructor(referencia: string) {
        this.referencia = referencia;
        this.vias = [];
    }

    public getViaById(id: number): Via | undefined {
        return this.vias.find(via => via.id === id);
    }

    public getVias(): Via[] {
        return this.vias;
    }

    public adicionarVia(via: Via): void {
        this.vias.push(via);
    }

    public removerVia(via: Via): void {
        this.vias = this.vias.filter(v => v.id !== via.id);
    }
}
