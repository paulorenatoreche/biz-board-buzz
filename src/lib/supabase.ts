
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://imntrqfsmcbsbtpjndmm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltbnRycWZzbWNic2J0cGpuZG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0ODcwMzYsImV4cCI6MjA2NTA2MzAzNn0.F8eOCYqyuSE2-uF922sahUiaaNDKDn6JLSupmwJ55es'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define the Post type for TypeScript
export interface Post {
  id: string
  full_name: string
  company_name: string
  description: string
  email: string
  phone: string
  category_value: string
  category_label: string
  category_color: string
  created_at: string
  expires_at: string
  creator_id?: string
}

// Function to create the posts table if it doesn't exist
export const createPostsTable = async () => {
  const { error } = await supabase.rpc('create_posts_table')
  if (error) {
    console.log('Posts table might already exist or there was an error:', error)
  }
}

// Function to get all posts
export const getPosts = async (): Promise<Post[]> => {
  console.log('Fetching posts from Supabase...');
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  console.log('Posts fetched successfully:', data?.length || 0, 'posts');
  return data || []
}

// Function to create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post | null> => {
  console.log('Creating post in Supabase:', post);
  
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        full_name: post.full_name,
        company_name: post.company_name,
        description: post.description,
        email: post.email,
        phone: post.phone,
        category_value: post.category_value,
        category_label: post.category_label,
        category_color: post.category_color,
        expires_at: post.expires_at,
        creator_id: post.creator_id
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating post:', error);
      return null
    }

    console.log('Post created successfully in Supabase:', data);
    return data
  } catch (err) {
    console.error('Network or other error creating post:', err);
    return null
  }
}

// Function to update a post
export const updatePost = async (id: string, updates: Partial<Post>): Promise<Post | null> => {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    return null
  }

  return data
}

// Function to delete a post
export const deletePost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting post:', error)
    return false
  }

  return true
}

// Function to initialize the database
export const initializeDatabase = async () => {
  console.log('Initializing database...');
  
  // First check if the table exists by trying to fetch from it
  const { data, error: selectError } = await supabase
    .from('posts')
    .select('id')
    .limit(1)
  
  if (selectError) {
    console.log('Table does not exist, trying to create it:', selectError.message);
    
    // Try to create the table using raw SQL
    const { error: createError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          full_name TEXT NOT NULL,
          company_name TEXT NOT NULL,
          description TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          category_value TEXT NOT NULL,
          category_label TEXT NOT NULL,
          category_color TEXT NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          creator_id TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createError) {
      console.error('Error creating table:', createError);
      console.log('You may need to create the table manually in the Supabase SQL Editor');
    } else {
      console.log('Table created successfully');
    }
  } else {
    console.log('Posts table already exists');
  }
}
