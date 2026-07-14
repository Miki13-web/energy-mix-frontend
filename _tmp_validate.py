import json
import urllib.request
import datetime
from collections import defaultdict

CLEAN = {"biomass", "nuclear", "hydro", "wind", "solar"}


def fetch_json(url: str):
    with urllib.request.urlopen(url, timeout=120) as response:
        return json.load(response)


mix = fetch_json("https://energymix-api-5v57.onrender.com/api/Energy/mix")
print("Backend mix days:", len(mix))
for day in mix:
    print(day["date"][:10], "clean=", day["cleanEnergyPercentage"])

start = datetime.datetime.fromisoformat(mix[0]["date"].replace("Z", "+00:00"))
from_s = start.strftime("%Y-%m-%dT%H:%M:%SZ")
to_s = (start + datetime.timedelta(days=3)).strftime("%Y-%m-%dT%H:%M:%SZ")
carbon = fetch_json(
    f"https://api.carbonintensity.org.uk/generation?from={from_s}&to={to_s}"
)
intervals = carbon["data"]
print("\nCarbon intervals:", len(intervals))

by_day = defaultdict(list)
for item in intervals:
    day = item["from"][:10]
    fuels = {x["fuel"]: x["perc"] for x in item["generationmix"]}
    clean = sum(fuels.get(f, 0) for f in CLEAN)
    by_day[day].append({"fuels": fuels, "clean": clean})

print("\nValidation for backend days:")
for backend_day in mix:
    day_key = backend_day["date"][:10]
    rows = by_day.get(day_key, [])
    if not rows:
        print(day_key, "NO CARBON DATA")
        continue
    clean_vals = [row["clean"] for row in rows]
    manual_clean = round(sum(clean_vals) / len(clean_vals), 2)
    diff = round(backend_day["cleanEnergyPercentage"] - manual_clean, 2)
    print(
        day_key,
        f"intervals={len(rows)}",
        f"backend={backend_day['cleanEnergyPercentage']}",
        f"manual={manual_clean}",
        f"diff={diff}",
    )

print("\nOptimal window validation (hours=3):")
now = datetime.datetime.now(datetime.timezone.utc).replace(minute=0, second=0, microsecond=0)
from2 = now.strftime("%Y-%m-%dT%H:%M:%SZ")
to2 = (now + datetime.timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%SZ")
forecast = fetch_json(
    f"https://api.carbonintensity.org.uk/generation?from={from2}&to={to2}"
)["data"]
print("Forecast intervals (2 days):", len(forecast))

series = []
for item in forecast:
    fuels = {x["fuel"]: x["perc"] for x in item["generationmix"]}
    clean = sum(fuels.get(f, 0) for f in CLEAN)
    start_t = datetime.datetime.fromisoformat(item["from"].replace("Z", "+00:00"))
    series.append((start_t, clean))

window_slots = 6
best = None
for i in range(0, len(series) - window_slots + 1):
    window = series[i : i + window_slots]
    avg = sum(x[1] for x in window) / len(window)
    if best is None or avg > best[0]:
        best = (avg, window[0][0], window[-1][0])

end = best[2] + datetime.timedelta(minutes=30)
print(
    "Brute force:",
    round(best[0], 2),
    best[1].isoformat().replace("+00:00", "Z"),
    end.isoformat().replace("+00:00", "Z"),
)

opt = fetch_json(
    "https://energymix-api-5v57.onrender.com/api/Energy/optimal-window?hours=3"
)
print("Backend:", opt)

# Check if any cross-day window beats same-day best
print("\nTop 5 windows cross-day check:")
candidates = []
for i in range(0, len(series) - window_slots + 1):
    window = series[i : i + window_slots]
    avg = sum(x[1] for x in window) / len(window)
    start_day = window[0][0].date()
    end_day = (window[-1][0] + datetime.timedelta(minutes=30)).date()
    candidates.append((avg, window[0][0], window[-1][0], start_day != end_day))

for avg, s, e, cross in sorted(candidates, reverse=True)[:5]:
    end_t = e + datetime.timedelta(minutes=30)
    print(
        round(avg, 2),
        s.isoformat().replace("+00:00", "Z"),
        end_t.isoformat().replace("+00:00", "Z"),
        "cross-day" if cross else "same-day",
    )
