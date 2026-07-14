import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { FuelMixDto } from '../api/energyApi';
import './DailyMixChart.css';

interface Props {
  date: string;
  mix: FuelMixDto[];
  cleanEnergyPercentage: number;
}

const FUEL_COLORS: Record<string, string> = {
  gas: '#c97b63',
  coal: '#52525b',
  nuclear: '#6b8cae',
  wind: '#2d9a6f',
  solar: '#d4a843',
  biomass: '#8a7340',
  hydro: '#3d8fa8',
  imports: '#94a3b8',
  other: '#cbd5e1',
};

const FUEL_LABELS: Record<string, string> = {
  gas: 'Gaz',
  coal: 'Węgiel',
  nuclear: 'Atom',
  wind: 'Wiatr',
  solar: 'Słońce',
  biomass: 'Biomasa',
  hydro: 'Woda',
  imports: 'Import',
  other: 'Inne',
};

const getColor = (fuel: string) => FUEL_COLORS[fuel.toLowerCase()] ?? '#94a3b8';

const getLabel = (fuel: string) => FUEL_LABELS[fuel.toLowerCase()] ?? fuel;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

interface TooltipPayload {
  name?: string;
  value?: number;
  payload?: { fuelLabel?: string };
}

const ChartTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
}) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];
  const label = item.payload?.fuelLabel ?? item.name ?? '';
  const value = item.value;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__label">{label}</div>
      <div className="chart-tooltip__value">{value !== undefined ? `${value}%` : ''}</div>
    </div>
  );
};

export const DailyMixChart = ({ date, mix, cleanEnergyPercentage }: Props) => {
  const chartData = mix
    .filter((entry) => entry.percentage > 0)
    .map((entry) => ({
      ...entry,
      fuelLabel: getLabel(entry.fuel),
    }));

  return (
    <article className="chart-card">
      <header className="chart-card__header">
        <h3 className="chart-card__date">{formatDate(date)}</h3>
        <div className="chart-card__badge">
          <span className="chart-card__badge-dot" aria-hidden="true" />
          Czysta energia: {cleanEnergyPercentage}%
        </div>
      </header>

      <div className="chart-card__chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="fuelLabel"
              cx="50%"
              cy="46%"
              innerRadius={42}
              outerRadius={78}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.fuel)} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend
              className="chart-legend"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ paddingTop: '0.5rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
};
