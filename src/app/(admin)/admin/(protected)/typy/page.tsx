import { ComingSoon } from "../_components/coming-soon";

export default function ItemTypesAdminPage() {
  return (
    <ComingSoon
      title="Typy produktów"
      description="Zarządzanie 12 typami przedmiotów (Szarpaki, Piłki, …) z homepage."
      todo={[
        "CRUD: slug, name, icon_emoji, soft_color_token, sort_order",
        "Drag&drop kolejności (dnd-kit)",
        "Rebuild count_cache",
      ]}
    />
  );
}
