'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export function PitchRequestBarChart({ data }) {
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jan', requests: 4, accepted: 2 },
    { month: 'Feb', requests: 7, accepted: 4 },
    { month: 'Mar', requests: 12, accepted: 8 },
    { month: 'Apr', requests: 9, accepted: 6 },
    { month: 'May', requests: 16, accepted: 11 },
    { month: 'Jun', requests: 22, accepted: 17 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#10172A',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="requests" name="Pitch Requests" fill="#536DFE" radius={[4, 4, 0, 0]} />
          <Bar dataKey="accepted" name="Accepted Pitches" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IndustryPieChart({ data }) {
  const defaultData = [
    { name: 'AI & Data', value: 38, color: '#536DFE' },
    { name: 'FinTech', value: 26, color: '#8B5CF6' },
    { name: 'HealthTech', value: 18, color: '#10B981' },
    { name: 'SaaS', value: 18, color: '#F59E0B' },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#536DFE'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#10172A',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-600 mt-2">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MeetingVelocityLineChart({ data }) {
  const defaultData = [
    { week: 'W1', meetings: 2 },
    { week: 'W2', meetings: 5 },
    { week: 'W3', meetings: 8 },
    { week: 'W4', meetings: 12 },
    { week: 'W5', meetings: 10 },
    { week: 'W6', meetings: 16 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#10172A',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="meetings"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

