import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Eye, Clock } from "lucide-react";
import StarRating from "./StarRating";
import FavoriteHeartButton from "./ui/FavoriteHeartButton";
import EnhancedImage from "./EnhancedImage";
import { logImageAnalysis } from "@/utils/imageDebugger";
import { motion } from "framer-motion";

interface RecipeCardProps {
  // Support both old and new API formats
  id?: string;
  recipe_id?: number;
  title?: string;
  name?: string;
  image?: string;
  image_url?: string;
  rating: number;
  category?: string;
  categories?: string[] | string | null;
  cook_time?: number;
  views?: number;
  is_popular?: boolean;
}

const RecipeCard = ({
  id,
  recipe_id,
  title,
  name,
  image,
  image_url,
  rating,
  category,
  categories,
  cook_time,
  views,
  is_popular
}: RecipeCardProps) => {
  // Use new API format if available, fallback to old format
  const recipeId = recipe_id?.toString() || id || '';
  const recipeName = name || title || '';

  // Determine the image URL, filtering out empty strings
  const recipeImage = (image_url && image_url.trim() !== '') ? image_url :
                      (image && image.trim() !== '') ? image :
                      '';

  // Debug: Analyze the image URL only if it exists
  if (recipeImage) {
    logImageAnalysis(recipeImage, `RecipeCard #${recipeId} - ${recipeName}`);
  } else {
    console.warn(`⚠️ RecipeCard #${recipeId} - ${recipeName}: No image URL provided, will use fallback`);
  }

  const viewCount = views || 0;

  // Determine which categories to display
  const displayCategories = Array.isArray(categories)
    ? categories
    : (typeof categories === 'string' && categories.length > 0)
    ? categories.split(',').map(c => c.trim())
    : category
    ? [category]
    : [];

  return (
    <Link to={`/recipes/${recipeId}`} className="block h-full group">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[3rem] h-[520px] group hover-depth glass-card-premium"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-black/20 dark:to-white/5 z-0" />
        
        <div className="relative h-[65%] overflow-hidden">
          <EnhancedImage
            src={recipeImage}
            alt={recipeName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            fallbackSrc="https://placehold.co/400x300/1a1a1a/ffffff?text=Recipe"
            aspectRatio="video"
            showLoadingSpinner={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <div className="absolute top-6 right-6 z-30">
            <FavoriteHeartButton recipeId={recipeId} />
          </div>
          {is_popular && (
            <div className="absolute top-6 left-6 bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl z-30">
              Elite
            </div>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-10 z-20">
          <div className="space-y-6">
            <h3 className="font-black text-3xl text-foreground uppercase tracking-tighter leading-none group-hover:text-primary transition-colors duration-500">
              {recipeName}
            </h3>
            
            <div className="flex items-center justify-between pt-6 border-t border-glass-border">
              <div className="flex items-center gap-4">
                 {cook_time && (
                   <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                     <Clock className="w-4 h-4 text-primary" />
                     <span className="text-foreground text-[11px] font-black">{cook_time}M</span>
                   </div>
                 )}
                 <div className="flex items-center gap-1.5 text-[11px] font-black text-foreground uppercase tracking-widest bg-foreground/5 px-4 py-2 rounded-full border border-glass-border backdrop-blur-3xl">
                   <Eye className="w-4 h-4 text-primary" />
                   {viewCount}
                 </div>
              </div>
              
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                 VIEW →
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-primary/5 pointer-events-none z-10" />
      </motion.div>
    </Link>
  );
};

export default RecipeCard;