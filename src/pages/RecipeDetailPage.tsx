import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Clock, Users, Youtube, Share2, Eye, Plus, Minus, AlertTriangle, Loader2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StarRating from "@/components/StarRating";
import MobileHeader from "@/components/MobileHeader";
import FavoriteHeartButton from "@/components/ui/FavoriteHeartButton";
import RatingInput from "@/components/RatingInput";
import RatingDisplay from "@/components/RatingDisplay";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { RecipeService, type Recipe } from "@/api/recipeService";
import { toast } from "sonner";
import { logImageAnalysis, normalizeImageUrl } from "@/utils/imageDebugger";
import EnhancedImage from "@/components/EnhancedImage";
import ImageViewer from "@/components/ImageViewer";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentServings, setCurrentServings] = useState(1);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [issueDescription, setIssueDescription] = useState("");
  const [ratingRefreshTrigger, setRatingRefreshTrigger] = useState(0);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);  // parallax
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  // Helper function to convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        navigate('/recipes');
        return;
      }

      try {
        setIsLoading(true);
        const recipeId = parseInt(id, 10);
        if (isNaN(recipeId)) {
          toast.error("Invalid recipe ID");
          navigate('/recipes');
          return;
        }
        const response = await RecipeService.getRecipeById(recipeId);

        if (!response.success || !response.data) {
          toast.error("Recipe not found");
          navigate('/recipes');
          return;
        }

        // Debug: Analyze the recipe image
        logImageAnalysis(response.data.image_url, `Recipe #${response.data.recipe_id} - ${response.data.name}`);

        setRecipe(response.data);
        setCurrentServings(response.data.servings);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        toast.error("Failed to load recipe");
        navigate('/recipes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe?.name || "Recipe",
          url,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const adjustServings = (newServings: number) => {
    if (newServings >= 1 && newServings <= 100) {
      setCurrentServings(newServings);
    }
  };

  const getScaledQuantity = (originalQuantity: number, originalServings: number) => {
    if (originalQuantity === 0) return 0;
    return (originalQuantity * currentServings) / originalServings;
  };

  const formatQuantity = (quantity: number, unit: string) => {
    if (quantity === 0) return "";
    if (quantity % 1 === 0) {
      return `${quantity} ${unit}`;
    } else {
      return `${quantity.toFixed(1)} ${unit}`;
    }
  };

  const handleReportSubmit = () => {
    if (issueDescription.trim() && recipe) {
      // In a real app, this would send the report to your backend
      console.log("Report submitted:", {
        recipeId: recipe.recipe_id,
        recipeTitle: recipe.name,
        category: recipe.categories?.[0],
        issueDescription,
        timestamp: new Date().toISOString()
      });
      
      // Show success message
      alert("Thank you for your feedback! Your issue has been reported.");
      
      // Reset form and close dialog
      setIssueDescription("");
      setIsReportDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground mb-4">Recipe not found</p>
          <Link to="/recipes">
            <Button>Back to Recipes</Button>
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-transparent pb-20 md:pb-6 pt-14 lg:pt-0">
      {/* Mobile Sticky Header */}
      <MobileHeader />
      
      {/* Hero image with Apple-style parallax — moves up as you scroll */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ height: '56vw', maxHeight: 420 }}>
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <EnhancedImage
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-full object-cover cursor-pointer"
            fallbackSrc="https://placehold.co/800x400/e2e8f0/64748b?text=Recipe+Image"
            onClick={() => setIsImageViewerOpen(true)}
            showLoadingSpinner={true}
            aspectRatio="video"
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>
        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Link to="/recipes">
            <Button variant="secondary" size="sm" className="bg-black/40 backdrop-blur-md text-white border-white/20 hover:bg-black/60">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <FavoriteHeartButton recipeId={recipe.recipe_id.toString()} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="absolute bottom-4 left-4 right-4 z-10"
        >
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-xl uppercase tracking-tightest">{recipe.name}</h1>
        </motion.div>
      </div>

      <main className="px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex flex-wrap gap-2">
              {recipe.categories && recipe.categories.length > 0 ? (
                recipe.categories.map((category, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-widest text-[9px]">{category}</Badge>
                ))
              ) : (
                <Badge variant="secondary" className="bg-foreground/5 border border-foreground/10 text-foreground/40 font-black uppercase tracking-widest text-[9px]">Uncategorized</Badge>
              )}
            </div>
          </div>

          <div className="mb-3">
            <p className="text-xs text-muted-foreground font-black uppercase tracking-widest italic leading-none">
              Archived by <span className="text-foreground opacity-100 underline decoration-primary/30 decoration-2 underline-offset-2">{recipe.owner_name}</span>
            </p>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center gap-4">
              <StarRating rating={recipe.rating || 0} showNumber />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="w-4 h-4" />
                {recipe.views || 0} views
              </div>
              {recipe.difficulty && (
                <Badge variant="outline" className="gap-1">
                  <ChefHat className="w-3 h-3" />
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.cook_time} min
            </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustServings(currentServings - 1)}
                    disabled={currentServings <= 1}
                    className="h-7 w-7 p-0 rounded-full border-glass-border hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Minus className="w-3 h-3" strokeWidth={3} />
                  </Button>
                  <span className="min-w-[40px] text-center text-sm font-black text-foreground">{currentServings}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adjustServings(currentServings + 1)}
                    disabled={currentServings >= 100}
                    className="h-7 w-7 p-0 rounded-full border-glass-border hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Plus className="w-3 h-3" strokeWidth={3} />
                  </Button>
                </div>
              </div>
            <button
              onClick={handleShare}
              className="p-1 rounded hover:bg-accent transition flex items-center gap-1"
              title="Share recipe"
              type="button"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </motion.div>

        <div className="bg-glass border border-glass-border rounded-xl p-6 mb-8 shadow-3xl backdrop-blur-3xl flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 leading-none">Culinary DNA</p>
                <div className="flex items-center gap-4">
                   <span className="text-xl font-black text-foreground uppercase tracking-tightest leading-none">{recipe.calories} <span className="text-[10px] opacity-40 font-black tracking-widest italic uppercase ml-1">KCal</span></span>
                   <div className="h-4 w-[1px] bg-foreground/10" />
                   <span className="text-xl font-black text-foreground uppercase tracking-tightest leading-none">{recipe.cuisine || "Heritage"} <span className="text-[10px] opacity-40 font-black tracking-widest italic uppercase ml-1">Context</span></span>
                </div>
             </div>
          </div>
        </div>

        {recipe.youtube_url && getEmbedUrl(recipe.youtube_url) && (
          <>
            {/* Mobile YouTube Video - Keep current implementation */}
            <div className="mb-6 md:hidden">
              <div className="bg-card rounded-lg p-4 shadow-card">
                <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-primary" />
                  Video Tutorial
                </h3>
                <div className="aspect-video w-full">
                  <iframe
                    src={getEmbedUrl(recipe.youtube_url)}
                    title="Recipe Video Tutorial"
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Desktop Floating YouTube Video */}
            <div className="hidden md:block fixed top-4 right-4 z-40 w-80 bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="bg-card p-2 flex items-center justify-between border-b">
                <h4 className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Youtube className="w-4 h-4 text-primary" />
                  Video Tutorial
                </h4>
                <button
                  onClick={() => {
                    const iframe = document.querySelector('#floating-video') as HTMLIFrameElement;
                    if (iframe) {
                      // Toggle play/pause by reloading iframe (simple implementation)
                      const currentSrc = iframe.src;
                      iframe.src = '';
                      setTimeout(() => iframe.src = currentSrc, 100);
                    }
                  }}
                  className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                >
                  Toggle
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  id="floating-video"
                  src={getEmbedUrl(recipe.youtube_url)}
                  title="Recipe Video Tutorial"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        )}

        {recipe.calories && (
          <div className="mb-6">
            <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg p-4 shadow-card">
              <h3 className="font-semibold text-card-foreground mb-2">Nutrition</h3>
              <p className="text-muted-foreground">{recipe.calories} calories per serving</p>
              {recipe.cuisine && (
                <p className="text-muted-foreground mt-1">Cuisine: {recipe.cuisine}</p>
              )}
            </div>
          </div>
        )}

        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest-editorial text-foreground mb-4">Ingredients</h2>
          <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-lg shadow-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold text-card-foreground">Ingredient</th>
                  <th className="text-right p-3 font-semibold text-card-foreground">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients && recipe.ingredients.map((ingredient, index) => {
                  const scaledQuantity = getScaledQuantity(parseFloat(ingredient.quantity.toString()) || 0, recipe.servings);
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-white/5 bg-transparent"
                    >
                      <td className="p-3 text-[12px] md:text-sm font-bold text-card-foreground capitalize">{ingredient.name}</td>
                      <td className="p-3 text-right text-[12px] md:text-sm font-black tracking-tightest text-card-foreground">
                        {!ingredient.quantity || ingredient.quantity === "0" ?
                          ingredient.unit :
                          formatQuantity(scaledQuantity, ingredient.unit)
                        }
                      </td>
                      </motion.tr>
                    );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-sm font-black uppercase tracking-widest-editorial text-foreground mb-4">Instructions</h2>
          <div className="space-y-4">
            {recipe.instructions && recipe.instructions.map((instruction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="flex gap-4 p-4 bg-black/40 backdrop-blur-md border border-white/5 rounded-lg shadow-card"
              >
                <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  {typeof instruction === 'object' ? instruction.step : index + 1}
                </div>
                <p className="text-[12px] md:text-sm font-bold leading-relaxed text-card-foreground">
                  {typeof instruction === 'object' ? instruction.description : instruction}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Buttons — clearly separated from instructions */}
        <div className="my-8 p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
          <p className="text-white/50 text-[9px] uppercase tracking-widest-editorial mb-4 font-black">Ready to cook?</p>
          <div className="flex gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-white font-black text-[10px] uppercase tracking-widest-editorial py-6 rounded-xl shadow-[0_4px_24px_rgba(242,101,34,0.35)] hover:shadow-[0_4px_32px_rgba(242,101,34,0.5)] transition-all">
              🍳 Start Cooking
            </Button>
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="px-5 gap-2 border-white/15 hover:bg-white/10 text-white rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  Report
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Report Recipe Issue</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-accent/20 p-3 rounded-lg text-sm">
                  <p><strong>Recipe:</strong> {recipe.name}</p>
                  <p><strong>Category:</strong> {recipe.categories?.[0]}</p>
                  <p><strong>Recipe ID:</strong> {recipe.recipe_id}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="issue-description">Issue Description</Label>
                  <Textarea
                    id="issue-description"
                    placeholder="Please describe the issue you found with this recipe (e.g., incorrect ingredients, missing steps, cooking time issues, etc.)"
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsReportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleReportSubmit}
                    disabled={!issueDescription.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Rating Section — clearly separated */}
        <section className="mb-8 pt-2 border-t border-white/5">
          <RatingInput
            recipeId={recipe.recipe_id}
            onRatingSubmitted={() => setRatingRefreshTrigger(prev => prev + 1)}
            onRatingDeleted={() => setRatingRefreshTrigger(prev => prev + 1)}
          />
        </section>

        <section className="mb-8">
          <RatingDisplay
            recipeId={recipe.recipe_id}
            refreshTrigger={ratingRefreshTrigger}
          />
        </section>
      </main>


      {/* Image Viewer Modal */}
      <ImageViewer
        images={recipe.image_url ? [recipe.image_url] : []}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        alt={recipe.name}
      />
    </div>
  );
};

export default RecipeDetailPage;