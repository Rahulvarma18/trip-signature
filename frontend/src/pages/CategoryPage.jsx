import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useDestinations } from '../lib/useDestinations'
import DestinationCard from '../components/DestinationCard'

export default function CategoryPage() {
    const { categoryKey } = useParams()
    const { categories, categoryList, loading, error } = useDestinations()
    const category = categories[categoryKey]

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

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                            <DestinationCard key={item.slug} item={item} categoryKey={category.key} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}