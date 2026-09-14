import { Apple } from "lucide-react";
import { ShopShell } from "../components/ShopShell";
import { PageBanner } from "../components/PageBanner";
import { FruitCatalog } from "../components/FruitCatalog";
import { CATEGORIES } from "../../lib/products";
import { useLang } from "../context/LanguageContext";

const BUAH_IMG =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Fruits%20and%20vegetables%20at%20market.jpg?width=1600";

export function BuahPage() {
  const { t } = useLang();
  return (
    <ShopShell navOverDark="photo">
      {({ addToCart, searchQuery, setSearchQuery }) => (
        <main className="imm-root">
          <PageBanner
            icon={Apple}
            eyebrow={t("buah.eyebrow")}
            title={t("buah.title")}
            subtitle={t("buah.subtitle")}
            image={BUAH_IMG}
          />
          <div className="imm-aurora imm-grain relative">
            <FruitCatalog
              onAddToCart={addToCart}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              productType="buah"
              categories={CATEGORIES}
              heading={t("buah.catHeading")}
              eyebrow={t("buah.catEyebrow")}
            />
          </div>
        </main>
      )}
    </ShopShell>
  );
}
