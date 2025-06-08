
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  isSending: boolean;
}

const FormActions = ({ isSending }: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end pt-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/")}
        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 h-12 px-6 rounded-lg shadow-sm w-full sm:w-auto"
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 h-12 px-8 rounded-lg font-semibold w-full sm:w-auto"
        style={{
          background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
        }}
        disabled={isSending}
      >
        {isSending ? "Publicando..." : "Publicar Oportunidade"}
      </Button>
    </div>
  );
};

export default FormActions;
