import { useEffect, useState } from 'react';
import api from '../api/client';

export default function BillingPage() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    api.get('/invoices/summary').then((r) => setSummary(r.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">GST Reports (GSTR-1/GSTR-3B Summary)</h2>
      <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/export/excel`} className="inline-block mb-3 bg-emerald-600 text-white px-4 py-2 rounded">Export Excel</a>
      <div className="bg-white shadow rounded-xl overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3">Month</th><th>Taxable</th><th>GST</th><th>Total</th></tr></thead>
          <tbody>{summary.map((s) => <tr key={s.month} className="border-t"><td className="p-3">{new Date(s.month).toLocaleDateString()}</td><td>{s.taxable}</td><td>{s.gst}</td><td>{s.gross}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
