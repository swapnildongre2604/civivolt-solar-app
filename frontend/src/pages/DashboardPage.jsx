import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/client';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/dashboard').then((r) => setData(r.data));
  }, []);

  if (!data) return <p>Loading dashboard...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Stat label="Won Deals" value={data.wonDeals} />
        <Stat label="Revenue" value={`₹${data.revenue}`} />
        <Stat label="Expenses" value={`₹${data.expenses}`} />
        <Stat label="Profit" value={`₹${data.profit}`} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.projectStatus}>
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0f172a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
