
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Play, X, CheckCircle, AlertCircle } from "lucide-react";

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial = ({ onComplete }: TutorialProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSkip = () => {
    console.log("Tutorial pulado!");
    onComplete();
  };

  const handleComplete = () => {
    console.log("Tutorial concluído!");
    onComplete();
  };

  const handlePlayVideo = () => {
    console.log("Tentando reproduzir vídeo...");
    setLoadingVideo(true);
    setIsVideoPlaying(true);
    setVideoError(false);
    
    if (videoRef.current) {
      // Forçar o carregamento do vídeo
      videoRef.current.load();
      
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Vídeo reproduzido com sucesso!");
            setLoadingVideo(false);
          })
          .catch((error) => {
            console.error("Erro ao reproduzir vídeo:", error);
            setVideoError(true);
            setLoadingVideo(false);
          });
      }
    }
  };

  const handleVideoLoaded = () => {
    console.log("Vídeo carregado com sucesso!");
    setVideoLoaded(true);
    setLoadingVideo(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = (e: any) => {
    console.error("Erro ao carregar vídeo:", e);
    console.error("Caminho do vídeo:", "/videos/hub.mp4");
    setVideoError(true);
    setLoadingVideo(false);
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      
      if (currentTime >= duration - 0.1) {
        setVideoEnded(true);
      }
    }
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
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
      <Card className="relative z-50 w-full max-w-4xl mx-4 bg-white border-0 shadow-2xl">
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
          <div className="space-y-6">
            {/* Área do vídeo */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border-gray-300 relative">
              {!isVideoPlaying ? (
                <div className="w-full h-full relative bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Play 
                      size={64} 
                      className="mx-auto mb-4 text-blue-600 hover:text-blue-800 cursor-pointer transition-colors drop-shadow-lg"
                      onClick={handlePlayVideo}
                    />
                    <p className="text-gray-700 text-sm font-medium">Clique para reproduzir o vídeo tutorial</p>
                    <p className="text-gray-500 text-xs mt-1">Vídeo explicativo sobre como usar a plataforma</p>
                  </div>
                </div>
              ) : videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center p-8">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Vídeo indisponível
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Não foi possível carregar o vídeo tutorial no momento.
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Você pode continuar e explorar a plataforma diretamente.
                    </p>
                    <Button 
                      onClick={() => {
                        setVideoError(false);
                        setIsVideoPlaying(false);
                      }}
                      variant="outline"
                      className="mr-2"
                    >
                      Tentar Novamente
                    </Button>
                    <Button onClick={handleComplete} variant="default">
                      Continuar sem vídeo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  {loadingVideo && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Carregando vídeo...</p>
                      </div>
                    </div>
                  )}
                  <video 
                    ref={videoRef}
                    controls 
                    className="w-full h-full bg-black"
                    onLoadedData={handleVideoLoaded}
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    preload="metadata"
                    playsInline
                  >
                    <source src="/lovable-uploads/hub.mp4" type="video/mp4" />
                    Seu navegador não suporta reprodução de vídeo.
                  </video>
                </div>
              )}
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
                onClick={handleComplete}
                className="flex-1 text-white border-0 shadow-lg hover:shadow-xl rounded-lg h-12"
                style={{
                  background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
                }}
              >
                <CheckCircle size={16} className="mr-2" />
                Concluir Tutorial
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Tutorial;
