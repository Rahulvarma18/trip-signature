import { Clock, Star, BadgeIndianRupee } from 'lucide-react'
import { getGallery } from '../data/detailcontent'
import { AnimatedHikeCard } from './ui/animated-hike-card'

export default function DestinationCard({ item, categoryKey }) {
  // Returns all 5 local images for this destination
  const gallery = getGallery(item)
  const images = [0, 1, 2].map((i) => gallery[i % gallery.length])

  // Build a rich price label — shows discounted price + struck-out original
  // when `originalPrice` is present, otherwise just the plain price string.
  const priceNode = item.originalPrice ? (
    <span className="flex items-baseline gap-1.5 flex-wrap">
      <span className="font-semibold text-[#040809]">{item.price}</span>
      <span className="text-ink-soft text-[11px]">/person</span>
      <span className="line-through text-ink-soft/70 text-[12px]">{item.originalPrice}</span>
      <span className="text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white px-1.5 py-0.5 rounded-full leading-none">
        Sale
      </span>
    </span>
  ) : (
    <span className="flex items-baseline gap-1">
      <span>{item.price}</span>
      <span className="text-ink-soft text-[11px]">/person</span>
    </span>
  )

  const stats = [
    { icon: <Clock size={14} />, label: item.duration },
    { icon: <Star size={14} className="fill-[#4E3924] stroke-[#4E3924]" />, label: `${item.rating} Rating` },
    { icon: <BadgeIndianRupee size={14} className="flex-none" />, label: priceNode }
  ]

  return (
    <AnimatedHikeCard
      title={item.name}
      images={images}
      stats={stats}
      description={item.description}
      to={`/category/${categoryKey}/${item.slug}`}
    />
  )
}