import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Mail, Phone, Calendar, Clock, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface Category {
  value: string;
  label: string;
  color: string;
}

interface Post {
  id: string;
  fullName: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  category: Category;
  createdAt: string;
  expiresAt: string;
}

interface PostItProps {
  post: Post;
}

const PostIt = ({ post }: PostItProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const navigate = useNavigate();

  const handleContact = () => {
    window.location.href = `mailto:${post.email}?subject=Business Opportunity Response`;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-demand/${post.id}`);
  };

  const handleDelete = () => {
    // Get posts from localStorage
    const storedPosts = localStorage.getItem('bulletinPosts');
    if (storedPosts) {
      const posts = JSON.parse(storedPosts);
      // Filter out the deleted post
      const updatedPosts = posts.filter((p: Post) => p.id !== post.id);
      // Update localStorage
      localStorage.setItem('bulletinPosts', JSON.stringify(updatedPosts));
      
      // Show success message
      toast.success("Publicação excluída com sucesso!");
      
      // Close dialogs and refresh the page to update the list
      setShowDeleteAlert(false);
      setShowDetails(false);
      window.location.reload();
    }
  };

  // Calculate days remaining until expiration
  const daysRemaining = () => {
    const now = new Date();
    const expiryDate = new Date(post.expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to truncate company name if too long - reduced max length for consistency
  const truncateCompanyName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength-8) + "...";
  };

  const truncateName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength-8) + "...";
  };

  const isNameLong = post.fullName.length > 25

  const isCompanyNameLong = post.companyName.length > 25;

  return (
    <TooltipProvider>
      <Card 
        className="bg-white/95 hover:bg-white hover:shadow-2xl border border-white/20 cursor-pointer shadow-lg flex flex-col h-full hover:scale-[1.02] relative"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3 rounded-t-lg h-24 flex flex-col justify-center" style={{ background: 'rgb(58, 197, 225)' }}>
          <div className="flex justify-between items-start gap-2 h-full">
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {isCompanyNameLong ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <h3 className="font-bold text-white text-lg break-words leading-tight cursor-help">
                      {truncateCompanyName(post.companyName)}
                    </h3>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 bg-white border border-gray-200 shadow-xl rounded-lg">
                    <div className="overflow-hidden">
                      <div className="animate-marquee whitespace-nowrap text-gray-900 font-semibold">
                        {post.companyName}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <h3 className="font-bold text-white text-lg break-words leading-tight">
                  {post.companyName}
                </h3>
              )}
              <p className="text-sm text-blue-100 break-words mt-1.6">{post.fullName}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge 
                className="shadow-sm bg-white/20 text-white border-white/30 hover:bg-white/40 whitespace-nowrap" 
              >
                {post.category?.label || "Uncategorized"}
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleEdit}
                    className="w-6 h-6 p-0 bg-white/80 hover:bg-white border border-white/30 text-gray-600 hover:text-gray-800 shadow-sm flex-shrink-0 hover:scale-110 transition-transform duration-200"
                    variant="outline"
                  >
                    <Edit size={12} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Editar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow bg-white/95 pt-3">
          <p className="text-gray-700 mb-4 whitespace-pre-wrap break-words overflow-wrap-anywhere hyphens-auto line-clamp-4">{post.description}</p>
          <div className="text-xs text-gray-500 space-y-2">
            <div className="flex items-center gap-2">
              <Calendar size={12} />
              <span>Publicado: {format(new Date(post.createdAt), "dd MMM yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={12} />
              <span>Expira em: {daysRemaining()} dias</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-auto bg-white/95">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleContact();
            }}
            className="w-full text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg h-11"
            style={{
              background: 'rgb(138, 198, 64)',
              '--hover-bg': 'rgb(118, 168, 54)'
            } as React.CSSProperties & { '--hover-bg': string }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgb(118, 168, 54)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgb(138, 198, 64)';
            }}
          >
            <Mail size={16} className="mr-2" />
            Entrar em Contato
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-white/95 border border-white/20 shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto text-gray-900">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-xl font-bold text-gray-900 break-words hyphens-auto leading-tight mt-3">
                  {post.companyName}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-3">
                  Publicado por {post.fullName}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm self-start flex-shrink-0 mt-4 hover:bg-gray-100 hover:text-gray-600"
                >
                  {post.category?.label || "Uncategorized"}
                </Badge>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-8 h-8 p-0 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 hover:text-red-700 shadow-sm flex-shrink-0 hover:scale-110 transition-transform duration-200 mt-4"
                        variant="outline"
                      >
                        <Trash size={14} />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Excluir</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Descrição:</h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-hidden">
                <p className="text-gray-700 whitespace-pre-wrap break-words leading-relaxed hyphens-auto max-w-full overflow-wrap-break-word word-break-break-word">
                  {post.description}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Informações de Contato:</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3 overflow-hidden">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
                    <span className="text-gray-700 break-all text-sm leading-relaxed min-w-0 overflow-wrap-break-word">{post.email}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={16} className="flex-shrink-0 mt-0.5 text-blue-600" />
                    <span className="text-gray-700 break-all text-sm leading-relaxed min-w-0 overflow-wrap-break-word">{post.phone}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Datas:</h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-blue-600" />
                    <span className="text-gray-700 text-sm">Publicado: {format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-blue-600" />
                    <span className="text-gray-700 text-sm">Expira: {format(new Date(post.expiresAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-800 font-semibold text-sm">Expira em: {daysRemaining()} dias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <Button 
              onClick={handleContact}
              className="flex-1 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg h-12"
              style={{
                background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgb(50, 61, 137), rgb(35, 45, 115))';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))';
              }}
            >
              <Mail size={16} className="mr-2" />
              Entrar em Contato
            </Button>
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200 h-12 px-6 rounded-lg sm:w-auto w-full"
            >
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-white border border-gray-200 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900">Tem certeza que deseja excluir?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Esta ação não pode ser desfeita. A publicação será permanentemente removida do quadro de oportunidades.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default PostIt;
