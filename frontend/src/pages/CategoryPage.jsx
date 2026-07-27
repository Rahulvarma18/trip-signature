import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { CATEGORIES, CATEGORY_LIST } from '../data/destinations'
import DestinationCard from '../components/DestinationCard'

export default function CategoryPage() {
    const { categoryKey } = useParams()
    const category = CATEGORIES[categoryKey]

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
                    {/* <span className="eyebrow text-[#040809] ml-6">{category.items.length} Destinations</span> */}
                    <h1 className="font-display font-semibold text-4xl md:text-5xl mt-3 mb-4">
                        {category.label}
                    </h1>
                    <p className="text-white/80 max-w-2xl text-[15.5px] leading-relaxed">{category.tagline}</p>
                </div>
            </section>

            <section className="py-14">
                <div className="section-container">
                    <div className="flex flex-wrap gap-2.5 mb-10">
                        {CATEGORY_LIST.map((cat) => (
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