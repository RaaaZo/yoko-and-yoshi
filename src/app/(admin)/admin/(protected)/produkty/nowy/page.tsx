import { ProductForm } from "../[id]/product-form";

import { Badge } from "@/components/ui/badge";

export default function NewProductPage() {
  return (
    <div>
      <Badge tone="cyan">Nowy produkt</Badge>
      <h1 className="mt-2 mb-6">Dodaj produkt</h1>
      <ProductForm />
    </div>
  );
}
