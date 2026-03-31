import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  ['Dashboard', '/'],
  ['CRM', '/crm'],
  ['ERP', '/erp'],
  ['GST Billing', '/billing'],
  ['Accounts', '/accounts']
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-slate-900 text-white p-4">
        <h1 className="text-lg font-bold">CIVIVOLT Suite</h1>
        <p className="text-xs text-slate-300 mt-1">{user?.role}</p>
        <nav className="mt-6 space-y-2">
          {links.map(([label, to]) => (
            <Link key={to} className="block p-2 rounded hover:bg-slate-800" to={to}>{label}</Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 text-sm bg-red-500 px-3 py-1 rounded">Logout</button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
