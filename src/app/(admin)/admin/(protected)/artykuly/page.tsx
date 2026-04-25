import { ComingSoon } from "../_components/coming-soon";

export default function ArticlesAdminPage() {
  return (
    <ComingSoon
      title="Artykuły"
      description="CRUD poradników z markdown editorem i live preview."
      todo={[
        "Lista artykułów z filtrem kategorii",
        "Edytor MDX + preview po prawej",
        "Powiązane produkty (multi-select)",
        "SEO: title/description/og_image",
      ]}
    />
  );
}
