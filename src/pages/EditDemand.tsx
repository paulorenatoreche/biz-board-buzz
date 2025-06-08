import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ArrowLeft, Edit } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/utils/serviceCategories";

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  description: string;
  category: string;
}

const EditDemand = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [postFound, setPostFound] = useState(true);
  
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

  useEffect(() => {
    // Load the post data from localStorage
    const existingPostsJSON = localStorage.getItem('bulletinPosts');
    if (existingPostsJSON) {
      const existingPosts = JSON.parse(existingPostsJSON);
      const postToEdit = existingPosts.find((post: any) => post.id === id);
      
      if (postToEdit) {
        form.reset({
          fullName: postToEdit.fullName,
          phone: postToEdit.phone,
          email: postToEdit.email,
          companyName: postToEdit.companyName,
          description: postToEdit.description,
          category: postToEdit.category.value,
        });
      } else {
        setPostFound(false);
      }
    } else {
      setPostFound(false);
    }
  }, [id, form]);

  const handleSubmit = async (data: FormData) => {
    setIsUpdating(true);
    
    try {
      // Get existing posts from localStorage
      const existingPostsJSON = localStorage.getItem('bulletinPosts');
      if (!existingPostsJSON) {
        toast.error("Erro ao encontrar a oportunidade.");
        return;
      }
      
      const existingPosts = JSON.parse(existingPostsJSON);
      const postIndex = existingPosts.findIndex((post: any) => post.id === id);
      
      if (postIndex === -1) {
        toast.error("Oportunidade não encontrada.");
        return;
      }
      
      // Find the selected category object
      const selectedCategory = SERVICE_CATEGORIES.find(cat => cat.value === data.category);
      
      // Update the post
      existingPosts[postIndex] = {
        ...existingPosts[postIndex],
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
      };
      
      // Save back to localStorage
      localStorage.setItem('bulletinPosts', JSON.stringify(existingPosts));
      
      toast.success("Oportunidade atualizada com sucesso!");
      
      // Navigate back to the home page
      navigate("/");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Falha ao atualizar a oportunidade. Tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!postFound) {
    return (
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgb(60, 71, 157) 0%, rgb(45, 55, 135) 50%, rgb(30, 40, 115) 100%)' }}>
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
              <h1 className="text-3xl md:text-4xl font-bold">Oportunidade não encontrada</h1>
            </div>
            <div className="text-center">
              <p className="text-white/80 mb-4">A oportunidade que você está tentando editar não foi encontrada.</p>
              <Button
                onClick={() => navigate("/")}
                className="bg-white text-blue-600 hover:bg-white/90"
              >
                Voltar ao Hub
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Edit style={{ color: 'white' }} size={32} />
              <h1 className="text-3xl md:text-4xl font-bold">Editar Oportunidade</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Form section */}
      <div className="relative z-10 px-4 pb-12">
        <div className="container mx-auto max-w-2xl">
          <Card className="bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <h2 className="text-xl font-semibold text-gray-800">Atualize as informações da oportunidade</h2>
              <p className="text-gray-600">Mantenha suas informações sempre atualizadas</p>
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
                          onValueChange={field.onChange} 
                          value={field.value}
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
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Atualizando..." : "Atualizar Oportunidade"}
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

export default EditDemand;
