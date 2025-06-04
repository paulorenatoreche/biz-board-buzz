
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
        className="bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl border border-gray-200 cursor-pointer shadow-md flex flex-col h-full hover:scale-[1.02]"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3 bg-slate-700 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-white text-lg">{post.companyName}</h3>
              <p className="text-sm text-blue-100">{post.fullName}</p>
            </div>
            <Badge 
              className="ml-2 shadow-sm bg-white/20 text-white border-white/30 hover:bg-white/30" 
            >
              {post.category?.label || "Uncategorized"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow bg-white">
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
        <CardFooter className="mt-auto bg-white">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleContact();
            }}
            className="w-full bg-slate-500 hover:bg-blue-700 text-white border-0 shadow-lg"
          >
            <Mail size={16} className="mr-2" />
            Entrar em Contato
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-white border border-gray-300 max-w-xl text-gray-900">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-900">{post.companyName}</DialogTitle>
              <Badge 
                className="bg-blue-100 text-blue-700 border-blue-200"
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
