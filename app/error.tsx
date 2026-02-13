'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 rounded-full bg-red-500/10 p-4 text-red-500">
                <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-white">Something went wrong!</h2>
            <p className="mt-2 text-zinc-400">
                We apologize for the inconvenience. Please try again later.
            </p>
            <button
                onClick={reset}
                className="mt-6 rounded-xl bg-white px-6 py-2 font-medium text-black transition-colors hover:bg-zinc-200"
            >
                Try again
            </button>
        </div>
    )
}
