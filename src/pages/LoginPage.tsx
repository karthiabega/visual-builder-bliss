import React, { useState } from "react";
import InfoIconButton from "../components/ui/InfoIconButton";
import CountryCodeSelector from "../components/ui/CountryCodeSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthService } from "@/api/auth";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric characters
    if (value && !/^\d*$/.test(value)) {
      setPhoneError("Only numeric characters (0-9) are allowed");
      return;
    }
    
    // Limit to 10 digits
    if (value.length > 10) {
      setPhoneError("Phone number cannot exceed 10 digits");
      return;
    }
    
    setPhoneNumber(value);
    
    // Clear error if input is valid
    if (value.length === 0) {
      setPhoneError("");
    } else if (value.length < 10) {
      setPhoneError("Phone number must be exactly 10 digits");
    } else if (value.length === 10) {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber.trim() || !password.trim()) {
      toast.error("Please fill in all fields", {
        position: "top-center",
        duration: 4000,
      });
      return;
    }

    // Validate phone number is exactly 10 digits
    if (phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits", {
        position: "top-center",
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
      const response = await AuthService.login(fullPhoneNumber, password);

      if (response.success) {
        toast.success("Login successful!", {
          position: "top-center",
          duration: 3000,
        });
        navigate("/"); // Redirect to home page
      } else {
        toast.error(response.message || "Login failed", {
          position: "top-center",
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-center",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent pb-12 flex flex-col pt-12 md:pt-20">
      <div className="fixed top-6 left-6 z-50">
        <Link to="/">
            <Button variant="ghost" size="sm" className="p-2 text-foreground/40 hover:text-primary transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Button>
        </Link>
      </div>
      <main className="flex flex-1 flex-col items-center justify-center w-full px-4 py-12 relative z-10">
        <div className="glass-card-premium rounded-[3rem] p-10 md:p-16 w-full max-w-lg shadow-3xl">
          <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                 <div className="h-[1px] w-6 bg-primary/40"></div>
                 <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Secure Access</span>
                 <div className="h-[1px] w-6 bg-primary/40"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-foreground uppercase tracking-tightest leading-none">LOGIN</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  onChange={handlePhoneNumberChange}
                  required
                  disabled={isLoading}
                  className={`flex-1 ${phoneError ? "border-red-500" : ""}`}
                  maxLength={10}
                />
              </div>
              {phoneError ? (
                <p className="text-[9px] font-black uppercase tracking-widest-editorial text-rose-500 italic">{phoneError}</p>
              ) : (
                <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground font-black opacity-60 italic">
                  Enter your 10-digit phone number without the country code
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[9px] uppercase tracking-widest-editorial opacity-60">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-right text-[10px] text-muted-foreground mb-4 font-black uppercase tracking-widest-editorial opacity-60">
              <a href="#" className="hover:underline">Forgot password?</a>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-[9px] font-black uppercase tracking-widest-editorial shadow-2xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Initiate Session"
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-[9px] font-black text-foreground uppercase tracking-widest-editorial leading-relaxed opacity-40">
            New discovery?{" "}
            <Link to="/register" className="text-primary hover:underline font-black">
              Register Dossier
            </Link>
          </div>
          
          <div className="mt-8 text-center text-[9px] font-black text-foreground font-bold opacity-30 uppercase tracking-widest-editorial leading-relaxed">
            By proceeding, you acknowledge the <br/>
            <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>
            {" "} & {" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
