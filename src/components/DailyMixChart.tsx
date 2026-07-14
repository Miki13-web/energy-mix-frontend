import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { FuelMixDto } from '../api/energyApi';

interface Props {
  date: string;
  mix: FuelMixDto[];
  cleanEnergyPercentage: number;
}

// Kolory przypisane do konkretnych źródeł energii
const COLORS: Record<string, string> = {
  gas: '#ff9999',
  coal: '#666666',
  nuclear: '#99ccff',
  wind: '#99ff99',
  solar: '#ffff99',
  biomass: '#cc99ff',
  hydro: '#66b3ff',
  imports: '#c2c2d6',
  other: '#e6e6e6'
};

const getColor = (fuel: string) => COLORS[fuel.toLowerCase()] || '#cccccc';

export const DailyMixChart = ({ date, mix, cleanEnergyPercentage }: Props) => {
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <div style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '8px', margin: '1rem', width: '320px', backgroundColor: '#fff' }}>
      <h3 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>{formattedDate}</h3>
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: '#16a34a' }}>
        Czysta energia: {cleanEnergyPercentage}%
      </p>
      
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={mix}
              dataKey="percentage"
              nameKey="fuel"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
            >
              {mix.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.fuel)} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => (value !== undefined && value !== null ? `${value}%` : '')} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};