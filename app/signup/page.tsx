'use client'

import { signup } from '../login/actions'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white selection:bg-purple-500/30">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl"
            >
                <div className="mb-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                    >
                        Create Account
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-2 text-zinc-400"
                    >
                        Join the conversation today
                    </motion.p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            id="username"
                            name="username"
                            type="text"
                            required
                            placeholder="johndoe"
                            minLength={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-zinc-500 transition-colors focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-sm text-red-400"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        formAction={signup}
                        className="w-full rounded-xl bg-white py-3 font-medium text-black transition-colors hover:bg-zinc-200"
                    >
                        Create Account
                    </motion.button>

                    <div className="text-center text-sm text-zinc-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
