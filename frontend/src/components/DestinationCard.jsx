import { Clock, Star, BadgeIndianRupee } from 'lucide-react'
import { getGallery } from '../data/detailcontent'
import { AnimatedHikeCard } from './ui/animated-hike-card'

export default function DestinationCard({ item, categoryKey }) {
  // Returns all 5 local images for this destination
  const gallery = getGallery(item)
  const images = [0, 1, 2].map((i) => gallery[i % gallery.length])

  const stats = [
    { icon: <Clock size={14} />, label: item.duration },
    { icon: <Star size={14} className="fill-[#4E3924] stroke-[#4E3924]" />, label: `${item.rating} Rating` },
    { icon: <BadgeIndianRupee size={14} />, label: item.price }
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