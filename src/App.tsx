import { useCallback, useEffect, useState } from 'react';
import { getThreeDaysMix, type DailyMixDto } from './api/energyApi';
import { DailyMixChart } from './components/DailyMixChart';
import { OptimalWindowForm } from './components/OptimalWindowForm';
import './App.css';

function App() {
  const [mixData, setMixData] = useState<DailyMixDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMix = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getThreeDaysMix();
      setMixData(data);
    } catch {
      setError(
        'Nie udało się pobrać danych. Backend na Renderze czasem budzi się ok. 30 s — spróbuj ponownie.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMix();
  }, [loadMix]);

  const avgClean =
    mixData.length > 0
      ? Math.round(
          (mixData.reduce((sum, day) => sum + day.cleanEnergyPercentage, 0) / mixData.length) * 10,
        ) / 10
      : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="app-header__mark" aria-hidden="true">
              GB
            </div>
            <div>
              <h1 className="app-header__title">Miks energetyczny Wielkiej Brytanii</h1>
              <p className="app-header__subtitle">
                Udział źródeł energii z ostatnich trzech dni
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="status-panel status-panel--loading" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p className="status-panel__text">Pobieranie danych…</p>
          </div>
        )}

        {error && (
          <div className="alert alert--error" role="alert">
            <svg className="alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="alert__body">
              <span>{error}</span>
              <button type="button" className="alert__retry" onClick={loadMix}>
                Spróbuj ponownie
              </button>
            </div>
          </div>
        )}

        {!loading && !error && mixData.length > 0 && (
          <>
            <div className="summary-bar">
              <p className="section-label">Struktura generacji</p>
              {avgClean !== null && (
                <p className="summary-bar__stat">
                  Średnio <strong>{avgClean}%</strong> czystej energii
                </p>
              )}
            </div>
            <div className="charts-grid">
              {mixData.map((day) => (
                <DailyMixChart
                  key={day.date}
                  date={day.date}
                  mix={day.mix}
                  cleanEnergyPercentage={day.cleanEnergyPercentage}
                />
              ))}
            </div>
          </>
        )}

        <OptimalWindowForm />
      </main>

      <footer className="app-footer">Dane: National Grid ESO · projekt stażowy Sprysoft</footer>
    </div>
  );
}

export default App;
