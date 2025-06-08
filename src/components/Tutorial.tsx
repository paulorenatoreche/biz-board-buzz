
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play, X, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial = ({ onComplete }: TutorialProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleSkip = () => {
    localStorage.setItem("tutorialCompleted", "true");
    toast.success("Tutorial pulado!");
    onComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("tutorialCompleted", "true");
    toast.success("Tutorial concluído!");
    onComplete();
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // Aqui você pode adicionar a lógica para reproduzir o vídeo
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo borrado */}
      <div 
        className="absolute inset-0 backdrop-blur-md"
        style={{ 
          background: 'linear-gradient(135deg, rgba(60, 71, 157, 0.8) 0%, rgba(45, 55, 135, 0.8) 50%, rgba(30, 40, 115, 0.8) 100%)'
        }}
      />
      
      {/* Logos fixas nos cantos superiores */}
      <div className="fixed top-6 left-6 z-60" style={{ transform: 'translateY(12px)' }}>
        <img
          src="/lovable-uploads/af_datlaz_logo_br.png"
          alt="Datlaz Logo"
          className="h-8 md:h-10 drop-shadow-lg"
        />
      </div>
      <div className="fixed top-3 right-6 z-60" style={{ marginTop: '5.1px' }}>
        <img
          src="/lovable-uploads/abeeolica_logo_br.png"
          alt="ABEEÓLICA Logo"
          className="h-8 md:h-14 drop-shadow-lg"
        />
      </div>

      {/* Conteúdo do tutorial */}
      <Card className="relative z-50 w-full max-w-2xl mx-4 bg-white border-0 shadow-2xl">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3" style={{ color: 'rgb(60, 71, 157)' }}>
                Tutorial de Uso
              </h1>
              <p className="text-gray-600 text-base">
                Aprenda como usar o Hub de Negócios em poucos segundos
              </p>
            </div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={20} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {!isVideoPlaying ? (
            <div className="space-y-6">
              {/* Área do vídeo placeholder */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Play 
                    size={48} 
                    className="mx-auto mb-4 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors"
                    onClick={handlePlayVideo}
                  />
                  <p className="text-gray-500 text-sm">Clique para reproduzir o vídeo</p>
                  <p className="text-gray-400 text-xs mt-1">Vídeo em produção</p>
                </div>
              </div>
              
              {/* Informações do tutorial */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">O que você vai aprender:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Como adicionar uma nova oportunidade de negócio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Como pesquisar e filtrar oportunidades
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Como entrar em contato com outros empresários
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Como editar suas oportunidades publicadas
                  </li>
                </ul>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handlePlayVideo}
                  className="flex-1 text-white border-0 shadow-lg hover:shadow-xl rounded-lg h-12"
                  style={{
                    background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Assistir Tutorial
                </Button>
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-6 rounded-lg"
                >
                  Pular Tutorial
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Área onde o vídeo real será incorporado */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <p className="text-white">Vídeo tutorial será incorporado aqui</p>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleComplete}
                  className="text-white border-0 shadow-lg hover:shadow-xl rounded-lg h-12 px-6"
                  style={{
                    background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
                  }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Concluir Tutorial
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
