
import { useEffect, useState } from "react";
import PostIt from "./PostIt";

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

const MOCK_POSTS = [
  {
    id: "1",
    fullName: "John Smith",
    companyName: "Tech Innovations Ltd",
    description: "Looking for software development partners for a new fintech solution. Experience in payment processing required.",
    email: "john@example.com",
    phone: "123-456-7890",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const BulletinBoard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Retrieve posts from localStorage
    const storedPosts = localStorage.getItem('bulletinPosts');
    
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      // Initialize with mock data if no posts are stored
      setPosts(MOCK_POSTS);
      localStorage.setItem('bulletinPosts', JSON.stringify(MOCK_POSTS));
    }
  }, []);

  // Filter out expired posts
  const validPosts = posts.filter(post => {
    const expiryDate = new Date(post.expiresAt);
    return expiryDate > new Date();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {validPosts.map((post) => (
        <PostIt key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BulletinBoard;
