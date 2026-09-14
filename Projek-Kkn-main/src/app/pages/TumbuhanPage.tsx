import { Sprout } from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { FruitCatalog } from "../components/FruitCatalog";
import { PLANT_CATEGORIES } from "../../lib/products";
import { useLang } from "../context/LanguageContext";

const TUMBUHAN_IMG =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Plant%20nursery%2C%20pot%20rows.jpg?width=1600";

export function TumbuhanPage() {
  const { t } = useLang();
  return (
    <ShopShell navOverDark="photo">
      {({ addToCart, searchQuery, setSearchQuery }) => (
        <main className="imm-root">
          <PageBanner
            icon={Sprout}
            eyebrow={t("tumbuhan.eyebrow")}
            title={t("tumbuhan.title")}
            subtitle={t("tumbuhan.subtitle")}
            image={TUMBUHAN_IMG}
          />
          <div className="imm-aurora imm-grain relative">
            <FruitCatalog
              onAddToCart={addToCart}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              productType="tumbuhan"
              categories={PLANT_CATEGORIES}
              heading={t("tumbuhan.catHeading")}
              eyebrow={t("tumbuhan.catEyebrow")}
            />
          </div>
        </main>
      )}
    </ShopShell>
  );
}
