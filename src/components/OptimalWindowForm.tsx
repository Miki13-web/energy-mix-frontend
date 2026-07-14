import { useState } from 'react';
import { getOptimalWindow, type OptimalWindowDto } from '../api/energyApi';

export const OptimalWindowForm = () => {
  const [hours, setHours] = useState<number>(1);
  const [result, setResult] = useState<OptimalWindowDto | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = await getOptimalWindow(hours);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas obliczania okna ładowania.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '2rem auto', padding: '1.5rem', border: '1px solid #93c5fd', borderRadius: '8px', maxWidth: '600px', backgroundColor: '#eff6ff' }}>
      <h2 style={{ marginTop: 0 }}>Wyznacz okno ładowania ⚡</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>
          Czas ładowania (1-6h):
          <input
            type="number"
            min="1"
            max="6"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            style={{ marginLeft: '0.5rem', padding: '0.5rem', width: '60px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </label>
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.5rem 1.5rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {loading ? 'Szukam...' : 'Oblicz'}
        </button>
      </form>

      {error && <p style={{ color: '#dc2626', fontWeight: 'bold' }}>{error}</p>}

      {result && (
        <div style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
          <p><strong>Rozpoczęcie:</strong> {new Date(result.startTime).toLocaleString()}</p>
          <p><strong>Zakończenie:</strong> {new Date(result.endTime).toLocaleString()}</p>
          <p style={{ color: '#16a34a', fontWeight: 'bold' }}>
            Średni udział czystej energii: {result.cleanEnergyPercentage}%
          </p>
        </div>
      )}
    </div>
  );
};