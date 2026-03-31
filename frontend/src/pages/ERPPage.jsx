import CrudTable from './shared/CrudTable';

export default function ERPPage() {
  return (
    <div className="space-y-8">
      <CrudTable title="Projects" endpoint="/projects" columns={['title', 'domain', 'status', 'progress_percent']} />
      <CrudTable title="Inventory" endpoint="/inventory" columns={['item_name', 'quantity', 'reorder_level', 'unit_cost']} />
      <CrudTable title="Vendors" endpoint="/vendors" columns={['name', 'service_category', 'phone', 'email']} />
    </div>
  );
}
