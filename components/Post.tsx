'use client'

import { motion } from 'framer-motion'
import { ArrowBigUp, ArrowBigDown, MessageSquare, Flame, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { votePost } from '@/app/actions'

export function Post({ post, currentUserId }: { post: any; currentUserId?: string }) {
    const [optimisticVote, setOptimisticVote] = useState(post.user_vote || null)
    const [score, setScore] = useState(post.score || 0)
    const [roast, setRoast] = useState<string | null>(null)
    const [isRoasting, setIsRoasting] = useState(false)

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

    const handleRoast = async () => {
        if (isRoasting) return
        setIsRoasting(true)
        setRoast(null)

        try {
            const response = await fetch('/api/roast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: post.content }),
            })

            const data = await response.json()
            if (data.roast) {
                setRoast(data.roast)
            } else {
                setRoast("Even the AI is speechless at this take.")
            }
        } catch (error) {
            console.error("Roasting error:", error)
            setRoast("The roast was too hot for the server to handle.")
        } finally {
            setIsRoasting(false)
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
                        <button
                            onClick={handleRoast}
                            disabled={isRoasting}
                            className={clsx(
                                "flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium transition-all",
                                isRoasting ? "bg-orange-500/20 text-orange-300" : "text-zinc-400 hover:bg-orange-500/10 hover:text-orange-400"
                            )}
                        >
                            {isRoasting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Flame className="h-4 w-4" />
                            )}
                            Roast My Take
                        </button>
                    </div>

                    {roast && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 rounded-xl bg-orange-500/10 border border-orange-500/20 p-4"
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 rounded-full bg-orange-500/20 p-1">
                                    <Flame className="h-3 w-3 text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-orange-400 mb-1">AI Roast</p>
                                    <p className="text-sm italic text-zinc-300 leading-relaxed">
                                        "{roast}"
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
