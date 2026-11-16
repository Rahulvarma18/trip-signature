import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft, Loader2, Search, X } from 'lucide-react'
import { useDestinations } from '../lib/useDestinations'
import DestinationCard from '../components/DestinationCard'

export default function CategoryPage() {
    const { categoryKey } = useParams()
    const { categories, categoryList, loading, error } = useDestinations()
    const category = categories[categoryKey]

    const [query, setQuery] = useState('')
    const searching = query.trim().length > 0

    // While searching, look across every category (name, description,
    // highlights, duration and category name); otherwise show this category.
    const results = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return []
        const terms = q.split(/\s+/)
        return (categoryList || []).flatMap((cat) =>
            (cat.items || [])
                .filter((item) => {
                    const haystack = [
                        item.name,
                        item.description,
                        item.duration,
                        cat.label,
                        cat.shortLabel,
                        ...(item.highlights || [])
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase()
                    return terms.every((t) => haystack.includes(t))
                })
                .map((item) => ({ item, categoryKey: cat.key }))
        )
    }, [query, categoryList])

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center gap-2 text-ink-soft text-sm">
                <Loader2 size={16} className="animate-spin" /> Loading destinations…
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-red-600 text-sm px-6 text-center">
                {error}
            </div>
        )
    }

    if (!category) return <Navigate to="/" replace />

    return (
        <div>
            <section className="bg-[#4E3924] text-white py-16">
                <div className="section-container">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white mb-6"
                    >
                        <ChevronLeft size={16} /> Back to Home
                    </Link>
                    <h1 className="font-display font-semibold text-4xl md:text-5xl mt-3 mb-4">
                        {category.label}
                    </h1>
                    <p className="text-white/80 max-w-2xl text-[15.5px] leading-relaxed">{category.tagline}</p>
                </div>
            </section>

            <section className="py-14">
                <div className="section-container">
                    <div className="flex flex-wrap gap-2.5 mb-10">
                        {categoryList.map((cat) => (
                            <Link
                                key={cat.key}
                                to={`/category/${cat.key}`}
                                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-colors duration-200 ${cat.key === categoryKey
                                    ? 'bg-[#040809] border-[#040809] text-white'
                                    : 'border-line text-ink-soft hover:border-[#040809] hover:text-[#040809]'
                                    }`}
                            >
                                {cat.shortLabel}
                            </Link>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative max-w-xl mb-8">
                        <Search
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
                        />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search destinations, e.g. Kedarnath, Manali, trek…"
                            aria-label="Search destinations"
                            className="w-full pl-11 pr-10 py-3 rounded-full border border-line bg-paper text-sm text-[#040809] placeholder:text-ink-soft/70 focus:outline-none focus:border-[#040809] transition-colors [&::-webkit-search-cancel-button]:hidden"
                        />
                        {searching && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                aria-label="Clear search"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft hover:text-[#040809]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {searching ? (
                        results.length > 0 ? (
                            <>
                                <p className="text-sm text-ink-soft mb-5">
                                    {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query.trim()}&rdquo;
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map(({ item, categoryKey: key }) => (
                                        <DestinationCard key={`${key}-${item.slug}`} item={item} categoryKey={key} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-12 text-center text-ink-soft text-sm">
                                No destinations found for &ldquo;{query.trim()}&rdquo;. Try a different name, or{' '}
                                <button onClick={() => setQuery('')} className="underline text-[#040809] font-medium">
                                    clear the search
                                </button>
                                .
                            </div>
                        )
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.items.map((item) => (
                                <DestinationCard key={item.slug} item={item} categoryKey={category.key} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}