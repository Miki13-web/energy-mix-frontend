import { useEffect, useState } from 'react';
import { getThreeDaysMix, type DailyMixDto } from './api/energyApi';
import { DailyMixChart } from './components/DailyMixChart';
import { OptimalWindowForm } from './components/OptimalWindowForm';

function App() {
  const [mixData, setMixData] = useState<DailyMixDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMix = async () => {
      try {
        const data = await getThreeDaysMix();
        setMixData(data);
      } catch (err) {
        setError('Nie udało się pobrać danych z API. Upewnij się, że backend jest uruchomiony.');
      } finally {
        setLoading(false);
      }
    };
    fetchMix();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '2rem', color: '#333' }}>
      <h1 style={{ textAlign: 'center' }}>Miks Energetyczny Wielkiej Brytanii 🇬🇧</h1>

      {loading && <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Ładowanie danych z serwera...</p>}
      
      {error && <p style={{ textAlign: 'center', color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
          {mixData.map((day) => (
            <DailyMixChart
              key={day.date}
              date={day.date}
              mix={day.mix}
              cleanEnergyPercentage={day.cleanEnergyPercentage}
            />
          ))}
        </div>
      )}

      <OptimalWindowForm />
    </div>
  );
}

export default App;