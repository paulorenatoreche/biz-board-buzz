
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";
import Tutorial from "@/components/Tutorial";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(() => {
    const tutorialCompleted = localStorage.getItem("tutorialCompleted");
    return tutorialCompleted !== "true";
  });

  const MainContent = () => (
    <div className="min-h-screen relative overflow-hidden">
      {/* Logos fixas nos cantos superiores */}
      <div className="fixed top-5 left-6 z-20" style={{ transform: 'translateY(12px)' }}>
        <img
          src="/lovable-uploads/af_datlaz_logo_br.png"
          alt="Datlaz Logo"
          className="h-8 md:h-10 drop-shadow-lg"
        />
      </div>
      <div className="fixed top-3 right-6 z-20" style={{ marginTop: '5.1px' }}>
        <img
          src="/lovable-uploads/abeeolica_logo_br.png"
          alt="ABEEÓLICA Logo"
          className="h-8 md:h-14 drop-shadow-lg"
        />
      </div>

      {/* Header section with blue background */}
      <div className="relative z-10 text-white" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
        <div className="container mx-auto px-4 py-12">
          <header className="mb-8 pt-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Hub de Negócios</h1>
              <p className="text-white/80 mb-6 text-lg">Encontre e compartilhe oportunidades de negócios. Desenvolvido pela ABEEÓLICA</p>
            </div>
          </header>
          
          {/* Botões posicionados para alinhar com a caixa de pesquisa */}
          <div className="max-w-4xl mx-auto flex justify-between items-center relative z-30">
            <Button 
              onClick={() => navigate("/add-demand")}
              className="bg-slate-800 text-white hover:bg-slate-700 hover:scale-105 flex items-center gap-2 shadow-2xl border-0 font-semibold h-12 px-6 rounded-lg"
            >
              <Plus size={20} />
              Adicionar Oportunidade
            </Button>
            
            <Button 
              onClick={() => window.open("https://cadeia-produtiva.lovable.app", "_blank")}
              className="bg-slate-800 text-white hover:bg-slate-700 hover:scale-105 flex items-center gap-2 shadow-2xl border-0 font-semibold h-12 px-6 rounded-lg"
            >
              <ExternalLink size={20} />
              Ir para a cadeia produtiva
            </Button>
          </div>
        </div>
      </div>
      
      {/* White content section with backdrop */}
      <div className="bg-white relative min-h-screen">
        <div className="container mx-auto px-4">
          <BulletinBoard />
        </div>
      </div>

      {/* Tutorial overlay */}
      {showTutorial && (
        <Tutorial onComplete={() => setShowTutorial(false)} />
      )}
    </div>
  );

  return (
    <PasswordProtection correctPassword="1234">
      <MainContent />
    </PasswordProtection>
  );
};

export default Index;
