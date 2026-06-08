import { Activity, MapPinned, TrendingUp } from "lucide-react";
import indiaLocationMap from "../assets/india-location-map.svg";

const indiaBounds = {
  north: 37.5,
  south: 5,
  west: 67,
  east: 99
};

function cityPoint(city) {
  if (Number.isFinite(city.x) && Number.isFinite(city.y)) {
    return { x: city.x, y: city.y };
  }

  return {
    x: ((city.lng - indiaBounds.west) / (indiaBounds.east - indiaBounds.west)) * 100,
    y: ((indiaBounds.north - city.lat) / (indiaBounds.north - indiaBounds.south)) * 100
  };
}

export default function CityDeepfakeHeatMap({ cities = [] }) {
  const rankedCities = [...cities].sort((a, b) => b.reports - a.reports);
  const maxReports = Math.max(...rankedCities.map((city) => city.reports), 1);
  const totalReports = rankedCities.reduce((sum, city) => sum + city.reports, 0);
  const topCity = rankedCities[0];

  return (
    <section className="glass mb-8 rounded-3xl p-5 lg:p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-wider text-cyan-200">
            <MapPinned size={15} />
            India Threat Map
          </div>
          <h2 className="text-2xl font-black">Deepfake image problem by city</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Brighter and larger zones indicate cities with more detected or reported deepfake image cases.
          </p>
        </div>
        {topCity && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-xs font-black uppercase tracking-wider text-white/45">Highest activity</p>
            <p className="mt-1 text-xl font-black text-red-200">{topCity.city}</p>
            <p className="text-sm font-bold text-white/60">{topCity.reports} reports · {topCity.deepfakeRate}% deepfake rate</p>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <div className="city-heatmap relative min-h-[680px] overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#061016] p-4 sm:p-6">
          <div className="absolute right-5 top-5 z-20 rounded-2xl border border-cyan-300/15 bg-black/30 px-4 py-3 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-wider text-cyan-100/55">Threat Level</p>
            <p className="mt-1 text-2xl font-black text-red-300">High</p>
            <div className="mt-3 flex gap-1">
              {[0, 1, 2, 3, 4].map((item) => (
                <span key={item} className={`h-2 w-9 rounded-full ${item < 4 ? "bg-red-400" : "bg-red-400/25"}`} />
              ))}
            </div>
          </div>

          <div className="india-map-stage absolute left-1/2 top-1/2 aspect-[1500/1615]">
            <img
              src={indiaLocationMap}
              alt="India map"
              className="india-location-map absolute inset-0 h-full w-full object-contain"
            />
            {rankedCities.map((city) => {
              const intensity = city.reports / maxReports;
              const size = 22 + intensity * 54;
              const point = cityPoint(city);
              const isCritical = intensity > 0.78;
              return (
                <div
                  key={city.city}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                >
                  <span
                    className={`absolute left-1/2 top-1/2 rounded-full blur-xl ${isCritical ? "bg-red-500/40" : "bg-amber-400/35"}`}
                    style={{
                      height: `${size * 2.55}px`,
                      width: `${size * 2.55}px`,
                      transform: "translate(-50%, -50%)",
                      opacity: 0.22 + intensity * 0.42
                    }}
                  />
                  <span
                    className={`heat-pulse absolute left-1/2 top-1/2 rounded-full ${isCritical ? "heat-pulse--red" : "heat-pulse--amber"}`}
                    style={{ height: `${size * 2.25}px`, width: `${size * 2.25}px`, transform: "translate(-50%, -50%)" }}
                  />
                  <span
                    className={`case-ring relative block rounded-full ${isCritical ? "case-ring--red" : "case-ring--amber"}`}
                    style={{ height: `${size}px`, width: `${size}px` }}
                  />
                  <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-3 w-44 -translate-x-1/2 rounded-xl border border-white/10 bg-[#12121b]/95 p-3 text-center opacity-0 shadow-2xl transition group-hover:opacity-100">
                    <p className="font-black">{city.city}</p>
                    <p className="text-xs font-semibold text-white/60">{city.state}</p>
                    <p className="mt-2 text-xs font-bold text-red-200">{city.reports} reports · {city.deepfakeRate}% rate</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-bold text-white/65">
              <TrendingUp size={17} className="text-red-200" />
              {totalReports} city reports tracked
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/45">
                Low
                <span className="h-2 w-28 rounded-full bg-gradient-to-r from-amber-200 via-orange-400 to-red-500" />
                High
              </div>
              <span className="text-[11px] font-semibold text-white/35">Map: Wikimedia Commons / Natural Earth</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-white/55">
              <Activity size={15} className="text-cyan-200" />
              Ranked cities
            </h3>
            <span className="rounded-lg bg-red-400/15 px-3 py-1 text-xs font-black text-red-200">Reports</span>
          </div>
          <div className="space-y-3">
            {rankedCities.map((city, index) => {
              const percent = (city.reports / maxReports) * 100;
              return (
                <div key={city.city} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black">{index + 1}. {city.city}</p>
                      <p className="text-xs font-semibold text-white/45">{city.state} · {city.deepfakeRate}% deepfake rate</p>
                    </div>
                    <b className="text-red-200">{city.reports}</b>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-200 via-orange-400 to-red-500" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
