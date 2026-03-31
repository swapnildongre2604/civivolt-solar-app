import CrudTable from './shared/CrudTable';

export default function AccountsPage() {
  return (
    <div className="space-y-8">
      <CrudTable title="Payments" endpoint="/payments" columns={['customer_id', 'invoice_id', 'amount', 'paid_on']} />
      <CrudTable title="Expenses" endpoint="/expenses" columns={['category', 'description', 'amount', 'expense_date']} />
    </div>
  );
}
