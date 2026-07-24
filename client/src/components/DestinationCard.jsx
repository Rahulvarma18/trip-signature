import { Link } from 'react-router-dom'
import { Star, Clock, ArrowRight } from 'lucide-react'

export default function DestinationCard({ item, categoryKey }) {
  return (
    <Link
      to={`/category/${categoryKey}/${item.slug}`}
      className="group bg-paper border border-line rounded-card overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-signature"
    >
      <div className="relative h-[170px] overflow-hidden bg-[#F3ECE1]/50">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 bg-[#FAF7F2]/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-semibold shadow-sm border border-[#E8E2D7]">
          <Star size={12} className="fill-[#C9A86A] stroke-[#C9A86A]" />
          {item.rating}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1.5 text-xs text-ink-soft">
            <Clock size={13} />
            {item.duration}
          </span>
          <span className="font-display text-lg font-bold text-[#111111]">{item.price}</span>
        </div>
        <h3 className="font-display text-xl font-semibold mb-2 text-[#1E1E1E]">{item.name}</h3>
        <p className="text-[13px] text-ink-soft leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
        <span className="mt-auto flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[#111111] group-hover:text-[#C9A86A] transition-colors">
          View Details
          <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}