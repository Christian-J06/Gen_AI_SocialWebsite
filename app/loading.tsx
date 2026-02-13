export default function Loading() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-8 space-y-4">
            <div className="h-32 w-full animate-pulse rounded-2xl bg-zinc-900/50" />
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 w-full animate-pulse rounded-2xl bg-zinc-900/50" />
            ))}
        </div>
    )
}
