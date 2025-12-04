

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, Cell, PolarRadiusAxis, PieChart, Pie, Legend, LineChart, Line } from 'recharts';
import { circuits, teams, races, drivers, teams_stands, drivers_stands, race_details } from '../services/formula1Data';
import RedBullCar from './assets/redbull.avif';


import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom'; 
import App from './App'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/f1-dashboard">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

// --- HELPERS ---
const timeToSeconds = (time: string): number => {
    const parts = time.split(':');
    if (parts.length === 3) {
        const [minutes, seconds, milliseconds] = parts.map(Number);
        return minutes * 60 + seconds + milliseconds / 1000;
    }
    return 0;
};

const secondsToTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00.000";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(3);
    return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
};


// --- ASSETS & CONSTANTS ---
const TEAM_ASSETS: { [key: string]: { logo: string; } } = {
    'Mercedes': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/mercedes-logo.png.transform/2col/image.png' },
    'Red Bull': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/red-bull-racing-logo.png.transform/2col/image.png' },
    'Ferrari': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/ferrari-logo.png.transform/2col/image.png' },
    'McLaren': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/mclaren-logo.png.transform/2col/image.png' },
    'Alpine': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alpine-logo.png.transform/2col/image.png' },
    'Alpha Tauri': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alphatauri-logo.png.transform/2col/image.png' },
    'Aston Martin': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/aston-martin-logo.png.transform/2col/image.png' },
    'Williams': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/williams-logo.png.transform/2col/image.png' },
    'Alfa Romeo': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/alfa-romeo-logo.png.transform/2col/image.png' },
    'Haas': { logo: 'https://media.formula1.com/content/dam/fom-website/teams/2023/haas-f1-team-logo.png.transform/2col/image.png' },
};

const DRIVER_ASSETS: { [key: string]: { image: string } } = {
    'Max Verstappen': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/verstappen.jpg.transform/1col/image.jpg' },
    'Sergio Perez': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/perez.jpg.transform/1col/image.jpg' },
    'Lewis Hamilton': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/hamilton.jpg.transform/1col/image.jpg' },
    'Fernando Alonso': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/alonso.jpg.transform/1col/image.jpg' },
    'Charles Leclerc': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/leclerc.jpg.transform/1col/image.jpg' },
    'Lando Norris': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/norris.jpg.transform/1col/image.jpg' },
    'Carlos Sainz': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/sainz.jpg.transform/1col/image.jpg' },
    'George Russell': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/russell.jpg.transform/1col/image.jpg' },
    'Oscar Piastri': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/piastri.jpg.transform/1col/image.jpg' },
    'Lance Stroll': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/stroll.jpg.transform/1col/image.jpg' },
    'Pierre Gasly': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/gasly.jpg.transform/1col/image.jpg' },
    'Esteban Ocon': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/ocon.jpg.transform/1col/image.jpg' },
    'Alexander Albon': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/albon.jpg.transform/1col/image.jpg' },
    'Yuki Tsunoda': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/tsunoda.jpg.transform/1col/image.jpg' },
    'Valtteri Bottas': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/bottas.jpg.transform/1col/image.jpg' },
    'Nico Hulkenberg': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/hulkenberg.jpg.transform/1col/image.jpg' },
    'Daniel Ricciardo': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/ricciardo.jpg.transform/1col/image.jpg' },
    'Guanyu Zhou': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/zhou.jpg.transform/1col/image.jpg' },
    'Kevin Magnussen': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/magnussen.jpg.transform/1col/image.jpg' },
    'Liam Lawson': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/lawson.jpg.transform/1col/image.jpg' },
    'Logan Sargeant': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/sargeant.jpg.transform/1col/image.jpg' },
    'Nyck de Vries': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2023Drivers/devries.jpg.transform/1col/image.jpg' },
    'Sebastian Vettel': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2022Drivers/vettel.jpg.transform/1col/image.jpg' },
    'Mick Schumacher': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2022Drivers/schumacher.jpg.transform/1col/image.jpg' },
    'Nicholas Latifi': { image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/2022Drivers/latifi.jpg.transform/1col/image.jpg' },
};


const ACCENT_COLOR = "#990000"; // Dark Red

const CIRCUIT_IMAGES: { [key: string]: string } = {
    'Albert Park Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit',
    'Autodromo Enzo e Dino Ferrari': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit',
    'Autodromo Hermanos Rodriguez': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit',
    'Autodromo Jose Carlos Pace Interlagos': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit',
    'Autodromo Nazionale di Monza': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit',
    'Bahrain International Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit',
    'Baku City Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Azerbaijan_Circuit',
    'Circuit de Barcelona-Catalunya': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit',
    'Circuit de Monaco': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit',
    'Circuit de Spa - Francorchamps': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit',
    'Circuit Gilles-Villeneuve': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit',
    'Circuit of the Americas': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit',
    'Circuit Zandvoort': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit',
    'Hungaroring': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit',
    'Jeddah Corniche Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit',
    'Las Vegas Street Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit',
    'Losail International Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit',
    'Marina Bay Street Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit',
    'Miami International Autodrome': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit',
    'Red Bull Ring': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit',
    'Silverstone Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit',
    'Suzuka International Racing Course': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit',
    'Yas Marina Circuit': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit',
    'Circuit Paul Ricard': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/France_Circuit',
    'Sochi Autodrom': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Russia_Circuit',
    'Autodromo Internazionale del Mugello': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Tuscany_Circuit'
};

// --- DATA PROCESSING HOOKS ---
const useSeasonData = (season: number) => {

    const wins = useMemo(() => {
        const counts = races.filter(r => r.id_season === season && r.id_driver_win).reduce((acc, r) => {
            acc[r.id_driver_win!] = (acc[r.id_driver_win!] || 0) + 1; return acc; }, {} as Record<number, number>);
        return Object.entries(counts).map(([id, val]) => ({ id: Number(id), name: drivers.find(d => d.id === Number(id))?.name || '', wins: val})).sort((a,b) => b.wins - a.wins);
    }, [season]);
    
    const fastestLaps = useMemo(() => {
        const counts = races.filter(r => r.id_season === season && r.id_driver_fastlap).reduce((acc, r) => {
            acc[r.id_driver_fastlap!] = (acc[r.id_driver_fastlap!] || 0) + 1; return acc; }, {} as Record<number, number>);
        return Object.entries(counts).map(([id, val]) => ({ id: Number(id), name: drivers.find(d => d.id === Number(id))?.name || '', fastestLaps: val})).sort((a,b) => b.fastestLaps - a.fastestLaps);
    }, [season]);

    const podiums = useMemo(() => {
        const seasonRaceIds = new Set(races.filter(r => r.id_season === season).map(r => r.id));
        const counts = race_details.filter(rd => seasonRaceIds.has(rd.id_race) && ['1', '2', '3'].includes(rd.end_pos)).reduce((acc, rd) => {
            acc[rd.id_driver] = (acc[rd.id_driver] || 0) + 1; return acc; }, {} as Record<number, number>);
        return Object.entries(counts).map(([id, val]) => ({ subject: drivers.find(d => d.id === Number(id))?.name || '', podiums: val })).sort((a,b) => b.podiums - a.podiums).slice(0, 5);
    }, [season]);

   

    const driverStandings = useMemo(() => 
        drivers_stands.filter(s => s.id_season === season)
            .sort((a,b) => b.points - a.points)
            .map((s, i) => {
                const driver = drivers.find(d => d.id === s.id_driver);
                const team = teams.find(t => t.id === s.id_driver_team);
                return { 
                    pos: i + 1, 
                    driver: driver?.name || '?', 
                    driverImage: DRIVER_ASSETS[driver?.name || '']?.image || '',
                    team: team?.name || '?', 
                    points: s.points, 
                    teamLogo: TEAM_ASSETS[team?.name || '']?.logo || '' 
                };
            }), 
    [season]);

    const lapTimes = useMemo(() => {
        return races
            .filter(r => r.id_season === season && r.id_driver_win !== null)
            .map(r => {
                const circuit = circuits.find(c => c.id === r.id_circuit);
                if (!circuit) return null;

                const baseTime = timeToSeconds(circuit.wr_time);
                // Simulate average time by adding 2-5% to the world record time to make it realistic
                const avgTime = baseTime * (1 + (Math.random() * 3 + 2) / 100); 
                return {
                    circuit: circuit.city, // Use city for shorter labels
                    "Avg Lap Time": avgTime,
                };
            })
            .filter(Boolean) as { circuit: string; "Avg Lap Time": number }[];
    }, [season]);

    const worldChampion = driverStandings[0];
    
    return { wins, fastestLaps, podiums, driverStandings, worldChampion, lapTimes };
};


// Define Team type based on the teams array structure
type Team = typeof teams[number];

const engineDistribution = teams.reduce((acc, team) => {
    (acc[team.engine] = acc[team.engine] || []).push(team);
    return acc;
}, {} as Record<string, Team[]>);

// --- UI COMPONENTS ---
const DashboardCard: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
    <div className={`bg-[#2a2a2a] rounded-lg shadow-lg p-6 flex flex-col transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl ${className}`}>
        <div className='mb-4'>
            <h2 className="text-xl font-bold text-gray-200">{title}</h2>
            <div className="h-1 mt-2 bg-[#990000] rounded-full"></div>
        </div>
        <div className="flex-grow">{children}</div>
    </div>
);

const WorldChampion: React.FC<{ champion: any, className?: string }> = ({ champion, className }) => (
    <div className={`bg-[#2a2a2a] rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-center justify-between transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl ${className}`}>
        
        <div className="relative flex flex-grow items-center"> 
    
      {/* IMMAGINE DI SFONDO MODIFICATA */}
    <div className="absolute inset-0 z-0 opacity-30 overflow-hidden rounded-lg"> 
        <img 
            src={RedBullCar} 
            alt="Red Bull F1 Car" 
            className="w-full h-full object-cover object-center transform scale-125" 
        />
    </div>
    
    {/* CONTENUTO TESTUALE... */}
    <div className="relative z-10">
                <h2 className="text-xl font-bold text-gray-400 mb-2">{`🏆 ${champion.season} World Champion`}</h2>
                <h3 className="text-5xl font-bold text-gray-100 drop-shadow-lg font-orbitron">{champion.driver}</h3>
                <p className="text-6xl font-extrabold text-white mt-4 font-orbitron">{champion.points} <span className="text-3xl font-semibold text-gray-400">PTS</span></p>
            </div>
        </div>

        {/* LOGO TEAM (POSIZIONAMENTO RELATIVO E SOPRA L'IMMAGINE) */}
        <div className="flex flex-col items-end mt-4 md:mt-0 relative z-10"> 
             <img src={champion.teamLogo} alt={champion.team} className="h-24 object-contain"/>
             <p className="text-3xl text-gray-300 mt-2">{champion.team}</p>
        </div>
    </div>
);

const CircuitDetails: React.FC<{ className?: string }> = ({ className }) => {
    const [selectedCircuitId, setSelectedCircuitId] = useState(circuits[0].id);
    const circuit = circuits.find(c => c.id === selectedCircuitId)!;

    return(
        <DashboardCard title="Circuit Details" className={className}>
            <div className="flex flex-col lg:flex-row gap-6 h-full">
                <div className="lg:w-1/3 flex flex-col">
                     <select value={selectedCircuitId} onChange={e => setSelectedCircuitId(Number(e.target.value))} className="w-full bg-gray-700 text-white rounded p-2 mb-4 appearance-none focus:outline-none focus:ring-2 focus:ring-red-500">
                        {circuits.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <div className='bg-gray-800/50 p-4 rounded-md flex-grow flex flex-col justify-between'>
                        <div>
                            <h3 className="text-2xl font-bold">{circuit.name}</h3>
                            <p className="text-gray-400 mb-4">{circuit.city}, {circuit.country}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-700 p-4 rounded-md text-center">
                                <p className="text-gray-400 text-sm">Laps</p>
                                <p className="text-3xl font-bold">{circuit.laps}</p>
                            </div>
                            <div className="bg-gray-700 p-4 rounded-md text-center">
                                <p className="text-gray-400 text-sm">Length</p>
                                <p className="text-2xl font-bold">{(circuit.length / 1000).toFixed(3)} <span className="text-lg">km</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-2/3 flex items-center justify-center bg-gray-800/50 p-4 rounded-md">
                    <img src={CIRCUIT_IMAGES[circuit.name] || ''} alt={`${circuit.name} layout`} className="w-full h-auto object-contain rounded-md max-h-[250px] lg:max-h-full" />
                </div>
            </div>
        </DashboardCard>
    );
};

const EngineDistribution: React.FC<{ className?: string }> = ({ className }) => (
    <DashboardCard title="Engine Supplier Distribution" className={className}>
        <div className="space-y-4 flex flex-col justify-around h-full">
            {Object.entries(engineDistribution).map(([engine, teamsList]: [string, Team[]]) => (
                <div key={engine}>
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-lg text-gray-300">{engine.replace(' En.', '')}</h4>
                        <p className="text-gray-400 text-sm">{teamsList.length} Teams</p>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                         <div className="bg-gradient-to-r from-red-500 to-red-800 h-2.5 rounded-full" style={{ width: `${(teamsList.length / 10) * 100}%` }}></div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {teamsList.map(team => (
                            <div key={team.id} className="flex items-center bg-gray-700 rounded-full px-3 py-1 text-sm">
                                <img src={TEAM_ASSETS[team.name]?.logo} alt={team.name} className="h-4 w-4 mr-2 object-contain" />
                                <span>{team.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </DashboardCard>
);

const DriverStandings: React.FC<{ standings: any[], className?: string }> = ({ standings, className }) => (
    <DashboardCard title="Driver Standings" className={className}>
        <div className="overflow-y-auto h-[500px]">
            <table className="w-full text-left">
                <thead className='sticky top-0 bg-[#2a2a2a]'>
                    <tr>
                        <th className="p-3 text-sm font-semibold text-gray-400">POS</th>
                        <th className="p-3 text-sm font-semibold text-gray-400">Driver</th>
                        <th className="p-3 text-sm font-semibold text-gray-400">Team</th>
                        <th className="p-3 text-sm font-semibold text-gray-400 text-right">Points</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-800'>
                    {standings.map(s => (
                        <tr key={s.pos} className="hover:bg-gray-800/50">
                            <td className="p-3 font-bold text-gray-300 text-center">{s.pos}</td>
                            <td className="p-3 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <img src={s.driverImage} alt={s.driver} className="h-10 w-10 rounded-full object-cover" />
                                    <span className="font-semibold">{s.driver}</span>
                                </div>
                            </td>
                            <td className="p-3">
                                <img src={s.teamLogo} alt={s.team} className="h-6 w-6 object-contain"/>
                            </td>
                            <td className="p-3 font-bold text-gray-200 text-right">{s.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </DashboardCard>
);

const CustomBarChart: React.FC<{title: string, data: any[], dataKey: string, nameKey?: string, className?: string}> = ({ title, data, dataKey, nameKey = "name", className }) => (
    <DashboardCard title={title} className={className}>
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <defs>
                    <linearGradient id="metallicRed" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#E50000" />
                        <stop offset="100%" stopColor="#800000" />
                    </linearGradient>
                </defs>
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey={nameKey} type="category" stroke="#9ca3af" width={100} interval={0} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#374151' }} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                <Bar dataKey={dataKey} fill="url(#metallicRed)" minPointSize={2} />
            </BarChart>
        </ResponsiveContainer>
    </DashboardCard>
);

const PodiumsChart: React.FC<{ data: any[], className?: string }> = ({ data, className }) => {
    const maxPodiums = useMemo(() => data.reduce((max, p) => p.podiums > max ? p.podiums : max, 0), [data]);
    return (
        <DashboardCard title="Podiums (Top 5)" className={className}>
            <ResponsiveContainer width="100%" height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                     <defs>
                        <linearGradient id="metallicRedFill" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="0%" stopColor="#E50000" stopOpacity={0.8}/>
                             <stop offset="100%" stopColor="#800000" stopOpacity={0.9}/>
                        </linearGradient>
                    </defs>
                    <PolarGrid stroke="#4b5563"/>
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#d1d5db', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, maxPodiums]} tick={false} axisLine={false}/>
                    <Radar name="Podiums" dataKey="podiums" stroke="#FF0000" fill="url(#metallicRedFill)" fillOpacity={1} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}/>
                </RadarChart>
            </ResponsiveContainer>
        </DashboardCard>
    );
};

const LapTimesLineChart: React.FC<{ data: any[], className?: string }> = ({ data, className }) => (
    <DashboardCard title="Average Lap Times by Circuit" className={className}>
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 40 }}>
                <defs>
                    <linearGradient id="metallicRedLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#E50000" />
                        <stop offset="100%" stopColor="#800000" />
                    </linearGradient>
                </defs>
                <XAxis dataKey="circuit" stroke="#9ca3af" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis stroke="#6b7280" domain={['dataMin - 1', 'dataMax + 1']} tickFormatter={(tick) => secondsToTime(tick).split('.')[0]} />
                <Tooltip 
                    cursor={{ stroke: '#6b7280', strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }}
                    formatter={(value: number) => [secondsToTime(value), "Avg Lap Time"]}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{fontSize: '12px'}}/>
                <Line type="monotone" dataKey="Avg Lap Time" stroke="url(#metallicRedLine)" strokeWidth={2.5} dot={{ r: 4, fill: '#E50000', stroke: '#121212' }} activeDot={{ r: 8, stroke: '#fff' }} />
            </LineChart>
        </ResponsiveContainer>
    </DashboardCard>
);


// --- MAIN APP ---
export default function App() {
    const [season, setSeason] = useState(2023);
    const { wins, fastestLaps, podiums, driverStandings, worldChampion, lapTimes } = useSeasonData(season);

    return (
        <div className="min-h-screen bg-[#121212] text-gray-300 p-6">
            <header className="mb-8 flex justify-between items-center">
                {/* Titolo migliorato */}
                <h1 className="text-5xl font-extrabold text-white font-orbitron drop-shadow-[0_2px_2px_rgba(255,0,0,0.7)]">
                    Formula 1
                </h1> 
                
                {/* Selettore di stagione */}
                <select value={season} onChange={e => setSeason(Number(e.target.value))} className="w-48 bg-gray-800 text-white p-2 rounded-lg">
                    <option value={2023}>2023 Season</option>
                    <option value={2022}>2022 Season</option>
                </select>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-6 gap-6">
                {/* Rimuovi il controllo 'worldChampion &&' */}
                   <WorldChampion champion={{...worldChampion, season}} className="lg:col-span-6" /> 
    
                    <CustomBarChart title="Wins" data={wins} dataKey="wins" className="lg:col-span-2" />
                    <LapTimesLineChart data={lapTimes} className="lg:col-span-4" />
    
                    <DriverStandings standings={driverStandings} className="lg:col-span-4" />
    
               

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <CustomBarChart title="Fastest Laps" data={fastestLaps} dataKey="fastestLaps" />
                    <PodiumsChart data={podiums} />
                </div>
                
                <EngineDistribution className="lg:col-span-3" />

                <CircuitDetails className="lg:col-span-3" />
            </main>
        </div>
    );
}
