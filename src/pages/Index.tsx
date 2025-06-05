import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  const navigate = useNavigate();

  const MainContent = () => (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
      {/* Geometric background elements */}
      

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

      {/* Header section */}
      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 py-12">
          <header className="mb-8 pt-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Hub de Negócios</h1>
              <p className="text-white/80 mb-6 text-lg">Encontre e compartilhe oportunidades de negócios. Desenvolvido pela ABEEÓLICA</p>
            </div>
          </header>
          
          {/* Botão posicionado para alinhar com a caixa de pesquisa */}
          <div className="max-w-4xl mx-auto flex justify-start relative z-30">
            <Button 
              onClick={() => navigate("/add-demand")}
              className="bg-white text-blue-600 hover:bg-white hover:scale-105 flex items-center gap-2 shadow-2xl border-0 font-semibold h-12 px-6 rounded-lg "
            >
              <Plus size={20} />
              Adicionar Oportunidade
            </Button>
          </div>
        </div>
      </div>
      
      {/* White content section with backdrop */}
      <div className="bg-white  relative min-h-screen">
        <div className="container mx-auto px-4">
          <BulletinBoard />
        </div>
      </div>
    </div>
  );

  return (
    <PasswordProtection correctPassword="1234">
      <MainContent />
    </PasswordProtection>
  );
};

export default Index;