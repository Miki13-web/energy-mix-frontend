import { useState } from 'react';
import { getOptimalWindow, type OptimalWindowDto } from '../api/energyApi';
import './OptimalWindowForm.css';

const HOUR_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const isValidHours = (value: number) => Number.isInteger(value) && value >= 1 && value <= 6;

export const OptimalWindowForm = () => {
  const [hours, setHours] = useState(3);
  const [result, setResult] = useState<OptimalWindowDto | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidHours(hours)) {
      setError('Podaj liczbę godzin od 1 do 6.');
      setResult(null);
      return;
    }

    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await getOptimalWindow(hours);
      setResult(data);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        'Nie udało się obliczyć okna. Sprawdź, czy backend odpowiada.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="optimal-section" aria-labelledby="optimal-title">
      <header className="optimal-section__header">
        <h2 id="optimal-title" className="optimal-section__title">
          Kiedy ładować?
        </h2>
        <p className="optimal-section__desc">
          Wybierz długość sesji ładowania — aplikacja znajdzie przedział z największym udziałem
          energii czystej.
        </p>
      </header>

      <form className="optimal-form" onSubmit={handleSubmit}>
        <fieldset className="optimal-form__hours">
          <legend className="optimal-form__label">Czas ładowania</legend>
          <div className="hour-picker" role="group" aria-label="Liczba godzin">
            {HOUR_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                className={`hour-picker__btn${hours === value ? ' hour-picker__btn--active' : ''}`}
                aria-pressed={hours === value}
                onClick={() => setHours(value)}
              >
                {value}h
              </button>
            ))}
          </div>
        </fieldset>

        <button type="submit" className="optimal-form__submit" disabled={loading}>
          {loading ? 'Szukam…' : 'Oblicz'}
        </button>
      </form>

      {error && (
        <p className="optimal-error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="optimal-result">
          <div className="optimal-result__grid">
            <div className="optimal-result__row">
              <span className="optimal-result__key">Start</span>
              <span className="optimal-result__value">{formatDateTime(result.startTime)}</span>
            </div>
            <div className="optimal-result__row">
              <span className="optimal-result__key">Koniec</span>
              <span className="optimal-result__value">{formatDateTime(result.endTime)}</span>
            </div>
          </div>
          <div className="optimal-result__highlight">
            <span className="optimal-result__highlight-label">Średni udział czystej energii</span>
            <span className="optimal-result__highlight-value">{result.cleanEnergyPercentage}%</span>
          </div>
        </div>
      )}
    </section>
  );
};
