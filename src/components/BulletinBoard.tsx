import { useEffect, useState } from "react";
import PostIt from "./PostIt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/utils/serviceCategories";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { getPosts, Post as SupabasePost, initializeDatabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Category {
  value: string;
  label: string;
  color: string;
}

// Local interface for the component's internal use
interface LocalPost {
  id: string;
  fullName: string;
  companyName: string;
  description: string;
  email: string;
  phone: string;
  category: Category;
  createdAt: string;
  expiresAt: string;
  creatorId?: string;
}

const BulletinBoard = () => {
  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>(SERVICE_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Function to get unique categories from posts
  const getUniqueCategories = (posts: SupabasePost[]) => {
    const customCategories: Category[] = [];
    const usedValues = new Set(SERVICE_CATEGORIES.map(cat => cat.value));

    posts.forEach(post => {
      if (!usedValues.has(post.category_value)) {
        customCategories.push({
          value: post.category_value,
          label: post.category_label,
          color: post.category_color
        });
        usedValues.add(post.category_value);
      }
    });

    return [...SERVICE_CATEGORIES, ...customCategories];
  };

  // Function to convert Supabase post to local post format
  const convertSupabasePost = (supabasePost: SupabasePost): LocalPost => {
    return {
      id: supabasePost.id,
      fullName: supabasePost.full_name,
      companyName: supabasePost.company_name,
      description: supabasePost.description,
      email: supabasePost.email,
      phone: supabasePost.phone,
      category: {
        value: supabasePost.category_value,
        label: supabasePost.category_label,
        color: supabasePost.category_color
      },
      createdAt: supabasePost.created_at,
      expiresAt: supabasePost.expires_at,
      creatorId: supabasePost.creator_id
    };
  };

  // Effect to load posts from Supabase
  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      try {
        // Initialize database first
        await initializeDatabase();
        
        // Get posts from Supabase
        const supabasePosts = await getPosts();
        
        // Convert to local format
        const convertedPosts = supabasePosts.map(convertSupabasePost);
        
        setPosts(convertedPosts);
        setAllCategories(getUniqueCategories(supabasePosts));
      } catch (error) {
        console.error('Error loading posts:', error);
        toast.error('Erro ao carregar posts. Tentando novamente...');
        
        // Fallback to localStorage if Supabase fails
        const storedPosts = localStorage.getItem('bulletinPosts');
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts);
          setPosts(parsedPosts);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  // Filter out expired posts for rendering
  const validPosts = posts.filter(post => {
    const expiryDate = new Date(post.expiresAt);
    return expiryDate > new Date();
  });

  // Apply search filter first (without category filter)
  const searchFilteredPosts = validPosts.filter(post => {
    return searchTerm === "" || 
      post.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Get categories that should be displayed based on search results
  const displayCategories = allCategories.filter(category => {
    if (category.value === "other") return false;
    
    // If no search term, show all categories
    if (searchTerm === "") return true;
    
    // Show only categories that have posts matching the search
    return searchFilteredPosts.some(post => post.category.value === category.value);
  });

  // Apply both search and category filters for final results
  const filteredPosts = searchFilteredPosts.filter(post => {
    const matchesCategory = 
      selectedCategory === null || 
      post.category.value === selectedCategory;
    
    return matchesCategory;
  });

  const handleCategoryClick = (categoryValue: string) => {
    if (selectedCategory === categoryValue) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryValue);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  const handlePostDelete = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  const refreshPosts = async () => {
    try {
      const supabasePosts = await getPosts();
      const convertedPosts = supabasePosts.map(convertSupabasePost);
      setPosts(convertedPosts);
      setAllCategories(getUniqueCategories(supabasePosts));
    } catch (error) {
      console.error('Error refreshing posts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        <div className="relative -top-8 mb-8 z-40">
          <div className="bg-white p-6 rounded-xl shadow-2xl border border-white/20 mx-auto max-w-4xl">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando oportunidades...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Search box and filters */}
      <div className="relative -top-8 mb-8 z-40">
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-white/20 mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-10 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-12 rounded-lg shadow-sm"
                placeholder="Pesquisar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {(searchTerm || selectedCategory) && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100 hover:scale-105  h-12 rounded-lg shadow-sm"
              >
                <Filter size={16} className="mr-2" />
                Limpar Filtros
              </Button>
            )}
            <Button 
              onClick={refreshPosts}
              className="bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 h-12 rounded-lg shadow-sm"
            >
              Atualizar
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {displayCategories.map((category, index) => {
                const colors = [
                  'bg-blue-100 text-blue-700 border-blue-200',
                  'bg-green-100 text-green-700 border-green-200',
                  'bg-purple-100 text-purple-700 border-purple-200',
                  'bg-orange-100 text-orange-700 border-orange-200',
                  'bg-pink-100 text-pink-700 border-pink-200',
                  'bg-indigo-100 text-indigo-700 border-indigo-200',
                  'bg-yellow-100 text-yellow-700 border-yellow-200',
                  'bg-red-100 text-red-700 border-red-200'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Badge
                    key={category.value}
                    className={`cursor-pointer transition-all hover:scale-105 hover:bg-gray-200 border shadow-sm rounded-lg ${
                      selectedCategory === category.value 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                        : colorClass
                    }`}
                    onClick={() => handleCategoryClick(category.value)}
                  >
                    {category.label}
                  </Badge>
                );
              })}
          </div>
        </div>
      </div>
      
      {/* Posts content */}
      <div className="space-y-6 pb-12">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <PostIt 
                key={post.id} 
                post={post} 
                onDelete={handlePostDelete}
                onUpdate={refreshPosts}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma oportunidade encontrada</h3>
              <p className="text-gray-500">Tente ajustar os filtros de pesquisa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulletinBoard;
