import { useEffect, useState } from "react";
import PostIt from "./PostIt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/pages/AddDemand";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

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

const MOCK_POSTS = [
  {
    id: "1",
    fullName: "John Smith",
    companyName: "Tech Innovations Ltd",
    description: "Looking for software development partners for a new fintech solution. Experience in payment processing required.",
    email: "john@example.com",
    phone: "123-456-7890",
    category: {
      value: "electrical-project",
      label: "Electrical Project",
      color: "#FEF7CD"
    },
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const BulletinBoard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Effect to load posts from localStorage
  useEffect(() => {
    const loadPosts = () => {
      // Retrieve posts from localStorage
      const storedPosts = localStorage.getItem('bulletinPosts');
      
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // Initialize with mock data if no posts are stored
        setPosts(MOCK_POSTS);
        localStorage.setItem('bulletinPosts', JSON.stringify(MOCK_POSTS));
      }
    };

    // Load posts initially
    loadPosts();

    // Set interval to check for expired posts every minute
    const interval = setInterval(() => {
      const storedPosts = localStorage.getItem('bulletinPosts');
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts);
        
        // Filter out expired posts
        const now = new Date();
        const validPosts = parsedPosts.filter((post: Post) => {
          const expiryDate = new Date(post.expiresAt);
          return expiryDate > now;
        });
        
        // If some posts expired, update localStorage and state
        if (validPosts.length < parsedPosts.length) {
          localStorage.setItem('bulletinPosts', JSON.stringify(validPosts));
          setPosts(validPosts);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Filter out expired posts for rendering
  const validPosts = posts.filter(post => {
    const expiryDate = new Date(post.expiresAt);
    return expiryDate > new Date();
  });

  // Apply search and category filters
  const filteredPosts = validPosts.filter(post => {
    const matchesSearch = 
      searchTerm === "" || 
      post.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.label.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || 
      post.category.value === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryClick = (categoryValue: string) => {
    if (selectedCategory === categoryValue) {
      setSelectedCategory(null); // Toggle off if already selected
    } else {
      setSelectedCategory(categoryValue);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
  };

  return (
    <div className="relative">
      {/* Caixa de pesquisa e filtros - posicionada sobre a linha divisória */}
      <div className="relative -top-8 mb-8 z-40">
        <div className="bg-white/95 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20 mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 h-12 rounded-lg shadow-sm"
                placeholder="Pesquisar oportunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {(searchTerm || selectedCategory) && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="bg-white/80 backdrop-blur-sm border-gray-300 text-gray-700 hover:bg-white hover:scale-105 transition-all duration-200 h-12 rounded-lg shadow-sm"
              >
                <Filter size={16} className="mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map((category, index) => {
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
                  className={`cursor-pointer transition-all hover:scale-105 border shadow-sm rounded-lg ${
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
      
      {/* Conteúdo dos posts */}
      <div className="space-y-6 pb-12">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <PostIt key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-gray-200 max-w-md mx-auto">
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