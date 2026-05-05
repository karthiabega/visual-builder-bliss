import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
           className="glass-card-premium rounded-[3rem] p-12 md:p-24 shadow-3xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-[1px] w-6 bg-rose-500/40"></div>
              <span className="text-rose-500 text-[9px] font-black uppercase tracking-widest-editorial">Lost in Navigation</span>
              <div className="h-[1px] w-6 bg-rose-500/40"></div>
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-foreground uppercase tracking-tightest leading-none mb-4 opacity-5 select-none">
            404
          </h1>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6">
              <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tightest mb-6">
                ROUTE <span className="text-primary italic">EXPUNGED</span>
              </h2>
              <p className="text-foreground font-black italic max-w-sm mx-auto mb-12 opacity-60 text-xs sm:text-sm">
                The culinary coordinates for <code className="text-primary font-black not-italic opacity-100">"{location.pathname}"</code> do not exist in our secure archive.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/">
                  <Button className="bg-primary text-primary-foreground h-12 px-8 rounded-2xl font-black uppercase tracking-widest-editorial text-[9px] shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                    <Home size={14} />
                    Return Home
                  </Button>
                </Link>
                <Link to="/recipes">
                  <Button variant="outline" className="h-12 px-8 rounded-2xl border-foreground/10 bg-glass font-black uppercase tracking-widest-editorial text-[9px] hover:bg-foreground/5 transition-all">
                    <Compass size={14} />
                    Discovery
                  </Button>
                </Link>
              </div>
          </div>
        </motion.div>

        <div className="mt-12">
            <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground/20 italic">
              Verified Static Node: Global Edge Cache
            </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
