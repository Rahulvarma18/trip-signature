import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Link } from "react-router-dom";

const slides = [
  {
    tag: "amazing tour",
    destination: "Maldives",
    reviews: 639,
    rating: 4.8,
    image: "/maldives.png",
    position: "bg-center",
    link: "/category/luxury/maldives-luxury-retreat",
  },
  {
    tag: "sacred journey",
    destination: "Kedarnath",
    reviews: 784,
    rating: 4.9,
    image: "/kedar.png",
    position: "bg-center",
    link: "/category/pilgrimage/kedarnath",
  },
  {
    tag: "island paradise",
    destination: "Bali",
    reviews: 921,
    rating: 4.8,
    image: "/bali.png",
    position: "bg-center",
    link: "/category/honeymoon/bali",
  },
  {
    tag: "divine pilgrimage",
    destination: "Tirupati",
    reviews: 1043,
    rating: 4.9,
    image: "/tirupati.png",
    position: "bg-center",
    link: "/category/pilgrimage/tirupati",
  },
];
export default function Hero() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => (i === 0 ? slides.length - 1 : i - 1))
  const next = () => setCurrent((i) => (i === slides.length - 1 ? 0 : i + 1))

  const slide = slides[current]

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background */}
      <div
        key={current}
        className={`absolute inset-0 bg-cover animate-hero-bg transition-all duration-700 ${slide.position ?? 'bg-center'}`}
        style={{ backgroundImage: `url('${slide.image}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />

      {/* Left arrow */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 z-20 w-11 h-11 rounded-full border border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:left-auto md:right-8 z-20 w-11 h-11 rounded-full border border-white/50 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight size={20} />
      </button>

      {/* Content */}
      <div className="section-container relative z-10 text-center w-full flex flex-col items-center">
        {/* Script tag */}
        <p
          key={`tag-${current}`}
          className="text-white/90 mb-2 text-3xl sm:text-4xl animate-hero-subtitle"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          {slide.tag}
        </p>

        {/* Destination name */}
        <h1
          key={`title-${current}`}
          className="font-display font-semibold leading-[1.05] text-[64px] sm:text-8xl lg:text-[100px] text-white tracking-tight animate-hero-title drop-shadow-lg"
        >
          {slide.destination}
        </h1>

        {/* Rating */}
        <div
          key={`rating-${current}`}
          className="flex items-center gap-2 mt-4 mb-8 animate-hero-title"
          style={{ animationDelay: '150ms' }}
        >
          <span className="text-white/80 text-sm">{slide.reviews} reviews</span>
          <span className="text-white/40">|</span>
          {/* <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(slide.rating)
                    ? 'fill-amber-400 stroke-amber-400'
                    : 'stroke-white/40 fill-transparent'
                }
              />
            ))}
          </div> */}
          <span className="text-white/80 text-sm font-medium">{slide.rating}/5</span>
        </div>

        {/* CTA */}
        <Link
          to={slide.link}
          className="inline-flex items-center gap-3 border border-white/70 text-white px-10 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-ink transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl"
        >
          Take Me There
          <span>→</span>
        </Link>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
          />
        ))}
      </div>
    </section>
  )
}
