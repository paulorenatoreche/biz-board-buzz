import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Mail, Phone, Calendar, Clock } from "lucide-react";

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

  const handleContact = () => {
    window.location.href = `mailto:${post.email}?subject=Business Opportunity Response`;
  };

  // Calculate days remaining until expiration
  const daysRemaining = () => {
    const now = new Date();
    const expiryDate = new Date(post.expiresAt);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <>
      <Card 
        className="bg-slate-800/70 backdrop-blur-sm hover:bg-slate-800/90 transition-all duration-300 hover:shadow-2xl border border-slate-700/50 cursor-pointer shadow-lg flex flex-col h-full hover:scale-[1.02]"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-lg">{post.companyName}</h3>
              <p className="text-sm text-slate-300">{post.fullName}</p>
            </div>
            <Badge 
              className="ml-2 shadow-sm" 
              style={{ backgroundColor: post.category?.color || '#475569', color: '#fff' }}
            >
              {post.category?.label || "Uncategorized"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-slate-200 mb-4 whitespace-pre-wrap line-clamp-4">{post.description}</p>
          <div className="text-xs text-slate-400 space-y-2">
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
        <CardFooter className="mt-auto">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleContact();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
          >
            <Mail size={16} className="mr-2" />
            Entrar em Contato
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-slate-800 border border-slate-700 max-w-xl text-white">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-white">{post.companyName}</DialogTitle>
              <Badge 
                style={{ backgroundColor: post.category?.color || '#475569', color: '#fff' }}
              >
                {post.category?.label || "Uncategorized"}
              </Badge>
            </div>
            <DialogDescription className="text-slate-300">
              Publicado por {post.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-200 mb-2">Descrição:</h3>
              <p className="text-slate-300 whitespace-pre-wrap">{post.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-200 mb-2">Informações de Contato:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail size={16} />
                    <span>{post.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={16} />
                    <span>{post.phone}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-2">Datas:</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar size={16} />
                    <span>Publicado: {format(new Date(post.createdAt), "dd MMM yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock size={16} />
                    <span>Expira: {format(new Date(post.expiresAt), "dd MMM yyyy")}</span>
                  </div>
                  <p className="text-slate-200 font-semibold">Expira em: {daysRemaining()} dias</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button 
              onClick={handleContact}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg"
            >
              <Mail size={16} className="mr-2" />
              Entrar em Contato
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostIt;
