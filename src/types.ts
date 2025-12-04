
export interface Season {
    year: number;
}

export interface Team {
    id: number;
    name: string;
    country: string;
    engine: string;
}

export interface Driver {
    id: number;
    name: string;
    board_name: string;
    number: string;
    country: string;
    date_born: string;
}

export interface Circuit {
    id: number;
    name: string;
    city: string;
    country: string;
    laps: number;
    length: number;
    wr_time: string;
}

export interface TeamStand {
    id: number;
    id_season: number;
    id_team: number;
    points: number;
}

export interface DriverStand {
    id: number;
    id_season: number;
    id_driver: number;
    id_driver_team: number;
    points: number;
}

export interface Race {
    id: number;
    id_season: number;
    id_circuit: number;
    date_race: string;
    id_driver_win: number | null;
    id_driver_pole: number | null;
    id_driver_fastlap: number | null;
}

export interface RaceDetail {
    id_race: number;
    id_driver: number;
    id_driver_team: number;
    start_pos: string;
    end_pos: string;
}
