import { Search, ChefHat, Instagram, Twitter, Facebook, Plus, ChevronDown, Flame, Clock } from "lucide-react";
import MainHeader from "../components/MainHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import MobileHeader from "@/components/MobileHeader";
import RecipeCard from "@/components/RecipeCard";
import RandomRecipeModal from "@/components/RandomRecipeModal";
import { useState, useEffect, useRef } from "react";
import { RecipeService, type RecipeListItem, type RandomRecipeResponse } from "@/api/recipeService";
import { toast } from "sonner";
// Removed legacy logo import
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import AppleScrollFeatures from "@/components/AppleScrollFeatures";
import CinematicText from "../components/CinematicText";
import Magnetic from "../components/Magnetic";

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState<RecipeListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Random recipe modal state
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [randomRecipe, setRandomRecipe] = useState<RandomRecipeResponse | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState(false);
  // Mouse tracking for hero glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  function handleMouseMove({ clientX, clientY, currentTarget }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  useEffect(() => {
    const fetchFeaturedRecipes = async () => {
      try {
        let response;
        try {
          response = await RecipeService.getPopularRecipes(1, 6);
        } catch (error) {
          console.warn('Popular recipes not available, fetching regular recipes');
          response = await RecipeService.getRecipes(1, 6);
        }

        if (response.success && response.data) {
          setFeaturedRecipes(response.data);
        } else {
          setFeaturedRecipes([]);
        }
      } catch (error) {
        console.error('Error fetching featured recipes:', error);
        setFeaturedRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRecipes();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = Math.abs(currentScrollY - lastScrollY);
          if (scrollDiff > 5) {
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
              setIsExpanded(true);
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
              scrollTimeoutRef.current = setTimeout(() => setIsExpanded(false), 4000);
            } else if (currentScrollY < lastScrollY && scrollDiff > 10) {
              setIsExpanded(false);
              if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
            }
            setLastScrollY(currentScrollY);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [lastScrollY]);

  const handleWhatToCook = async () => {
    setIsRandomModalOpen(true);
    await fetchRandomRecipe();
  };

  const fetchRandomRecipe = async () => {
    setIsLoadingRandom(true);
    try {
      const response = await RecipeService.getRandomRecipe();
      if (response.success && response.data) setRandomRecipe(response.data);
      else setRandomRecipe(null);
    } catch (error) {
      setRandomRecipe(null);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleStartCooking = (recipeId: number) => {
    setIsRandomModalOpen(false);
    navigate(`/recipes/${recipeId}`);
  };

  const handleTryAnother = async () => {
    setRandomRecipe(null);
    await fetchRandomRecipe();
  };

  const handleCloseModal = () => {
    setIsRandomModalOpen(false);
    setRandomRecipe(null);
  };

  return (
    <div
      className="relative min-h-screen bg-transparent pb-24 lg:pb-20"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Editorial Depth Layer — Fixed Background Text */}
      <div className="fixed top-20 left-4 pointer-events-none select-none z-0 opacity-[0.03] overflow-hidden whitespace-nowrap">
        <h1 className="text-[25vw] font-black uppercase leading-none tracking-tighter text-white">
          BEING HOME FOODS
        </h1>
      </div>

      <MainHeader />

      {/* Hero Section */}
      <div 
        className="relative h-[85vh] w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Removed Hero Mouse Glow per user feedback */}

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              x: [0, 80, 0], 
              y: [0, 40, 0],
              scale: [1, 1.1, 1]
            }} 
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute top-[15%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] mix-blend-screen"
          />
          <motion.div 
            animate={{ 
              x: [0, -60, 0], 
              y: [0, 80, 0],
              scale: [1, 1.2, 1]
            }} 
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute bottom-[10%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-primary/5 blur-[150px] mix-blend-overlay"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-background/40 to-background z-[1]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 space-y-6 sm:space-y-10 flex flex-col items-center max-w-5xl w-full"
        >
          <div className="flex items-center justify-center gap-6 mb-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Standard Premium</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary"></div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground uppercase tracking-tightest leading-[0.85] mb-8">
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="block"
                >CULINARY</motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span 
                  initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="block text-primary italic"
                >EXCELLENCE</motion.span>
              </span>
            </h1>
          </div>

          <p className="hidden sm:block text-foreground font-black text-[12px] md:text-sm tracking-widest-editorial max-w-xl px-4 leading-relaxed italic opacity-85">
            Pushing boundaries and redefining flavor. <br/> Discover food that challenges the status quo.
          </p>

          <div className="w-full max-w-xl mt-6 md:mt-12 px-6">
            <div className="flex items-center gap-0 rounded-full p-1.5 backdrop-blur-3xl bg-glass border border-glass-border shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                <input
                  placeholder="Search Any Curated Recipe..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="w-full h-10 pl-11 pr-4 bg-transparent text-foreground placeholder:text-foreground/25 text-[10px] sm:text-[11px] font-black uppercase tracking-widest-editorial focus:outline-none"
                />
              </div>
              <Magnetic strength={0.3}>
                <button onClick={handleSearch} className="h-10 px-6 rounded-full bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest-editorial shadow-lg shadow-primary/20">Search</button>
              </Magnetic>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hidden sm:flex">
          <span className="text-white/30 text-[9px] font-black uppercase tracking-widest-editorial">Scroll to discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent animate-bounce-subtle" />
        </motion.div>
      </div>

      <div className="relative z-20">
        <main className="px-4 md:px-8 pt-10 md:pt-16 pb-4 md:pb-6">
          <section className="mb-8 md:mb-16">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-10 px-1">
              <div>
                <p className="text-primary text-[9px] font-black uppercase tracking-widest-editorial mb-2 sm:mb-3">Hand-Picked</p>
                <CinematicText text="Popular Recipes" className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground uppercase tracking-tightest leading-none" />
              </div>
              <Link to="/recipes">
                <Button variant="ghost" size="lg" className="text-primary hover:text-primary/80 uppercase tracking-widest-editorial font-black text-[10px] border border-primary/30 hover:border-primary rounded-full px-5 hidden sm:flex">All Recipes →</Button>
              </Link>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse rounded-3xl bg-white/5 h-64" />)}
              </div>
            ) : featuredRecipes.length > 0 ? (
              <div className="bento-grid">
                {featuredRecipes[0] && (
                  <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="col-span-6">
                    <Link to={`/recipes/${featuredRecipes[0].recipe_id}`}>
                      <div className="relative overflow-hidden rounded-3xl h-72 md:h-[450px] group light-sweep border border-white/5 shadow-2xl">
                        <img src={featuredRecipes[0].image_url || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                          <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase mb-4">Chef's Choice</span>
                          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">{featuredRecipes[0].name}</h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {featuredRecipes.slice(1, 5).map((recipe, i) => (
                  <motion.div 
                    key={recipe.recipe_id} 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                    className={`${i === 0 || i === 1 ? 'col-span-6 md:col-span-3 h-64 md:h-80' : i === 2 ? 'col-span-6 md:col-span-2 h-56 md:h-64' : 'col-span-6 md:col-span-4 h-56 md:h-64'}`}
                  >
                    <Link to={`/recipes/${recipe.recipe_id}`}>
                      <div className="relative overflow-hidden rounded-3xl h-full w-full group light-sweep border border-white/10 shadow-xl">
                        <img src={recipe.image_url || "/placeholder.jpg"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                          <h3 className="text-lg md:text-2xl font-black text-white uppercase leading-tight line-clamp-2">{recipe.name}</h3>
                          <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/5">
                               <Clock className="w-3 h-3 text-primary/70" />
                               <span className="text-white/80 text-[10px] font-black">{recipe.cook_time}M</span>
                             </div>
                             <div className="text-[10px] font-black text-primary/90 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                               View Case →
                             </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </section>
          <AppleScrollFeatures />
        </main>
      </div>


      <RandomRecipeModal
        isOpen={isRandomModalOpen} onClose={handleCloseModal}
        recipe={randomRecipe} isLoading={isLoadingRandom}
        onStartCooking={handleStartCooking} onTryAnother={handleTryAnother}
      />
    </div>
  );
};

export default HomePage;
