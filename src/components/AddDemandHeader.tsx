
import { Button } from "@/components/ui/button";
import { ArrowLeft, HandCoins } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddDemandHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative z-10 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-white hover:bg-white/10 hover:scale-105 p-2 rounded-lg"
          >
            <ArrowLeft size={24} />
          </Button>
          <div className="flex items-center gap-3">
            <HandCoins style={{ color: 'white' }} size={32} />
            <h1 className="text-3xl md:text-4xl font-bold">Adicionar Oportunidade</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDemandHeader;
