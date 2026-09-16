"use client";

export default function MetricScoreCard() {
  return (
    <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-brown-700 uppercase tracking-wider">
          Zyba Score
        </span>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-500">
          Kondisi Baik
        </span>
      </div>

      <div className="my-6 flex items-center justify-center relative">
        <svg className="w-36 h-36 transform -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#FCE3D3"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="#8FAE5D"
            strokeWidth="12"
            strokeDasharray={377}
            strokeDashoffset={377 * (1 - 0.8)}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-display text-4xl font-extrabold text-brown-900">
            80
          </span>
          <span className="text-[10px] text-brown-700 font-semibold uppercase tracking-wider">
            out of 100
          </span>
        </div>
      </div>

      <p className="text-xs text-brown-700 text-center">
        Skor kesejahteraan mental dan fisik gabungan berdasarkan aktivitas harianmu.
      </p>
    </div>
  );
}
