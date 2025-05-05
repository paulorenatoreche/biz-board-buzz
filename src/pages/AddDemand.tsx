import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Service categories with their tag colors
export const SERVICE_CATEGORIES = [
  { value: "civil-project", label: "Projeto Civil", color: "#F2FCE2" },
  { value: "electrical-project", label: "Projeto Elétrico", color: "#FEF7CD" },
  { value: "electrical-studies", label: "Estudos Elétricos", color: "#FEC6A1" },
  { value: "environmental-services", label: "Serviços Ambientais", color: "#E5DEFF" },
  { value: "engineering-consulting", label: "Consultoria em Engenharia", color: "#FFDEE2" },
  { value: "equipment", label: "Equipamentos", color: "#FDE1D3" },
  { value: "o-and-m", label: "O&M", color: "#D3E4FD" },
  { value: "training-courses", label: "Treinamentos & Cursos", color: "#F1F0FB" },
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  description: string;
  category: string;
}

const AddDemand = () => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      description: "",
      category: "",
    }
  });

  const handleSubmit = async (data: FormData) => {
    setIsSending(true);
    
    try {
      // Generate a unique ID for the post
      const postId = uuidv4();
      
      // Find the selected category object
      const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === data.category);
      
      // Create the new post object with all required fields
      const newPost = {
        id: postId,
        fullName: data.fullName,
        companyName: data.companyName,
        description: data.description,
        email: data.email,
        phone: data.phone,
        category: {
          value: data.category,
          label: selectedCategory?.label || "",
          color: selectedCategory?.color || "#F1F0FB",
        },
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
      
      // Instead of opening an email client, we'll save an admin notification in localStorage
      const adminNotifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      adminNotifications.push({
        id: uuidv4(),
        postId: postId,
        timestamp: new Date().toISOString(),
        read: false,
        post: newPost
      });
      localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
      
      toast.success("Your business opportunity has been posted!");
      
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input required type="tel" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input required type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input required {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SERVICE_CATEGORIES.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (max 300 words)</FormLabel>
                      <FormControl>
                        <Textarea
                          required
                          className="h-32"
                          placeholder="Describe the business opportunity..."
                          {...field}
                          onChange={e => {
                            const words = e.target.value.trim().split(/\s+/).length;
                            if (words <= 300) {
                              field.onChange(e);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
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
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDemand;
