
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { FormData, SERVICE_CATEGORIES } from "@/utils/serviceCategories";
import PersonalInfoFields from "./PersonalInfoFields";
import CategoryFields from "./CategoryFields";
import DescriptionField from "./DescriptionField";
import FormActions from "./FormActions";

const AddDemandForm = () => {
  const navigate = useNavigate();
  const [isSending, setIsSending] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      companyName: "",
      description: "",
      category: "",
      customCategory: "",
    }
  });

  const handleCategoryChange = (value: string) => {
    form.setValue("category", value);
    if (value === "other") {
      setShowCustomCategory(true);
    } else {
      setShowCustomCategory(false);
      form.setValue("customCategory", "");
    }
  };

  const handleSubmit = async (data: FormData) => {
    setIsSending(true);
    
    try {
      // Generate a unique ID for the post
      const postId = uuidv4();
      
      // Handle custom category
      let finalCategory;
      if (data.category === "other" && data.customCategory.trim()) {
        finalCategory = {
          value: `custom-${data.customCategory.toLowerCase().replace(/\s+/g, '-')}`,
          label: data.customCategory.trim(),
          color: "#E5E7EB",
        };
      } else {
        // Find the selected category object
        const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === data.category);
        finalCategory = {
          value: data.category,
          label: selectedCategory?.label || "",
          color: selectedCategory?.color || "#F1F0FB",
        };
      }
      
      // Create the new post object with all required fields
      const newPost = {
        id: postId,
        fullName: data.fullName,
        companyName: data.companyName,
        description: data.description,
        email: data.email,
        phone: data.phone,
        category: finalCategory,
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
      
      toast.success("Sua oportunidade de negócio foi publicada!");
      
      // Navigate back to the bulletin board
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Falha ao criar sua publicação. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative z-10 px-4 pb-12 w-full">
      <div className="container mx-auto max-w-2xl w-full">
        <Card className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl w-full">
          <CardHeader className="text-center pb-6">
            <h2 className="text-xl font-semibold text-gray-800">Compartilhe sua necessidade de negócio</h2>
            <p className="text-gray-600">Conecte-se com potenciais parceiros</p>
          </CardHeader>
          <CardContent className="px-6 sm:px-8 pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
                <PersonalInfoFields form={form} />
                <CategoryFields 
                  form={form} 
                  showCustomCategory={showCustomCategory}
                  onCategoryChange={handleCategoryChange}
                />
                <DescriptionField form={form} />
                <FormActions isSending={isSending} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDemandForm;
