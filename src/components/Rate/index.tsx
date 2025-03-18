export interface Rate {
    rate: number;
    ask: number;
    bid: number;
    diff24h: number;
}

export interface RateArrayItem extends Rate {
    currency: string;
}
