import { createClient } from '@/utils/supabase/server'
import { Post } from '@/components/Post'
import { createPost } from './actions'
import { SendHorizontal } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (username),
      votes (vote_type, user_id)
    `)
    .order('created_at', { ascending: false })

  const processedPosts = posts?.map(post => {
    const upvotes = post.votes.filter((v: any) => v.vote_type === 'up').length
    const downvotes = post.votes.filter((v: any) => v.vote_type === 'down').length
    const userVote = user ? post.votes.find((v: any) => v.user_id === user.id)?.vote_type : null

    return {
      ...post,
      score: upvotes - downvotes,
      user_vote: userVote
    }
  })

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {user && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 p-4 backdrop-blur-sm">
          <form action={createPost} className="relative">
            <textarea
              name="content"
              placeholder="What's on your mind?"
              className="w-full resize-none bg-transparent text-lg text-white placeholder-zinc-500 focus:outline-none"
              rows={3}
              required
            />
            <div className="mt-2 flex justify-end border-t border-white/5 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 active:opacity-100"
              >
                <SendHorizontal className="h-4 w-4" />
                Post
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {processedPosts?.map((post) => (
          <Post key={post.id} post={post} currentUserId={user?.id} />
        ))}
        {(!processedPosts || processedPosts.length === 0) && (
          <div className="text-center text-zinc-500 py-10">
            No posts yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  )
}
