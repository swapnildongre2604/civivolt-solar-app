import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function CrudTable({ title, endpoint, columns }) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  const load = () => api.get(endpoint, { params: { search } }).then((r) => setRows(r.data));

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <input className="border rounded p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} onBlur={load} />
      </div>
      <div className="bg-white rounded-xl shadow overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>{columns.map((c) => <th className="p-3 text-left" key={c}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">{columns.map((c) => <td className="p-3" key={c}>{String(r[c] ?? '')}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
