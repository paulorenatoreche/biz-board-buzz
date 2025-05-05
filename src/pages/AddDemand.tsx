
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const AddDemand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    description: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    try {
      // Generate a unique ID for the post
      const postId = uuidv4();
      
      // Create the new post object with all required fields
      const newPost = {
        id: postId,
        fullName: formData.fullName,
        companyName: formData.companyName,
        description: formData.description,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };
      
      // Get existing posts from localStorage
      const existingPostsJSON = localStorage.getItem('bulletinPosts');
      const existingPosts = existingPostsJSON ? JSON.parse(existingPostsJSON) : [];
      
      // Add new post to the array
      const updatedPosts = [newPost, ...existingPosts];
      
      // Save back to localStorage
      localStorage.setItem('bulletinPosts', JSON.stringify(updatedPosts));
      
      // Send email notification to admin
      try {
        // Email service implementation (client-side only implementation)
        const emailData = {
          to: "paulo.renato.reche@gmail.com",
          subject: `New Business Opportunity: ${formData.companyName}`,
          body: `
            A new business opportunity has been posted:
            
            Company: ${formData.companyName}
            Contact: ${formData.fullName}
            Email: ${formData.email}
            Phone: ${formData.phone}
            
            Description:
            ${formData.description}
            
            Expires: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          `
        };
        
        // Using window.open to create a mailto link (this is a client-side approach)
        // This will open the user's email client with a pre-filled email
        window.open(`mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`, '_blank');
        
        toast.success("Your business opportunity has been posted!");
        toast.info("Please send the notification email from your email client");
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
        // Still show success for the post creation even if email fails
        toast.success("Your business opportunity has been posted!");
        toast.error("Admin notification could not be sent automatically");
      }
      
      // Navigate back to the bulletin board
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create your post. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="bg-white">
          <CardHeader>
            <h1 className="text-2xl font-bold text-center">Post a Business Opportunity</h1>
            <p className="text-gray-600 text-center">Share your business needs with potential partners</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <Input
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (max 300 words)
                </label>
                <Textarea
                  required
                  value={formData.description}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).length;
                    if (words <= 300) {
                      setFormData({ ...formData, description: e.target.value });
                    }
                  }}
                  className="h-32"
                  placeholder="Describe the business opportunity..."
                />
              </div>
              <div className="flex gap-4 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isSending}
                >
                  {isSending ? "Posting..." : "Post Opportunity"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDemand;
