import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "@/api/auth";

export default function InfoIconButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) { onClick(); return; }
    if (AuthService.isAuthenticated()) {
      navigate('/info');
    } else {
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="About BeingHomeFoods"
      title="Account"
      className="group relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 active:scale-90 bg-glass border border-glass-border shadow-sm hover:border-primary/50 hover:bg-glass-active"
    >
      <Info className="w-5 h-5 text-foreground/80 group-hover:text-primary transition-colors" strokeWidth={2.5} />
    </button>
  );
}
