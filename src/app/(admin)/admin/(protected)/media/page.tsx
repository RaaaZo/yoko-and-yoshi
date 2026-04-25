import { ComingSoon } from "../_components/coming-soon";

export default function MediaLibraryPage() {
  return (
    <ComingSoon
      title="Media library"
      description="Upload + galeria + alt text + auto-konwersja WebP/AVIF + blurDataURL."
      todo={[
        "Upload multi przez Server Action + sharp",
        "Storage buckets: product-images, article-images, brand-logos",
        "Grid + lazy load + search po alt/nazwie",
        "Edycja alt text inline (wymagany)",
      ]}
    />
  );
}
