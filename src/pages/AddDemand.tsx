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
import { ArrowLeft, Handshake, HandCoins } from "lucide-react";

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
  { value: "other", label: "Outro", color: "#E5E7EB" },
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  description: string;
  category: string;
  customCategory: string;
}

const AddDemand = () => {
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

  const selectedCategory = form.watch("category");

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
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
      {/* Header section */}
      <div className="relative z-10 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-white hover:bg-white/10 hover:scale-105 p-2 rounded-lg"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex items-center gap-3">
              <HandCoins style={{ color: 'white' }} size={32} />
              <h1 className="text-3xl md:text-4xl font-bold">Adicionar Oportunidade</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="relative z-10 px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <h2 className="text-xl font-semibold text-gray-800">Compartilhe sua necessidade de negócio</h2>
              <p className="text-gray-600">Conecte-se com potenciais parceiros</p>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Nome Completo</FormLabel>
                        <FormControl>
                          <Input 
                            required 
                            {...field} 
                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg"
                            placeholder="Digite seu nome completo"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Telefone</FormLabel>
                        <FormControl>
                          <Input 
                            required 
                            type="tel" 
                            {...field} 
                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg"
                            placeholder="(11) 99999-9999"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Email</FormLabel>
                        <FormControl>
                          <Input 
                            required 
                            type="email" 
                            {...field} 
                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg"
                            placeholder="seuemail@empresa.com"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input 
                            required 
                            {...field} 
                            className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg"
                            placeholder="Nome da sua empresa"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Categoria do Serviço</FormLabel>
                        <Select 
                          onValueChange={handleCategoryChange} 
                          defaultValue={field.value}
                          required
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg">
                              <SelectValue placeholder="Selecione uma categoria" />
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

                  {showCustomCategory && (
                    <FormField
                      control={form.control}
                      name="customCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold">Categoria Personalizada</FormLabel>
                          <FormControl>
                            <Input 
                              required={selectedCategory === "other"}
                              {...field} 
                              className="bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 h-12 rounded-lg"
                              placeholder="Digite sua categoria personalizada"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold">Descrição (máx. 300 palavras)</FormLabel>
                        <FormControl>
                          <Textarea
                            required
                            className="h-32 bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-lg resize-none"
                            placeholder="Descreva detalhadamente a oportunidade de negócio, requisitos específicos e expectativas..."
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
                  
                  <div className="flex gap-4 justify-end pt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate("/")}
                      className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 h-12 px-6 rounded-lg shadow-sm"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="text-white border-0 shadow-lg hover:shadow-xl hover:scale-105 h-12 px-8 rounded-lg font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, rgb(60, 71, 157), rgb(45, 55, 135))'
                      }}
                      disabled={isSending}
                    >
                      {isSending ? "Publicando..." : "Publicar Oportunidade"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddDemand;
