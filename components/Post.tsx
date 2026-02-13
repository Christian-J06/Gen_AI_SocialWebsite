'use client'

import { motion } from 'framer-motion'
import { ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { votePost } from '@/app/actions'

export function Post({ post, currentUserId }: { post: any; currentUserId?: string }) {
    const [optimisticVote, setOptimisticVote] = useState(post.user_vote || null)
    const [score, setScore] = useState(post.score || 0)

    const handleVote = async (type: 'up' | 'down') => {
        if (!currentUserId) return // Redirect to login?

        const previousVote = optimisticVote
        const previousScore = score

        // Optimistic update
        if (optimisticVote === type) {
            // Toggle off
            setOptimisticVote(null)
            setScore(score - (type === 'up' ? 1 : -1))
        } else {
            // Toggle on or switch
            const diff = optimisticVote ? 2 : 1
            setScore(score + (type === 'up' ? diff : -diff))
            setOptimisticVote(type)
        }

        try {
            await votePost(post.id, type)
        } catch (e) {
            // Revert
            setOptimisticVote(previousVote)
            setScore(previousScore)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm"
        >
            <div className="flex">
                {/* Vote Column */}
                <div className="flex w-12 flex-col items-center bg-black/20 py-4">
                    <button
                        onClick={() => handleVote('up')}
                        className={clsx(
                            'rounded-lg p-1 transition-colors hover:bg-white/5',
                            optimisticVote === 'up' ? 'text-orange-500' : 'text-zinc-500'
                        )}
                    >
                        <ArrowBigUp className={clsx('h-6 w-6', optimisticVote === 'up' && 'fill-current')} />
                    </button>
                    <span className="py-1 text-sm font-bold text-white">{score}</span>
                    <button
                        onClick={() => handleVote('down')}
                        className={clsx(
                            'rounded-lg p-1 transition-colors hover:bg-white/5',
                            optimisticVote === 'down' ? 'text-purple-500' : 'text-zinc-500'
                        )}
                    >
                        <ArrowBigDown className={clsx('h-6 w-6', optimisticVote === 'down' && 'fill-current')} />
                    </button>
                </div>

                {/* Content Column */}
                <div className="flex-1 p-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="font-medium text-white hover:underline cursor-pointer">
                            @{post.profiles?.username || 'unknown'}
                        </span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-2 text-zinc-100 whitespace-pre-wrap">
                        {post.content}
                    </div>

                    <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
                        <button className="flex items-center gap-2 rounded-lg py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-white">
                            <MessageSquare className="h-4 w-4" />
                            Comments
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
