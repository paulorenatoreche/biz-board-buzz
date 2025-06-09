
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play, X, CheckCircle } from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial = ({ onComplete }: TutorialProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleSkip = () => {
    console.log("Tutorial pulado!");
    localStorage.setItem("tutorialCompleted", "true");
    onComplete();
  };

  const handleComplete = () => {
    console.log("Tutorial concluído!");
    localStorage.setItem("tutorialCompleted", "true");
    onComplete();
  };

  const handlePlayVideo = () => {
    console.log("Iniciando reprodução do vídeo do Vimeo...");
    setIsVideoPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      <div className="fixed top-3 right-6 z-60" style={{ marginTop: '5.1px' }}>
        <img
          src="/lovable-uploads/abeeolica_logo_br.png"
          alt="ABEEÓLICA Logo"
          className="h-8 md:h-14 drop-shadow-lg"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {/* Conteúdo do tutorial */}
      <Card className="relative z-50 w-full max-w-2xl mx-auto bg-white border-0 shadow-2xl">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'rgb(60, 71, 157)' }}>
                Tutorial de Uso
              </h1>
              <p className="text-gray-600 text-sm">
                Aprenda como usar o Hub de Negócios em poucos minutos
              </p>
            </div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X size={18} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="px-6 pb-6">
          <div className="space-y-4">
            {/* Área do vídeo */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-gray-300 relative max-h-64">
              {!isVideoPlaying ? (
                <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Play 
                      size={48} 
                      className="mx-auto mb-3 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors drop-shadow-lg"
                      onClick={handlePlayVideo}
                    />
                    <p className="text-gray-700 text-sm font-medium">Clique para reproduzir o vídeo tutorial</p>
                    <p className="text-gray-500 text-xs mt-1">Vídeo explicativo sobre como usar a plataforma</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <iframe
                    className="w-full h-full"
                    src="https://player.vimeo.com/video/1091837514?autoplay=1&title=0&byline=0&portrait=0&badge=0&controls=1&loop=0&autopause=0&pip=0&quality_selector=0&speed=0&keyboard=0&fullscreen=0"
                    title="Tutorial Hub de Negócios"
                    frameBorder="0"
                    allow="autoplay; picture-in-picture; clipboard-write; encrypted-media"
                    allowFullScreen={false}
                    style={{ 
                      pointerEvents: 'auto',
                      border: 'none'
                    }}
                  />
                </div>
              )}
            </div>
            
            {/* Informações do tutorial */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 text-sm">O que você vai aprender:</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Como adicionar uma nova oportunidade de negócio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Como pesquisar e filtrar oportunidades
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Como entrar em contato com outros empresários
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-500" />
                  Como editar suas oportunidades publicadas
                </li>
              </ul>
            </div>
            
            <div className="flex gap-3 pt-3">
              <Button 
                onClick={handleComplete}
                className="flex-1 text-white border-0 shadow-lg hover:shadow-xl rounded-lg h-10"
                style={{
                  background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
                }}
              >
                <CheckCircle size={14} className="mr-2" />
                Concluir Tutorial
              </Button>
              <Button 
                onClick={handleSkip}
                variant="outline"
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-10 px-4 rounded-lg"
              >
                Pular Tutorial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
