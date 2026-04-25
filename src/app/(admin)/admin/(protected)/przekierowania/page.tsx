import { ComingSoon } from "../_components/coming-soon";

export default function RedirectsAdminPage() {
  return (
    <ComingSoon
      title="Przekierowania"
      description="CRUD na tabeli redirects. Source → destination + status_code (301/302/307/308) + enabled."
      todo={[
        "CRUD listing",
        "Import CSV",
        "Test 'co stanie się z URL X'",
        "Cache w Edge Config / Upstash dla middleware",
      ]}
    />
  );
}
