import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import CountryCodeSelector from "../components/ui/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

const AVAILABLE_INTERESTS = [
  "Vegetarian", "Non-Vegetarian", "Vegan", "Gluten-Free", "Keto",
  "Low-Carb", "High-Protein", "Dairy-Free", "Nut-Free", "Spicy Food",
  "Sweet Dishes", "Healthy Eating", "Quick Meals", "Traditional Cuisine",
  "International Cuisine", "Baking", "Grilling", "Breakfast", "Desserts"
];

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [acceptedTermsAndPrivacy, setAcceptedTermsAndPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim() || !password.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (!acceptedTermsAndPrivacy) {
      toast.error("Please accept the Terms and Conditions and Privacy Policy to continue");
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const response = await AuthService.register(
        fullPhoneNumber,
        password,
        name.trim(),
        interests
      );

      if (response.success) {
        toast.success("Registration successful!");
        navigate("/"); // Redirect to home page
      } else {
        toast.error(response.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-20 flex flex-col pt-12 md:pt-20">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/login">
            <Button variant="ghost" size="sm" className="p-2 text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Button>
        </Link>
      </div>
      
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 relative z-10">
        <div className="glass-card-premium rounded-[3rem] p-10 md:p-16 w-full max-w-xl shadow-3xl">
           <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="h-[1px] w-6 bg-primary/40"></div>
                 <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Establish Dossier</span>
                 <div className="h-[1px] w-6 bg-primary/40"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tightest leading-none">REGISTER</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[9px] uppercase tracking-widest-editorial opacity-60">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-[9px] uppercase tracking-widest-editorial opacity-60">Phone Number</Label>
              <div className="flex gap-2">
                <CountryCodeSelector
                  value={countryCode}
                  onChange={setCountryCode}
                  className="flex-shrink-0"
                />
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  disabled={isLoading}
                  className="flex-1"
                />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground font-black opacity-60 italic">
                Enter your phone number without the country code
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[9px] uppercase tracking-widest-editorial opacity-60">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[9px] uppercase tracking-widest-editorial opacity-60">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[9px] uppercase tracking-widest-editorial opacity-60">Food Interests (Optional)</Label>
              <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground font-black opacity-60 italic leading-none">Select curated preferences:</p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {AVAILABLE_INTERESTS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "secondary"}
                    className={`cursor-pointer transition-all duration-300 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest-editorial ${
                      interests.includes(interest)
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                        : "bg-glass border-glass-border text-foreground font-bold hover:border-primary/40 hover:text-primary"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {interests.length > 0 && (
                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                  Selected: {interests.join(", ")}
                </p>
              )}
            </div>

            {/* Terms and Privacy Policy Checkbox */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms-privacy"
                  checked={acceptedTermsAndPrivacy}
                  onCheckedChange={(checked) => setAcceptedTermsAndPrivacy(checked as boolean)}
                  disabled={isLoading}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms-privacy"
                    className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground font-black opacity-60 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 leading-relaxed"
                  >
                    I acknowledge and agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-[9px] font-black uppercase tracking-widest-editorial shadow-2xl"
              disabled={isLoading || !acceptedTermsAndPrivacy}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Establishing Dossier...
                </>
              ) : (
                "Initiate Connection"
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-[9px] font-black text-foreground uppercase tracking-widest-editorial leading-relaxed opacity-40">
            Already archived?{" "}
            <Link to="/login" className="text-primary hover:underline font-black">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      
    </div>
  );
}