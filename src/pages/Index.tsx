
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  const navigate = useNavigate();

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/20 to-slate-900"></div>
      
      <div className="relative container mx-auto px-4 py-8">
        <header className="mb-8 relative">
          <div className="absolute right-0 top-0 md:mr-4 flex items-center gap-4">
            <img 
              src="/lovable-uploads/f2b1fed8-1816-4cb3-a92e-05a9a8b3efcd.png" 
              alt="Datlaz Logo" 
              className="h-8 md:h-10" 
            />
            <img 
              src="https://abeeolica.org.br/wp-content/themes/abeeolica/dist/img/logotipo.svg" 
              alt="ABEEÓLICA Logo" 
              className="h-8 md:h-10" 
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Hub de Negócios</h1>
            <p className="text-slate-300 mb-6">Sistema inteligente de gestão de fornecedores, contatos e oportunidades de negócios</p>
            <Button 
              onClick={() => navigate("/add-demand")}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg border-0"
            >
              <Plus size={20} />
              Adicionar Oportunidade
            </Button>
          </div>
        </header>
        <BulletinBoard />
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
