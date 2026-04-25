import { ComingSoon } from "../_components/coming-soon";

export default function CategoriesAdminPage() {
  return (
    <ComingSoon
      title="Kategorie"
      description="CRUD drzewa kategorii nested per gatunek + drag&drop sortowanie + path_cache."
      todo={[
        "Tree view z dnd-kit",
        "Inline edit slug/name/sort_order",
        "Auto-rebuild path_cache po zmianie parent",
        "Rebuild count_cache w item_types",
      ]}
    />
  );
}
