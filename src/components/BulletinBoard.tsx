
import { useEffect, useState } from "react";
import PostIt from "./PostIt";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/pages/AddDemand";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

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
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-9"
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {(searchTerm || selectedCategory) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {SERVICE_CATEGORIES.map((category) => (
            <Badge
              key={category.value}
              className="cursor-pointer"
              style={{ 
                backgroundColor: category.color, 
                color: '#333',
                border: selectedCategory === category.value ? '2px solid #333' : 'none'
              }}
              onClick={() => handleCategoryClick(category.value)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
      </div>
      
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostIt key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700">No opportunities found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default BulletinBoard;
