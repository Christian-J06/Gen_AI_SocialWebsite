'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
    const supabase = await createClient()
    const content = formData.get('content') as string

    if (!content) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Get profile id
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()

    await supabase.from('posts').insert({
        user_id: profile?.id,
        content,
    })

    revalidatePath('/')
}

export async function votePost(postId: string, type: 'up' | 'down') {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Check if vote exists
    const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .single()

    if (existingVote) {
        if (existingVote.vote_type === type) {
            // Remove vote
            await supabase.from('votes').delete().eq('id', existingVote.id)
        } else {
            // Toggle vote
            await supabase.from('votes').update({ vote_type: type }).eq('id', existingVote.id)
        }
    } else {
        // Create vote
        await supabase.from('votes').insert({
            user_id: user.id,
            post_id: postId,
            vote_type: type,
        })
    }
}
