import { motion } from "framer-motion";
import { Heart, Loader2, Search, ChefHat, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainHeader from "../components/MainHeader";
import RecipeCard from "@/components/RecipeCard";
import { Link } from "react-router-dom";
import InfoIconButton from "../components/ui/InfoIconButton";
import { useState, useEffect } from "react";
import { FavoritesService, type FavoriteItem } from "@/api/favoritesService";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

const FavoritesPage = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await FavoritesService.getFavorites();

      if (response.success) {
        // Handle successful response - data can be null for empty favorites
        if (response.data && Array.isArray(response.data)) {
          setFavoriteRecipes(response.data);
        } else {
          // Empty favorites (data is null or empty array)
          setFavoriteRecipes([]);
        }
      } else {
        // Only set error for actual API failures
        setError(response.message || "Failed to load favorites");
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError("Failed to load favorites. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-32">
      <MainHeader />
      
      {/* Editorial Title Section */}
      <section className="px-6 md:px-12 pt-16 mb-16">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <div className="h-[1px] w-8 bg-primary/60"></div>
              <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Personal Collection</span>
           </div>
           <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground uppercase tracking-tightest leading-[0.85]"
              >
                THE <span className="text-primary italic">VAULT</span>
              </motion.h1>
           </div>
        </div>
      </section>

      <main className="px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <img src="/beinghomelogo.jpeg" alt="BeingHomeFoods" className="w-10 h-10 rounded-full object-cover border-2 border-primary/50" />
            <span className="ml-2 text-muted-foreground">Loading favorites...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Error loading favorites</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchFavorites} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Try Again
            </Button>
          </div>
        ) : favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteRecipes.map((favoriteItem) => (
              <RecipeCard
                key={favoriteItem.recipe_id}
                recipe_id={favoriteItem.recipe_id}
                name={favoriteItem.recipe.name}
                image_url={favoriteItem.recipe.image_url}
                rating={favoriteItem.recipe.rating}
                cook_time={favoriteItem.recipe.cook_time}
                views={favoriteItem.recipe.views}
                is_popular={favoriteItem.recipe.is_popular}
              />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-32 text-center glass-card-premium rounded-[3rem] p-12 max-w-4xl mx-auto shadow-3xl">
            <div className="w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse" />
                <Heart className="w-10 h-10 text-primary relative z-10" fill="currentColor" />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tightest mb-4 leading-none">THE VAULT <br/> IS VACANT</h3>
            <p className="text-foreground font-black max-w-sm italic mb-10 opacity-75 text-xs sm:text-sm">Your personal library of culinary masterpieces is currently empty. Begin your discovery to populate the vault.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
              <Link to="/recipes">
                <Button className="w-full bg-primary text-primary-foreground h-12 rounded-2xl font-black uppercase tracking-widest-editorial text-[9px] shadow-2xl hover-depth">Discover Now</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full h-12 rounded-2xl border-foreground/10 bg-glass font-black uppercase tracking-widest-editorial text-[9px] hover:bg-foreground/5">Return Home</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
    </div>
  );
};

export default FavoritesPage;