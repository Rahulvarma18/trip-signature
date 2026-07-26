import * as React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/utils'

// A reusable "stacked photos" animated card primitive.
// - stats: [{ icon: <Clock size={14}/>, label: '4 Days' }, ...]
// - images: 2-3 photo URLs, fanned out and revealed on hover
// - to: internal route (react-router Link) -- use `href` instead for a plain <a>
export const AnimatedHikeCard = React.forwardRef(function AnimatedHikeCard(
    { title, images, stats, description, to, href, className },
    ref
) {
    const Component = to ? Link : 'a'
    const linkProps = to ? { to } : { href }

    const IMAGE_WIDTH_PERCENT = 40 // keep in sync with the w-[40%] below

    return (
        <Component
            ref={ref}
            {...linkProps}
            className={cn(
                'group relative block w-full cursor-pointer rounded-2xl border border-line bg-paper p-6 text-[#2B2B2B] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-signature',
                className
            )}
            aria-label={`Learn more about ${title}`}
        >
            <div className="flex flex-col">
                {/* Card Header: Title and Arrow */}
                <div className="mb-6 flex items-center justify-between gap-3">
                    <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
                    <ArrowRight className="h-5 w-5 flex-none text-[#2B2B2B] transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:text-[#B3B3B3]" />
                </div>

                {/* Stacked images, fan out on hover so the last one lands exactly
                    on the card's right edge, regardless of the card's rendered width */}
                <div className="relative mb-6 h-32 overflow-hidden">
                    {images.map((src, index) => {
                        // % translate is relative to the IMAGE's own width, not the
                        // container. To move an element whose width is W% of the
                        // container so its right edge reaches 100% of the container,
                        // it must shift by (100 - W)% of the container, which in
                        // self-relative terms is ((100 - W) / W) * 100 percent.
                        const maxSelfShift = ((100 - IMAGE_WIDTH_PERCENT) / IMAGE_WIDTH_PERCENT) * 100
                        const step = images.length > 1 ? maxSelfShift / (images.length - 1) : 0
                        const hoverShift = index * step

                        return (
                            <div
                                key={src + index}
                                className="absolute h-full w-[40%] overflow-hidden rounded-lg border-2 border-paper shadow-md transition-all duration-300 ease-in-out translate-x-[var(--tx-base)] rotate-0 group-hover:translate-x-[var(--tx-hover)] group-hover:rotate-[var(--r)] pointer-coarse:translate-x-[var(--tx-hover)] pointer-coarse:rotate-[var(--r)]"
                                style={{
                                    '--tx-base': `${index * 26}px`,
                                    '--tx-hover': `${hoverShift}%`,
                                    '--r': `${index * 4 - 4}deg`,
                                    zIndex: images.length - index
                                }}
                            >
                                <img
                                    src={src}
                                    alt={`${title} view ${index + 1}`}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Stats */}
                <div className="mb-4 flex items-center flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-ink-soft">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {stat.icon}
                            <span>{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* Description */}
                <p className="text-[13.5px] leading-relaxed text-ink-soft line-clamp-2">
                    {description}
                </p>
            </div>
        </Component>
    )
})