# Energy Mix UK - Frontend

Aplikacja kliencka stworzona w ramach zadania rekrutacyjnego. Służy do wizualizacji prognozowanego miksu energetycznego Wielkiej Brytanii oraz obliczania optymalnego okna czasowego do ładowania samochodu elektrycznego.

## Funkcjonalności

- Wyświetlanie wykresów kołowych miksu energetycznego dla trzech najbliższych dni.
- Prezentacja udziału poszczególnych źródeł energii oraz procentu energii czystej.
- Formularz wyboru czasu ładowania (1–6 godzin) z wyznaczeniem optymalnego okna.
- Obsługa stanów ładowania, błędów API oraz ponownego pobrania danych.

## Technologie

- **React** + **TypeScript**
- **Vite** (bundler)
- **Recharts** (wykresy kołowe)
- **Axios** (klient HTTP)
- **Docker** (przygotowane pod deployment na środowisko produkcyjne)

## Uruchomienie lokalne

Do uruchomienia projektu wymagane jest środowisko **Node.js** (zalecana wersja 20+).

### 1. Pobierz zależności

```bash
npm install
```

### 2. Uruchom serwer deweloperski

```bash
npm run dev
```

Aplikacja będzie domyślnie dostępna pod adresem:

```
http://localhost:5173
```

### 3. Konfiguracja API (opcjonalnie)

Domyślnie frontend korzysta z wdrożonego backendu na Renderze. Aby podpiąć lokalny backend, utwórz plik `.env.local`:

```bash
VITE_API_URL=http://localhost:5194/api/Energy
```

Adres API jest konfigurowany w pliku `src/api/energyApi.ts`.

**Ważne:** Aby interfejs pobierał dane z lokalnego backendu, niezbędne jest jednoczesne uruchomienie projektu backendowego.

## Build produkcyjny

```bash
npm run build
```

Podgląd zbudowanej wersji:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Docker

Zbudowanie obrazu:

```bash
docker build -t energymix-frontend .
```

Uruchomienie kontenera:

```bash
docker run -p 8080:80 energymix-frontend
```

Aplikacja będzie dostępna pod adresem:

```
http://localhost:8080
```

## Linki

- Kod backendu: https://github.com/Miki13-web/EnergyMix.api
- Backend (Render): https://energymix-api-5v57.onrender.com/api/Energy
- Działająca aplikacja (Render): https://energy-mix-frontend-5379.onrender.com
