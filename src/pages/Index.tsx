
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";
import PasswordProtection from "@/components/PasswordProtection";

const Index = () => {
  const navigate = useNavigate();

  const MainContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 relative">
          <div className="absolute right-0 top-0 md:mr-4">
            <img 
              src="https://abeeolica.org.br/wp-content/themes/abeeolica/dist/img/logotipo.svg" 
              alt="ABEEÓLICA Logo" 
              className="h-8 md:h-10" // Reduced height by 50% from h-16/h-20 to h-8/h-10
            />
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Business Hub</h1>
            <p className="text-gray-600 mb-6">Find and share business opportunities. Powered by ABEEÓLICA</p>
            <Button 
              onClick={() => navigate("/add-demand")}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <Plus size={20} />
              Add Demand
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
