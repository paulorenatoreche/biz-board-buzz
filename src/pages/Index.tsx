import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  const navigate = useNavigate();

  const MainContent = () => (
    <div className="min-h-screen bg-white">
      {/* Blue header section */}
      <div className="bg-gradient-to-r from-custom-slate via-custom-slate to-custom-slate text-white pb-20">
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8 relative">
            <div className="absolute right-0 top-0 md:mr-4 flex gap-4">
              <div className="flex items-center" style={{ transform: 'translateY(12px)' }}>
                <img 
                  src="/public/lovable-uploads/af_datlaz_logo_br.png" 
                  alt="Datlaz Logo" 
                  className="h-8 md:h-10" 
                />
              </div>
              <div className="flex items-center" style={{ marginTop: '5.1px' }}>
                <img 
                  src="https://abeeolica.org.br/wp-content/themes/abeeolica/dist/img/logotipo.svg" 
                  alt="ABEEÓLICA Logo" 
                  className="h-8 md:h-10" 
                />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Hub de Negócios</h1>
              <p className="text-blue-100 mb-6">Encontre e compartilhe oportunidades de negócios. Desenvolvido pela ABEEÓLICA</p>
            </div>
          </header>
          
          {/* Botão posicionado para alinhar com a caixa de pesquisa */}
          <div className="max-w-4xl mx-auto flex justify-start relative -bottom-8 z-10">
            <Button 
              onClick={() => navigate("/add-demand")}
              className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2 shadow-lg border-0 font-semibold"
            >
              <Plus size={20} />
              Adicionar Oportunidade
            </Button>
          </div>
        </div>
      </div>
      
      {/* White content section */}
      <div className="bg-white relative">
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