import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-20">
      {/* Header */}
      <header className="bg-glass backdrop-blur-3xl border-b border-glass-border sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-glass-active"
            >
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Button>
            <h1 className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground opacity-40">Data Sovereignty</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card-premium rounded-[3rem] p-10 md:p-16 space-y-12">
            <div className="border-b border-glass-border pb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-6 bg-primary/40"></div>
                <span className="text-primary text-[9px] font-black uppercase tracking-widest-editorial">Governance Codex</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground uppercase tracking-tightest leading-none mb-6">PRIVACY <br/> POLICY</h1>
              <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground opacity-30">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-6 text-foreground">
              <section>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-3">1. Information We Collect</h3>
                <p className="text-foreground font-bold leading-relaxed opacity-60 mb-3">
                  We collect information you provide directly to us, such as when you create an account, submit recipes, or contact us. This may include:
                </p>
                <ul className="list-disc list-inside text-foreground font-bold opacity-60 space-y-1 ml-4 italic">
                  <li>Name and contact information (phone number)</li>
                  <li>Account credentials (username and password)</li>
                  <li>Food preferences and interests</li>
                  <li>Recipe content, photos, and reviews</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-3">2. Use Case Logic</h3>
                <p className="text-foreground font-bold leading-relaxed opacity-60 mb-3">
                  We utilize secure data nodes to:
                </p>
                <ul className="list-disc list-inside text-foreground font-bold opacity-60 space-y-1 ml-4 italic">
                  <li>Maintain elite service integrity</li>
                  <li>Curate high-fidelity recommendations</li>
                  <li>Establish secure communication lines</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-black uppercase tracking-tight text-foreground mb-3">3. Data Sovereignty</h3>
                <p className="text-foreground font-bold leading-relaxed opacity-60 mb-3">
                  We implement weighted technical measures to protect your information against unauthorized access. Your dossier remains under secure encryption.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <footer className="py-12 border-t border-glass-border bg-glass/20 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[9px] font-black uppercase tracking-widest-editorial text-foreground opacity-20 leading-relaxed">
            © {new Date().getFullYear()} Being Home Foods Information Security Policy. <br/>
            Data Encrypted & Sovereignty Protected.
          </p>
        </div>
      </footer>

    </div>
  );
}