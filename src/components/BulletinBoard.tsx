
import PostIt from "./PostIt";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MOCK_POSTS.map((post) => (
        <PostIt key={post.id} post={post} />
      ))}
    </div>
  );
};

export default BulletinBoard;
