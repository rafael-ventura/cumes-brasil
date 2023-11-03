export interface IMontanha {
    id?: string | null;
    name?: string | null;
    location?: string | null; // Pode ser mais detalhado com latitude e longitude
}

export class Montanha implements IMontanha {
    id?: string | null;
    name?: string | null;
    location?: string | null; // Pode ser mais detalhado com latitude e longitude
    constructor(name: string, location: string) {}
}

