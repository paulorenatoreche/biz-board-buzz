
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

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
  const handleContact = () => {
    window.location.href = `mailto:${post.email}?subject=Business Opportunity Response`;
  };

  return (
    <Card className="bg-[#FEF7CD] hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <h3 className="font-bold text-gray-800">{post.companyName}</h3>
        <p className="text-sm text-gray-600">{post.fullName}</p>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.description}</p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>Posted: {format(new Date(post.createdAt), "MMM d, yyyy")}</p>
          <p>Expires: {format(new Date(post.expiresAt), "MMM d, yyyy")}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleContact}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Contact Advertiser
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostIt;
