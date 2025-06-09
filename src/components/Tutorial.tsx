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
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  const handleSkip = () => {
    // Usando estado em memória ao invés de localStorage
    console.log("Tutorial pulado!");
    onComplete();
  };

  const handleComplete = () => {
    // Usando estado em memória ao invés de localStorage
    console.log("Tutorial concluído!");
    onComplete();
  };

  const handlePlayVideo = () => {
    setLoadingVideo(true);
    setIsVideoPlaying(true);
    setVideoError(false);
    
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
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
    setVideoLoaded(true);
    setLoadingVideo(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = (e: any) => {
    console.error("Erro no vídeo:", e);
    setVideoError(true);
    setLoadingVideo(false);
  };

  const handlePreviewLoaded = () => {
    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = 1; // Mostra frame aos 1 segundo
    }
  };

  const handlePreviewError = () => {
    console.warn("Erro ao carregar preview do vídeo");
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      
      if (currentTime >= duration - 0.1) { // Pequena margem para evitar problemas de timing
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
                <div className="w-full h-full relative">
                  {/* Video preview borrado no fundo */}
                  <video
                    ref={previewVideoRef}
                    className="w-full h-full object-cover filter blur-sm"
                    muted
                    preload="metadata"
                    onLoadedData={handlePreviewLoaded}
                    onError={handlePreviewError}
                  >
                    <source src="/lovable-uploads/hub.mp4" type="video/mp4" />
                    <source src="/lovable-uploads/hub.webm" type="video/webm" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  
                  {/* Overlay com play button */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="text-center">
                      <Play 
                        size={64} 
                        className="mx-auto mb-4 text-white hover:text-blue-300 cursor-pointer transition-colors drop-shadow-lg"
                        onClick={handlePlayVideo}
                      />
                      <p className="text-white text-sm font-medium drop-shadow">Clique para reproduzir o vídeo</p>
                      <p className="text-white text-xs mt-1 opacity-80">Tutorial em vídeo disponível</p>
                    </div>
                  </div>
                </div>
              ) : videoError ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <div className="text-center p-8">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Erro ao carregar vídeo
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Não foi possível carregar o vídeo do tutorial.
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
                    preload="auto"
                    playsInline
                  >
                    <source src="/lovable-uploads/hub.mp4" type="video/mp4" />
                    <source src="/lovable-uploads/hub.webm" type="video/webm" />
                    Seu navegador não suporta o elemento de vídeo.
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