import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Footer = () => {
  return (
    <footer className="relative mt-12 md:mt-20 pt-10 md:pt-16 pb-28 md:pb-32 px-5 md:px-8 bg-glass backdrop-blur-3xl border-t border-glass-border z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <img 
              src="/beinghomelogo.jpeg"
              alt="Being Home Logo" 
              className="h-12 sm:h-14 md:h-16 w-12 sm:w-14 md:w-16 object-cover rounded-full border-2 border-primary/50"
            />
            <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest leading-tight">
              Being Home <span className="text-primary">Foods</span>
            </h3>
          </div>
          <p className="text-foreground font-black text-xs md:text-sm leading-relaxed max-w-sm italic opacity-60">
            Elevating the art of plant-based culinary experiences. We believe in pushing boundaries, exploring deep flavors, and honoring the earth's natural ingredients.
          </p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm md:text-md font-bold text-foreground uppercase tracking-widest">Our Vision</h4>
          <ul className="space-y-3 text-foreground font-black text-xs md:text-sm uppercase tracking-widest opacity-80">
            <li><Link to="#" className="hover:text-primary transition-all duration-300">The Philosophy</Link></li>
            <li><Link to="#" className="hover:text-primary transition-all duration-300">Ingredient Sourcing</Link></li>
            <li><Link to="#" className="hover:text-primary transition-all duration-300">Our Chefs</Link></li>
            <li><Link to="#" className="hover:text-primary transition-all duration-300">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm md:text-md font-bold text-foreground uppercase tracking-widest">Follow the Journey</h4>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-glass border border-glass-border rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300 text-foreground">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-glass border border-glass-border rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300 text-foreground">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center bg-glass border border-glass-border rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300 text-foreground">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-glass-border text-center text-foreground/40 text-[10px] font-black uppercase tracking-[0.4em]">
        © {new Date().getFullYear()} BeingHomeFoods. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
