import CrudTable from './shared/CrudTable';
export default function CRMPage() {
  return <CrudTable title="CRM - Leads" endpoint="/leads" columns={['company_name', 'contact_name', 'status', 'follow_up_date']} />;
}
