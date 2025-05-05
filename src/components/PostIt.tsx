
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

interface Post {
  id: string;
  fullName: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
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

  return (
    <>
      <Card 
        className="bg-[#FEF7CD] hover:shadow-lg transition-shadow duration-200 border-4 border-amber-300 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-2">
          <h3 className="font-bold text-gray-800">{post.companyName}</h3>
          <p className="text-sm text-gray-600">{post.fullName}</p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap line-clamp-4">{post.description}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Posted: {format(new Date(post.createdAt), "MMM d, yyyy")}</p>
            <p>Expires: {format(new Date(post.expiresAt), "MMM d, yyyy")}</p>
          </div>
        </CardContent>
        <CardFooter>
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
        <DialogContent className="bg-[#FEF7CD] border-4 border-amber-300 max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-800">{post.companyName}</DialogTitle>
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
