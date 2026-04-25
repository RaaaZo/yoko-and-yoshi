import { ComingSoon } from "../_components/coming-soon";

export default function HomepageAdminPage() {
  return (
    <ComingSoon
      title="Homepage"
      description="Drag&drop sekcji homepage (hero, item_types_grid, featured_products, shiba_callout, articles, newsletter, custom_html)."
      todo={[
        "Lista sekcji w kolejności (dnd-kit sortable)",
        "Per-section config form (różny per kind)",
        "Live preview w iframe",
        "Toggle published",
      ]}
    />
  );
}
