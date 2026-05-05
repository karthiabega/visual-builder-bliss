import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, User, Phone, Heart, LogOut, Edit, Save, X, Bell, BellDot, Trash2, Eye, EyeOff, ChefHat, Clock, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthService } from "@/api/auth";
import { RecipeService, type RecipeListItem } from "@/api/recipeService";
import { NotificationService, type Notification } from "@/api/notificationService";
import { toast } from "sonner";
import YouTubeShortsCarousel from "@/components/YouTubeShortsCarousel";
import type { User as UserType } from "@/api/auth";

const AVAILABLE_INTERESTS = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Low-Carb", "High-Protein", "Dairy-Free", "Nut-Free", "Spicy Food",
  "Sweet Dishes", "Healthy Eating", "Quick Meals", "Traditional Cuisine",
  "International Cuisine", "Baking", "Grilling", "Breakfast", "Desserts"
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    interests: [] as string[]
  });

  // New state for recipes and notifications
  const [userRecipes, setUserRecipes] = useState<RecipeListItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || "profile");

  useEffect(() => {
    fetchUserProfile();
    fetchUserRecipes();
    fetchNotifications();
  }, []);

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await AuthService.getUserProfile();

      if (response.success && response.data) {
        setUser(response.data);
        setEditForm({
          name: response.data.name || "",
          interests: response.data.interests || []
        });
      } else {
        toast.error(response.message || "Failed to load profile");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserRecipes = async () => {
    try {
      setIsLoadingRecipes(true);
      const response = await RecipeService.getMyRecipes('all', 1, 50);
      
      if (response.success && response.data) {
        // Handle null recipes array by providing empty array fallback
        setUserRecipes(response.data.recipes || []);
      } else {
        console.error("Failed to fetch user recipes:", response.message);
        // Set empty array on error to prevent null reference issues
        setUserRecipes([]);
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      // Set empty array on error to prevent null reference issues
      setUserRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await NotificationService.getNotifications(1, 50);
      
      if (response.success && response.data) {
        // Handle null notifications array by providing empty array fallback
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unread_count || 0);
      } else {
        console.error("Failed to fetch notifications:", response.message);
        // Set empty array on error to prevent null reference issues
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Set empty array on error to prevent null reference issues
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await NotificationService.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev =>
          (prev || []).map(notif =>
            notif.id === notificationId
              ? { ...notif, is_read: true, read_at: new Date().toISOString() }
              : notif
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success("Notification marked as read");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const response = await NotificationService.deleteNotification(notificationId);
      if (response.success) {
        const deletedNotification = notifications?.find(n => n.id === notificationId);
        setNotifications(prev => (prev || []).filter(notif => notif.id !== notificationId));
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleEditRecipe = (recipeId: number) => {
    navigate(`/recipes/${recipeId}/edit`);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await AuthService.updateUserProfile(editForm.name, editForm.interests);

      if (response.success && response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    AuthService.logout();
    
    // Clear any other app-specific data if needed
    sessionStorage.clear();
    
    toast.success("Logged out successfully");
    
    // Use replace to prevent back navigation
    navigate("/login", { replace: true });
    
    // Force a page reload to clear any cached state
    window.location.href = "/login";
  };

  const toggleInterest = (interest: string) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/70">Failed to load profile</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pb-28 lg:pb-20">
      {/* Header */}
      <header className="bg-glass-active backdrop-blur-2xl shadow-sm border-b border-glass-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-glass border border-glass-border p-0 flex items-center justify-center hover:bg-glass-active"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Button>
              <h1 className="text-sm font-black text-foreground uppercase tracking-widest-editorial">Dossier Hub</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("notifications")}
                className="relative w-10 h-10 rounded-full bg-glass border border-glass-border p-0 flex items-center justify-center hover:bg-glass-active"
                title="Notifications"
              >
                {unreadCount > 0 ? (
                  <BellDot className="w-5 h-5 text-primary" />
                ) : (
                  <Bell className="w-5 h-5 text-foreground" />
                )}
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] font-black"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-9 px-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 gap-2 text-[9px] font-black uppercase tracking-widest-editorial"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Profile Content */}
      <main className="px-4 py-6 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-glass border border-glass-border p-2 rounded-[2rem] h-auto shadow-2xl">
            <TabsTrigger value="profile" className="gap-2 py-3 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl transition-all duration-500 group">
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest-editorial text-inherit">Dossier</span>
            </TabsTrigger>
            <TabsTrigger value="recipes" className="gap-2 py-3 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl transition-all duration-500 group">
              <ChefHat className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest-editorial text-inherit">Recipes</span>
            </TabsTrigger>
            <TabsTrigger value="shorts" className="gap-2 py-3 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl transition-all duration-500 group">
              <Video className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest-editorial text-inherit">Cinematics</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 py-3 rounded-[1.5rem] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl transition-all duration-500 group">
              {unreadCount > 0 ? <BellDot className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest-editorial text-inherit">Broadcasts</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] font-black bg-primary text-primary-foreground border-none">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6">
            <div className="glass-card-premium p-10 ring-1 ring-black/5">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
                <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                  <div className="w-32 h-32 bg-primary/10 rounded-[3rem] border-2 border-primary/20 flex items-center justify-center shadow-inner relative group/avatar overflow-hidden">
                    <User className="w-14 h-14 text-primary" strokeWidth={2.5} />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tightest leading-none">{user.name}</h2>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <p className="text-primary text-[9px] font-black uppercase tracking-widest-editorial italic">Standard Executive</p>
                      <div className="h-4 w-px bg-foreground/10" />
                      <p className="text-foreground/60 text-xs font-bold tracking-widest flex items-center gap-2">
                        <Phone className="w-3 h-3 text-primary" />
                        {user.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="gap-3 rounded-full border-primary/30 text-primary font-black uppercase text-[9px] tracking-widest-editorial px-8 h-12 hover-depth shadow-2xl"
                  >
                    <Edit className="w-4 h-4" />
                    Modify Dossier
                  </Button>
                )}
              </div>

              {/* Profile Form */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="space-y-4">
                  <Label htmlFor="name" className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">Dossier Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-glass border-glass-border text-foreground font-black placeholder:text-foreground/40"
                      placeholder="Enter legal name"
                    />
                  ) : (
                    <p className="text-foreground font-black text-xl uppercase tracking-tight bg-foreground/5 border border-glass-border p-4 rounded-2xl">{user.name}</p>
                  )}
                </div>

                {/* Phone Number (Read-only) */}
                <div className="space-y-2">
                  <Label className="text-foreground/40 text-[10px] font-black uppercase tracking-widest">Phone Number</Label>
                  <p className="text-foreground font-black bg-glass-active border border-glass-border p-3 rounded-xl tracking-widest">{user.phone_number}</p>
                  <p className="text-[10px] text-foreground font-black italic opacity-60">Phone number cannot be changed</p>
                </div>

                {/* Interests */}
                <div className="space-y-3">
                  <Label className="text-foreground font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Interests
                  </Label>
                  {isEditing ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-foreground font-bold opacity-40 italic">Select your curated preferences:</p>
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2">
                        {AVAILABLE_INTERESTS.map((interest) => (
                          <Badge
                            key={interest}
                            variant={editForm.interests.includes(interest) ? "default" : "secondary"}
                            className={`cursor-pointer transition-all duration-300 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              editForm.interests.includes(interest)
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                : "bg-glass border-glass-border text-foreground font-bold hover:border-primary/40 hover:text-primary"
                            }`}
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests && user.interests.length > 0 ? (
                        user.interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="bg-foreground/10 border border-glass-border text-foreground font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-foreground font-black italic text-sm opacity-40">No interests secured</p>
                      )}
                    </div>
                  )}
                </div>

                 {/* Action Buttons */}
                 {isEditing && (
                   <div className="flex gap-4 pt-8">
                     <Button
                       onClick={handleSaveProfile}
                       disabled={isSaving}
                       className="flex-1 h-14 rounded-full bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 hover-depth gap-2"
                     >
                       <Save className="w-4 h-4" />
                       {isSaving ? "Synchronizing..." : "Harden Changes"}
                     </Button>
                     <Button
                       variant="outline"
                       onClick={() => {
                         setIsEditing(false);
                         setEditForm({
                           name: user.name || "",
                           interests: user.interests || []
                         });
                       }}
                       className="px-10 h-14 rounded-full border-white/10 font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/5"
                     >
                       <X className="w-4 h-4" />
                       Abort
                     </Button>
                   </div>
                 )}
               </div>
              
              {/* Terms and Privacy Policy Links */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-sm font-medium text-foreground mb-3">Legal</h3>
                <div className="space-y-2">
                  <Link
                    to="/terms"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms and Conditions
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* My Recipes Tab */}
          <TabsContent value="recipes" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">My Recipes</h2>
                <Button onClick={() => navigate('/create-recipe')} className="gap-2">
                  <ChefHat className="w-4 h-4" />
                  Create Recipe
                </Button>
              </div>
              
              {isLoadingRecipes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your recipes...</p>
                </div>
              ) : userRecipes && userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRecipes.map((recipe) => (
                    <div key={recipe.recipe_id} className="glass-card-premium overflow-hidden group hover-depth">
                      <div className="aspect-[21/9] relative overflow-hidden">
                        <img
                          src={recipe.image_url}
                          alt={recipe.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
                        <div className="absolute top-4 right-4 z-20">
                           {recipe.is_approve === 1 ? (
                              <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1">Verified</Badge>
                           ) : recipe.is_approve === 0 ? (
                              <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1">Pending Review</Badge>
                           ) : (
                              <Badge className="bg-rose-500/20 text-rose-500 border border-rose-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1">Refined Out</Badge>
                           )}
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight mb-6 line-clamp-1 group-hover:text-primary transition-colors">{recipe.name}</h3>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-[10px] font-black text-foreground/60 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">
                                <Clock className="w-3.5 h-3.5 text-primary" /> {recipe.cook_time}M
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-foreground/60 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">
                                <Eye className="w-3.5 h-3.5 text-primary" /> {recipe.views}
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/recipes/${recipe.recipe_id}`)} className="h-10 w-10 p-0 rounded-full bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-all">
                                 <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditRecipe(recipe.recipe_id)} className="h-10 w-10 p-0 rounded-full bg-foreground/5 hover:bg-primary hover:text-primary-foreground transition-all">
                                 <Edit className="w-4 h-4" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ChefHat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No recipes yet</h3>
                  <p className="text-muted-foreground mb-4">Start creating your first recipe!</p>
                  <Button onClick={() => navigate('/create-recipe')} className="gap-2">
                    <ChefHat className="w-4 h-4" />
                    Create Your First Recipe
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
                {unreadCount > 0 && (
                  <Badge variant="secondary">
                    {unreadCount} unread
                  </Badge>
                )}
              </div>
              
              {isLoadingNotifications ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading notifications...</p>
                </div>
              ) : notifications && notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={`${!notification.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{notification.title}</h4>
                              {!notification.is_read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleDateString()} at {new Date(notification.created_at).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.is_read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="p-2"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* YouTube Shorts Tab */}
          <TabsContent value="shorts" className="mt-6">
            <YouTubeShortsCarousel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;
