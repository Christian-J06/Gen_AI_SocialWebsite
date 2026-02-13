'use client'

import { motion } from 'framer-motion'
import { Home, User, LogOut, LogIn, PlusSquare } from 'lucide-react'
import Link from 'next/link'
import { signout } from '@/app/login/actions'
import { clsx } from 'clsx'
import { usePathname } from 'next/navigation'

export function Sidebar({ user }: { user: any }) {
    const pathname = usePathname()

    const links = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Profile', href: '/profile', icon: User, hidden: !user },
    ]

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-white/10 bg-black p-4 md:flex"
        >
            <div className="flex h-16 items-center px-4">
                <h1 className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-2xl font-bold text-transparent">
                    SocialVoice
                </h1>
            </div>

            <nav className="flex-1 space-y-2 py-8">
                {links.map((link) => {
                    if (link.hidden) return null
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-purple-500/10 text-purple-400'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-white/10 pt-4">
                {user ? (
                    <form action={signout}>
                        <button
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                        <LogIn className="h-5 w-5" />
                        Sign In
                    </Link>
                )}
            </div>
        </motion.aside>
    )
}
