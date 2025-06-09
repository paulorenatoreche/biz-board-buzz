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

// Define the Notification type
export interface Notification {
  id: string
  post_id: string
  message: string
  read: boolean
  created_at: string
}

// Function to create the posts table if it doesn't exist
export const createPostsTable = async () => {
  const { error } = await supabase.rpc('create_posts_table')
  if (error) {
    console.log('Posts table might already exist or there was an error:', error)
  }
}

// Function to create the notifications table if it doesn't exist
export const createNotificationsTable = async () => {
  const { error } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
  })

  if (error) {
    console.log('Note: Notifications table creation might need to be done manually in Supabase SQL Editor')
  }
}

// Function to get all posts
export const getPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  return data || []
}

// Function to create a new post
export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post | null> => {
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
    console.error('Error creating post:', error)
    return null
  }

  // Create notification when post is created
  if (data) {
    await createNotification(data.id, `Novo post criado: ${data.company_name}`)
  }

  return data
}

// Function to create a notification
export const createNotification = async (postId: string, message: string): Promise<Notification | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{
      post_id: postId,
      message: message
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating notification:', error)
    return null
  }

  return data
}

// Function to get unread notifications
export const getUnreadNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('read', false)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

// Function to mark notification as read
export const markNotificationAsRead = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)

  if (error) {
    console.error('Error marking notification as read:', error)
    return false
  }

  return true
}

// Function to mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('read', false)

  if (error) {
    console.error('Error marking all notifications as read:', error)
    return false
  }

  return true
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
  // First, let's try to create the table manually
  const { error } = await supabase.rpc('exec', {
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
  })

  if (error) {
    console.log('Note: Table creation might need to be done manually in Supabase SQL Editor')
  }

  // Also create notifications table
  await createNotificationsTable()
}
