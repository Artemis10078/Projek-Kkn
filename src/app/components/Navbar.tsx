import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Leaf,
  User,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  Package,
  Heart,
  UserCog,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLang } from "../context/LanguageContext";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  /** true = hero gelap (paksa terang hanya di dark mode). "photo" = banner foto gelap (paksa terang di kedua tema). */
  overDark?: boolean | "photo";
}

const NAV_LINKS = [
  { key: "nav.home", href: "/" },
  { key: "nav.keris", href: "/keris" },
  { key: "nav.panahan", href: "/panahan" },
  { key: "nav.buah", href: "/buah" },
  { key: "nav.tumbuhan", href: "/tumbuhan" },
  { key: "nav.kontak", href: "/#footer" },
];

export function Navbar({
  cartCount,
  onCartClick,
  searchQuery = "",
  onSearchChange,
  overDark = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [popKey, setPopKey] = useState(0);
  const { user, profile, role, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, toggle: toggleLang } = useLang();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setPopKey((k) => k + 1);
  }, [cartCount]);

  const handleSignOut = async () => {
    await signOut();
    setAccountOpen(false);
    navigate("/");
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
    const el = document.getElementById("catalog");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    else navigate("/#catalog");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-soft border-b border-border" : "bg-transparent border-b border-transparent"} ${overDark && !scrolled ? (overDark === "photo" ? "imm-nav-photo" : "imm-nav-dark") : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-grad-leaf flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform">
              <Leaf size={18} className="text-white" />
            </div>
            <span className="font-display text-xl font-semibold gradient-text">
              Martani Park Tour
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-1.5">
                <Search size={15} className="text-muted-foreground" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="bg-transparent outline-none text-sm w-32 sm:w-44 placeholder:text-muted-foreground text-foreground"
                  placeholder={t("nav.searchPlaceholder")}
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    onSearchChange?.("");
                  }}
                >
                  <X
                    size={14}
                    className="text-muted-foreground hover:text-foreground"
                  />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSearchClick}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label={t("aria.search")}
              >
                <Search size={18} className="text-foreground" />
              </button>
            )}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              aria-label={t("aria.lang")}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full hover:bg-secondary transition-colors text-xs font-semibold text-foreground"
            >
              <Globe size={15} className="text-foreground" />{" "}
              {lang.toUpperCase()}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={t("aria.theme")}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-accent" />
              ) : (
                <Moon size={18} className="text-foreground" />
              )}
            </button>

            {/* Account */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-accent/20 transition-colors overflow-hidden"
                  >
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={16} className="text-foreground" />
                    )}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass border border-border rounded-2xl shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm text-foreground truncate">
                          {profile?.full_name || t("nav.user")}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {profile?.email}
                        </p>
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Package size={14} /> {t("nav.orders")}
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <Heart size={14} /> {t("nav.wishlist")}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                      >
                        <UserCog size={14} /> {t("nav.profile")}
                      </Link>
                      {role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          <LayoutDashboard size={14} /> {t("nav.admin")}
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-secondary transition-colors w-full"
                      >
                        <LogOut size={14} /> {t("nav.signout")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-accent/20 transition-colors"
                >
                  <User size={16} className="text-foreground" />
                </Link>
              )}
            </div>

            <button
              onClick={onCartClick}
              className="relative p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label={t("aria.cart")}
            >
              <ShoppingCart size={18} className="text-foreground" />
              {cartCount > 0 && (
                <span
                  key={popKey}
                  className="animate-pop absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-grad-citrus text-white text-[10px] rounded-full flex items-center justify-center leading-none font-bold shadow"
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={t("aria.menu")}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-border px-4 py-4 flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-foreground py-1 hover:text-primary"
            >
              {t(link.key)}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
