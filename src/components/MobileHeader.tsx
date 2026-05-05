import { User, Bell, Heart, BellDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { NotificationService } from "@/api/notificationService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

const MobileHeader = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationService.getNotifications(1, 1);
      if (response.success && response.data) {
        setUnreadCount(response.data.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    sessionStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
    window.location.href = "/login";
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-glass backdrop-blur-3xl border-b border-glass-border shadow-2xl">
      <div className="flex items-center justify-end gap-2 px-4 py-3">
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-accent"
            >
              <User className="w-5 h-5 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card-premium rounded-2xl p-2 border-glass-border">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-3 py-2">My Dossier</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-glass-border" />
            <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl focus:bg-primary focus:text-primary-foreground font-black uppercase text-[10px] tracking-widest p-3">
              <User className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile?tab=recipes")} className="rounded-xl focus:bg-primary focus:text-primary-foreground font-black uppercase text-[10px] tracking-widest p-3">
              <Heart className="w-4 h-4 mr-2" />
              Archives
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/profile?tab=shorts")} className="rounded-xl focus:bg-primary focus:text-primary-foreground font-black uppercase text-[10px] tracking-widest p-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Masterpieces
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-glass-border" />
            <DropdownMenuItem onClick={handleLogout} className="rounded-xl text-rose-500 focus:bg-rose-500 focus:text-white font-black uppercase text-[10px] tracking-widest p-3">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Terminate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile?tab=notifications")}
          className="relative p-2 hover:bg-accent"
        >
          {unreadCount > 0 ? (
            <BellDot className="w-5 h-5 text-primary" />
          ) : (
            <Bell className="w-5 h-5 text-foreground" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Favorites Button */}
        <Link to="/favorites">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-accent"
          >
            <Heart className="w-5 h-5 text-foreground" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;