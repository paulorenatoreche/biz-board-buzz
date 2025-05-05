
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

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
        className="bg-[#FEF7CD] hover:shadow-lg transition-shadow duration-200 border-4 border-amber-500 cursor-pointer shadow-md flex flex-col h-full relative"
        onClick={() => setShowDetails(true)}
      >
        {/* Metal Clip Design */}
        <div className="absolute w-12 h-4 bg-gray-400 rounded-b-md top-0 left-1/2 transform -translate-x-1/2 z-10 shadow-md" 
          style={{ 
            background: 'linear-gradient(to bottom, #8E9196, #D1D3D4)',
            borderBottom: '1px solid #666',
            borderLeft: '1px solid #666',
            borderRight: '1px solid #666'
          }} 
        />
        
        <CardHeader className="pb-2 mt-3"> {/* Added margin-top to account for the clip */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800">{post.companyName}</h3>
              <p className="text-sm text-gray-600">{post.fullName}</p>
            </div>
            <Badge 
              className="ml-2" 
              style={{ backgroundColor: post.category?.color || '#F1F0FB', color: '#333' }}
            >
              {post.category?.label || "Uncategorized"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-gray-700 mb-4 whitespace-pre-wrap line-clamp-4">{post.description}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Posted: {format(new Date(post.createdAt), "MMM d, yyyy")}</p>
            <p>Expires in: {daysRemaining()} days</p>
          </div>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              handleContact();
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Contact Advertiser
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-[#FEF7CD] border-4 border-amber-500 max-w-xl relative">
          {/* Metal Clip Design for Dialog */}
          <div className="absolute w-16 h-5 bg-gray-400 rounded-b-md top-0 left-1/2 transform -translate-x-1/2 z-10 shadow-md" 
            style={{ 
              background: 'linear-gradient(to bottom, #8E9196, #D1D3D4)',
              borderBottom: '1px solid #666',
              borderLeft: '1px solid #666',
              borderRight: '1px solid #666'
            }} 
          />
          
          <DialogHeader className="mt-4"> {/* Added margin-top to account for the clip */}
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold text-gray-800">{post.companyName}</DialogTitle>
              <Badge 
                style={{ backgroundColor: post.category?.color || '#F1F0FB', color: '#333' }}
              >
                {post.category?.label || "Uncategorized"}
              </Badge>
            </div>
            <DialogDescription className="text-gray-600">
              Posted by {post.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-700">Description:</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{post.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700">Contact Information:</h3>
                <p className="text-gray-700">Email: {post.email}</p>
                <p className="text-gray-700">Phone: {post.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Dates:</h3>
                <p className="text-gray-700">Posted: {format(new Date(post.createdAt), "MMM d, yyyy")}</p>
                <p className="text-gray-700">Expires: {format(new Date(post.expiresAt), "MMM d, yyyy")}</p>
                <p className="text-gray-700 font-semibold">Expires in: {daysRemaining()} days</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button 
              onClick={handleContact}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Contact Advertiser
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostIt;
