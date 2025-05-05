
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BulletinBoard from "@/components/BulletinBoard";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Business Opportunities Board</h1>
          <p className="text-gray-600 mb-6">Find and share business opportunities</p>
          <Button 
            onClick={() => navigate("/add-demand")}
            className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
          >
            <Plus size={20} />
            Add Demand
          </Button>
        </header>
        <BulletinBoard />
      </div>
    </div>
  );
};

export default Index;
