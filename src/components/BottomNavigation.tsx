import { Home, BookOpen, Video, ChefHat } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeService, type RandomRecipeResponse } from "@/api/recipeService";
import { toast } from "sonner";
import RandomRecipeModal from "@/components/RandomRecipeModal";

const NAV = [
  { icon: Home,     label: "Home",    path: "/" },
  { icon: BookOpen, label: "Recipes", path: "/recipes" },
  { icon: Video,    label: "Shorts",  path: "/profile?tab=shorts" },
];

/* ── Shared style tokens ─────────────────────────────────────────── */
const PILL_BG_DARK  = "rgba(10, 10, 16, 0.88)";
const PILL_BG_LIGHT = "rgba(255,255,255,0.78)";

/* ── WTK gradient (same on both themes — saffron-terracotta) ──── */
const WTK_GRADIENT = "linear-gradient(135deg, hsl(160, 85%, 15%) 0%, hsl(160, 55%, 45%) 100%)";
const WTK_SHADOW   = "0 8px 32px -8px hsla(160, 55%, 45%, 0.5), 0 2px 0 rgba(255,255,255,0.1) inset";

const BottomNavigation = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomRecipe,      setRandomRecipe]      = useState<RandomRecipeResponse | null>(null);
  const [isLoadingRandom,   setIsLoadingRandom]   = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleWhatToCook = async () => {
    setIsRandomModalOpen(true);
    setIsLoadingRandom(true);
    try {
      const response = await RecipeService.getRandomRecipe();
      if (response.success && response.data) setRandomRecipe(response.data);
      else toast.error("Failed to get random recipe");
    } catch { toast.error("Failed to get random recipe. Please try again."); }
    finally  { setIsLoadingRandom(false); }
  };

  /* ── Tab item ────────────────────────────────────────────────── */
  const TabItem = ({ icon: Icon, label, path }: typeof NAV[0]) => {
    const active = isActive(path);
    return (
      <Link
        to={path}
        style={{ textDecoration: "none", flex: 1 }}
      >
        <motion.div
          whileTap={{ scale: 0.88 }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            padding: "10px 4px 8px",
            position: "relative",
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{ color: active ? "var(--wtk-active)" : "var(--wtk-muted)" }}
            transition={{ duration: 0.2 }}
            style={{ lineHeight: 0 }}
          >
            <Icon size={22} strokeWidth={active ? 2.3 : 1.7} />
          </motion.div>

          {/* Label */}
          <span style={{
            fontSize: "8px",
            fontWeight: 900,
            fontFamily: "inherit",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: active ? "var(--wtk-active)" : "var(--wtk-muted)",
            transition: "color 0.2s",
            marginTop: "1px"
          }}>
            {label}
          </span>

          {/* Active dot indicator */}
          <AnimatePresence>
            {active && (
              <motion.div
                key="dot"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0 }}
                style={{
                  position: "absolute",
                  bottom: 2,
                  width: 20,
                  height: 3,
                  borderRadius: 9999,
                  background: "var(--wtk-active)",
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    );
  };

  /* ── WTK pill ────────────────────────────────────────────────── */
  const WTKButton = ({ size = "md" }: { size?: "sm" | "md" }) => {
    const isSm = size === "sm";
    return (
      <motion.button
        onClick={handleWhatToCook}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        animate={{ 
          boxShadow: [
            "0 8px 32px -8px hsla(160, 55%, 45%, 0.4)",
            "0 8px 32px -4px hsla(160, 55%, 45%, 0.6)",
            "0 8px 32px -8px hsla(160, 55%, 45%, 0.4)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: isSm ? 6 : 8,
          padding: isSm ? "10px 18px" : "12px 24px",
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.1)",
          background: WTK_GRADIENT,
          cursor: "pointer",
          color: "#fff",
          fontFamily: "inherit",
          fontWeight: 900,
          fontSize: isSm ? 9 : 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase" as const,
          boxShadow: WTK_SHADOW,
          whiteSpace: "nowrap" as const,
          flexShrink: 0,
          userSelect: "none" as const,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            skewX: -20
          }}
        />
        <ChefHat size={isSm ? 14 : 16} strokeWidth={3} style={{ flexShrink: 0, position: "relative", zIndex: 1 }} />
        <span style={{ position: "relative", zIndex: 1 }}>{isSm ? "WTK" : "WHAT TO COOK"}</span>
      </motion.button>
    );
  };

  return (
    <>
      {/* CSS custom props per theme */}
      <style>{`
        :root {
          --wtk-active: hsl(160, 55%, 45%);
          --wtk-muted:  rgba(255, 255, 255, 0.40);
          --nav-pill-bg: rgba(10, 10, 16, 0.85);
          --nav-pill-border: rgba(255, 255, 255, 0.12);
          --nav-pill-shadow:
            0 30px 60px rgba(0, 0, 0, 0.80),
            0 10px 30px rgba(0, 0, 0, 0.50),
            0 0 0 1px rgba(255, 255, 255, 0.06) inset;
          --nav-pill-blur: 48px;
        }
        .light-theme {
          --wtk-active: hsl(160, 85%, 10%);
          --wtk-muted:  rgba(20, 25, 45, 0.70);
          --nav-pill-bg: rgba(255, 255, 255, 0.90);
          --nav-pill-border: rgba(0, 0, 0, 0.18);
          --nav-pill-shadow:
            0 20px 48px rgba(0, 0, 0, 0.15),
            0 8px 20px rgba(0, 0, 0, 0.10),
            0 1px 0 rgba(255, 255, 255, 1) inset;
          --nav-pill-blur: 40px;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════
          MOBILE NAV (hidden on lg+)
          ═══════════════════════════════════════════════ */}
      <nav
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: "1.25rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "calc(100% - 2rem)",
          maxWidth: "430px",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "var(--nav-pill-bg)",
            backdropFilter: "blur(var(--nav-pill-blur)) saturate(1.8)",
            WebkitBackdropFilter: "blur(var(--nav-pill-blur)) saturate(1.8)",
            border: "1px solid var(--nav-pill-border)",
            borderRadius: "2rem",
            boxShadow: "var(--nav-pill-shadow)",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "4px",
          }}
        >
          {NAV.map(item => <TabItem key={item.path} {...item} />)}

          {/* Subtle vertical divider before WTK */}
          <div style={{
            width: 1,
            height: 28,
            background: "var(--nav-pill-border)",
            flexShrink: 0,
            margin: "0 4px",
          }} />

          {/* WTK pill */}
          <div style={{ padding: "8px 0 8px", flexShrink: 0 }}>
            <WTKButton size="sm" />
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════
          DESKTOP FLOATING DOCK (lg+)
          ═══════════════════════════════════════════════ */}
      <nav
        className="hidden lg:flex"
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            background: "var(--nav-pill-bg)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid var(--nav-pill-border)",
            borderRadius: 9999,
            boxShadow: "var(--nav-pill-shadow)",
            padding: "6px 20px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {NAV.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <Link key={path} to={path} style={{ textDecoration: "none" }}>
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "3px",
                    padding: "8px 18px",
                    borderRadius: 9999,
                    position: "relative",
                    color: active ? "var(--wtk-active)" : "var(--wtk-muted)",
                    transition: "color 0.2s",
                  }}
                >
                  <Icon size={20} strokeWidth={active ? 2.3 : 1.7} />
                  <span style={{
                    fontSize: "11px",
                    fontWeight: active ? 700 : 500,
                    fontFamily: "'Outfit', sans-serif",
                  }}>{label}</span>
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        key="dot-lg"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        style={{
                          position: "absolute",
                          bottom: 2,
                          width: 18,
                          height: 3,
                          borderRadius: 9999,
                          background: "var(--wtk-active)",
                        }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{
            width: 1, height: 28,
            background: "var(--nav-pill-border)",
            margin: "0 8px",
            flexShrink: 0,
          }} />

          <WTKButton size="md" />
        </div>
      </nav>

      <RandomRecipeModal
        isOpen={isRandomModalOpen}
        onClose={() => { setIsRandomModalOpen(false); setRandomRecipe(null); }}
        recipe={randomRecipe}
        isLoading={isLoadingRandom}
        onStartCooking={(id) => { setIsRandomModalOpen(false); navigate(`/recipes/${id}`); }}
        onTryAnother={async () => {
          setRandomRecipe(null);
          setIsLoadingRandom(true);
          try {
            const r = await RecipeService.getRandomRecipe();
            if (r.success && r.data) setRandomRecipe(r.data);
          } catch { toast.error("Failed"); }
          finally  { setIsLoadingRandom(false); }
        }}
      />
    </>
  );
};

export default BottomNavigation;
