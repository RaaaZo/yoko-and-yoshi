import { ComingSoon } from "../_components/coming-soon";

export default function UsersAdminPage() {
  return (
    <ComingSoon
      title="Użytkownicy"
      description="Zaproszenia adminów (przez service-role insert), zmiana ról, reset MFA."
      todo={[
        "Lista profili z rolami",
        "Zaproszenie nowego admina (email + magic link signup)",
        "Reset MFA factors",
        "Zmiana roli (admin/editor/viewer)",
      ]}
    />
  );
}
