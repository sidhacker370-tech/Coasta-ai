import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';

/**
 * RiskFactorChart renders a horizontal bar chart of individual geomorphic risk drivers
 * using Recharts with custom styling and tooltips.
 */
export default function RiskFactorChart({ factors = [] }) {
  if (!factors || factors.length === 0) {
    return <div className="text-xs text-slate-500 font-mono py-2">No factor data available.</div>;
  }

  const getBarColor = (score) => {
    if (score >= 85) return '#ef4444'; // CRITICAL
    if (score >= 70) return '#f97316'; // HIGH
    if (score >= 40) return '#eab308'; // MODERATE
    return '#22c55e'; // LOW
  };

  const formattedData = factors.map(f => ({
    name: f.name,
    score: f.score,
    weight: f.weight,
    description: f.description,
    fillColor: getBarColor(f.score)
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-xl text-xs font-mono max-w-xs">
          <div className="font-bold text-slate-100">{d.name}</div>
          <div className="text-cyan-400 font-semibold mt-0.5">
            Hazard Score: {d.score}/100 <span className="text-slate-400 font-normal">(Weight: {(d.weight * 100).toFixed(0)}%)</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 border-t border-slate-800 pt-1 leading-tight">
            {d.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-44 font-mono text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={{ stroke: '#334155' }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fill: '#cbd5e1', fontSize: 10 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={12}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fillColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
