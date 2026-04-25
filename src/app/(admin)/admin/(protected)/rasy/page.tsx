import { ComingSoon } from "../_components/coming-soon";

export default function BreedsAdminPage() {
  return (
    <ComingSoon
      title="Rasy"
      description="Hub rasowy — pillar content + quick facts + polecane produkty."
      todo={[
        "Lista ras + nowa rasa",
        "Markdown pillar content z preview",
        "Quick facts editor (key/value)",
        "Powiązane produkty (drag&drop, własna kolejność)",
      ]}
    />
  );
}
