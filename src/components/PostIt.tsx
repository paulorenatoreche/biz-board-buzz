import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Mail, Phone, Calendar, Clock, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleContact = () => {
    window.location.href = `mailto:${post.email}?subject=Business Opportunity Response`;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-demand/${post.id}`);
  };

  // Calculate days remaining until expiration
  const daysRemaining = () => {
    const now = new Date();
    const expiryDate = new Date(post.expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to truncate company name if too long
  const truncateCompanyName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const isCompanyNameLong = post.companyName.length > 25;

  return (
    <TooltipProvider>
      <Card 
        className="bg-white/95 hover:bg-white hover:shadow-2xl border border-white/20 cursor-pointer shadow-lg flex flex-col h-full hover:scale-[1.02] relative"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3 rounded-t-lg" style={{ background: 'rgb(58, 197, 225)' }}>
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
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
              <p className="text-sm text-blue-100 break-words">{post.fullName}</p>
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
                    className="w-6 h-6 p-0 bg-white/80 hover:bg-white border border-white/30 text-gray-600 hover:text-gray-800 shadow-sm flex-shrink-0"
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
          <p className="text-gray-700 mb-4 whitespace-pre-wrap line-clamp-4">{post.description}</p>
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
            className="w-full text-white border-0 shadow-lg hover:shadow-xl hover:scale-105  rounded-lg h-11"
            style={{
              background: 'rgb(138, 198, 64)'
            }}
          >
            <Mail size={16} className="mr-2" />
            Entrar em Contato
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-white/95 border border-white/20 shadow-2xl max-w-xl text-gray-900">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900">{post.companyName}</DialogTitle>
              <Badge 
                className="bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
              >
                {post.category?.label || "Uncategorized"}
              </Badge>
            </div>
            <DialogDescription className="text-gray-600">
              Publicado por {post.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Descrição:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Informações de Contato:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} />
                    <span>{post.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} />
                    <span>{post.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Datas:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar size={16} />
                    <span>Publicado: {format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={16} />
                    <span>Expira: {format(new Date(post.expiresAt), "dd MMM yyyy")}</span>
                  </div>
                  <p className="text-gray-800 font-semibold">Expira em: {daysRemaining()} dias</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button 
              onClick={handleContact}
              className="flex-1 text-white border-0 shadow-lg hover:shadow-xl rounded-lg h-12"
              style={{
                background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
              }}
            >
              <Mail size={16} className="mr-2" />
              Entrar em Contato
            </Button>
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-12 px-4 rounded-lg"
            >
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default PostIt;
