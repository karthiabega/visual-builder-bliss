import { ArrowLeft, Utensils, Leaf, Fish, Cookie, Soup, Users, Heart, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MobileHeader from "@/components/MobileHeader";
import { Link } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import { motion } from "framer-motion";


const KBankPage = () => {
  const foodCategories = [
    {
      id: "1",
      title: "Grains & Cereals",
      description: "Essential carbohydrates for energy and fiber for digestive health",
      icon: <Soup className="w-8 h-8" />,
      examples: ["Rice", "Wheat", "Oats", "Barley", "Quinoa"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "2",
      title: "Fruits & Vegetables",
      description: "Rich in vitamins, minerals, and antioxidants for overall health",
      icon: <Leaf className="w-8 h-8" />,
      examples: ["Spinach", "Carrots", "Apples", "Berries", "Citrus"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "3",
      title: "Proteins",
      description: "Building blocks for muscle growth and tissue repair",
      icon: <Fish className="w-8 h-8" />,
      examples: ["Fish", "Chicken", "Eggs", "Legumes", "Nuts"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "4",
      title: "Dairy & Alternatives",
      description: "Calcium and protein sources for bone health and nutrition",
      icon: <Cookie className="w-8 h-8" />,
      examples: ["Milk", "Cheese", "Yogurt", "Almond Milk", "Tofu"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "5",
      title: "Healthy Fats",
      description: "Essential fatty acids for brain function and hormone production",
      icon: <Utensils className="w-8 h-8" />,
      examples: ["Avocado", "Olive Oil", "Nuts", "Seeds", "Fatty Fish"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    }
  ];

  const foodHabits = [
    {
      id: "1",
      title: "Vegetarian (Veg)",
      description: "A plant-focused diet excluding meat, poultry, fish, and seafood but may include dairy and eggs",
      icon: <Leaf className="w-8 h-8" />,
      included: ["Fruits", "Vegetables", "Grains", "Legumes", "Nuts", "Dairy", "Eggs"],
      excluded: ["All meat", "Poultry", "Fish", "Seafood"],
      benefits: ["Lower risk of heart disease", "Better weight management", "Higher fiber intake", "Reduced environmental impact"],
      challenges: ["Potential B12, iron deficiencies", "Requires nutritional planning"],
      examples: ["Vegetable stir-fry with tofu", "Cheese pizza with veggies", "Lentil soup"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "2",
      title: "Non-Vegetarian (Non-Veg)",
      description: "Includes animal flesh along with plant-based foods - the most flexible and common global diet",
      icon: <Utensils className="w-8 h-8" />,
      included: ["All vegetarian foods", "Meat", "Poultry", "Fish", "Seafood"],
      excluded: ["None inherently"],
      benefits: ["High-quality complete proteins", "Essential amino acids", "Vitamin B12", "Iron and zinc"],
      challenges: ["Higher disease risk if over-reliant on processed meats", "Environmental concerns"],
      examples: ["Grilled chicken salad", "Fish curry with rice", "Beef stir-fry"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "3",
      title: "Vegan",
      description: "Strict plant-based diet avoiding all animal products and by-products for ethical, health, or environmental reasons",
      icon: <Sprout className="w-8 h-8" />,
      included: ["Fruits", "Vegetables", "Grains", "Legumes", "Plant-based milks", "Tofu", "Nuts"],
      excluded: ["All animal products", "Meat", "Dairy", "Eggs", "Honey", "Gelatin"],
      benefits: ["Heart health", "Weight loss", "Lower cholesterol", "Environmental friendly", "Animal welfare"],
      challenges: ["Risk of B12, calcium deficiencies", "Social challenges", "Requires supplements"],
      examples: ["Avocado toast", "Chickpea salad with quinoa", "Vegan stir-fry with tofu"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "4",
      title: "Pescatarian",
      description: "Semi-vegetarian diet including fish and seafood but excluding other meats",
      icon: <Fish className="w-8 h-8" />,
      included: ["Vegetarian foods", "Fish", "Seafood", "Eggs", "Dairy"],
      excluded: ["Red meat", "Poultry", "Land animals"],
      benefits: ["Heart-healthy omega-3s", "High protein", "Easier than strict vegetarianism"],
      challenges: ["Mercury concerns in some fish", "Not fully plant-based"],
      examples: ["Grilled salmon with veggies", "Shrimp pasta", "Tuna salad sandwich"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    },
    {
      id: "5",
      title: "Flexitarian",
      description: "Flexible vegetarian diet that's mostly plant-based but occasionally includes meat or fish",
      icon: <Users className="w-8 h-8" />,
      included: ["Primarily vegetarian", "Moderate amounts of animal products"],
      excluded: ["None strictly - animal products minimized"],
      benefits: ["Plant health benefits with variety", "Easier to sustain", "Environmentally better"],
      challenges: ["Can be vague", "Requires mindful choices"],
      examples: ["Veggie burger most days", "Occasional chicken stir-fry"],
      color: "bg-primary/5 border-primary/20",
      iconColor: "text-primary"
    }
  ];

  const otherDiets = [
    { name: "Paleo", description: "Focuses on whole foods like meats, fish, fruits, veggies, nuts, and seeds, mimicking hunter-gatherer diet" },
    { name: "Keto", description: "High-fat, low-carb diet including meats, dairy, eggs, and low-carb veggies for ketosis" },
    { name: "Gluten-Free", description: "Avoids gluten (protein in wheat, barley) due to celiac disease or sensitivity" },
    { name: "Raw Food", description: "Emphasizes uncooked, unprocessed foods for enzyme preservation and detoxification" }
  ];

  return (
    <div className="min-h-screen bg-transparent pb-28 lg:pb-20 pt-14 lg:pt-0" style={{ position: "relative" }}>
      {/* Mobile Sticky Header */}
      <MobileHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-10 md:pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[3rem] p-12 md:p-24 text-center border border-white/10 shadow-3xl bg-black/40 backdrop-blur-3xl group light-sweep"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black/40 to-black z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          
          <div className="relative z-20 flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-10"
            >
              <div className="h-[1px] w-12 bg-primary/40"></div>
              <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Culinary Encyclopedia</span>
              <div className="h-[1px] w-12 bg-primary/40"></div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-foreground uppercase tracking-tightest leading-[0.85] mb-12"
            >
              KNOWLEDGE <br/>
              <span className="text-primary italic">BANK</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-foreground font-black text-[12px] md:text-sm tracking-widest-editorial max-w-2xl leading-relaxed italic opacity-85"
            >
              A curated taxonomy of nutritional wisdom, food habits, and culinary classifications. <br className="hidden md:block"/>
              Everything you need to master your journey with <span className="text-primary font-black">BeingHomeFoods</span>.
            </motion.p>
          </div>
        </motion.div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {foodHabits.map((habit, idx) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[2.5rem] h-[450px] group light-sweep border border-foreground/10 shadow-2xl bg-gradient-to-br from-primary/30 via-background/80 to-background"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <div className="text-white scale-[3]">
                   {habit.icon}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 z-20 space-y-6">
                <div>
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase mb-4">BH-{habit.id.padStart(2, '0')}</span>
                  <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-none group-hover:text-primary transition-colors">
                    {habit.title}
                  </h3>
                </div>

                <p className="text-[12px] md:text-sm text-foreground/80 leading-relaxed font-black transition-colors italic">
                  {habit.description}
                </p>

                <div className="pt-6 border-t border-foreground/10 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {habit.included.slice(0, 4).map((food, i) => (
                      <span key={i} className="text-[9px] font-bold uppercase tracking-widest-editorial text-primary/80 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        {food}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    {habit.benefits.slice(0, 2).map((b, i) => (
                      <div key={i} className="flex items-center gap-3 text-foreground/70 text-[10px] font-black italic">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="pt-24 lg:pt-32 border-t border-foreground/10">
            <div className="max-w-3xl mb-16">
               <p className="text-primary text-[9px] font-black uppercase tracking-widest-editorial mb-4">Extended Taxonomy</p>
               <h3 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tightest leading-none mb-6">Specialized Dietary Focus</h3>
               <p className="text-foreground font-black text-sm leading-relaxed italic opacity-75">
                 Niche nutritional protocols designed for specific metabolic and therapeutic requirements.
               </p>
            </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherDiets.map((diet, index) => (
                <div key={index} className="relative overflow-hidden p-8 rounded-[2rem] bg-foreground/[0.02] border border-foreground/10 hover:border-primary/40 transition-all group flex flex-col gap-4 min-h-[200px] justify-end">
                   <div className="absolute top-6 right-6 text-4xl font-black text-foreground/[0.03] group-hover:text-primary/10 transition-colors">0{index + 6}</div>
                   <div className="space-y-2 relative z-10">
                      <h4 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{diet.name}</h4>
                      <p className="text-[11px] md:text-xs text-foreground/70 leading-relaxed font-black line-clamp-2 italic">{diet.description}</p>
                   </div>
                   <div className="w-8 h-[2px] bg-primary group-hover:w-full transition-all duration-700" />
                </div>
              ))}
           </div>
        </div>

        <div className="pt-32 pb-12">
          <div className="flex flex-col items-center text-center mb-16">
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Nutritional Science</p>
            <h2 className="text-4xl md:text-6xl font-black text-foreground uppercase tracking-tighter leading-none mb-4">Food Categories</h2>
            <div className="w-24 h-[1px] bg-primary/40 mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foodCategories.map((category, idx) => (
              <motion.div 
                key={category.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[2.5rem] p-8 border border-foreground/10 bg-foreground/[0.03] backdrop-blur-2xl hover:border-primary/40 transition-all duration-500"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    {category.icon}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">
                      {category.title}
                    </h3>
                    <p className="text-[12px] text-foreground/80 font-black italic leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    {category.examples.map((ex, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-widest text-primary/80 px-3 py-1 bg-primary/10 rounded-full">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-background/40 to-background border border-foreground/10 shadow-2xl relative overflow-hidden group light-sweep"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
          
          <div className="relative z-20 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary animate-pulse flex-shrink-0">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-4">
              <h4 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter">Nutritional Guidance</h4>
              <p className="text-sm md:text-base text-foreground/70 font-black leading-relaxed max-w-4xl italic">
                Individual nutritional needs vary based on age, health conditions, and activity level. 
                Please consult with a healthcare professional or registered dietitian before making 
                major dietary changes to ensure the approach is right for your specific situation.
              </p>
            </div>
            <div className="hidden lg:block h-12 w-[1px] bg-foreground/10 mx-4" />
            <div className="flex-shrink-0">
               <span className="text-[10px] font-black text-primary/80 uppercase tracking-[0.4em]">Stay Healthy First</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation Bar */}
    </div>
  );
};

export default KBankPage;