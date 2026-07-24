const ARTICLES = [
  {
    tag: 'Spiritual',
    readTime: '9 min read',
    title: 'Char Dham Yatra: Everything You Need to Know Before You Book',
    excerpt:
      'The Char Dham circuit is one of the most sacred journeys in Hinduism — and one of the most physically demanding. Here is how to prepare, when to go, and what each of the four shrines asks of you.',
    author: 'Priya Nair',
    date: 'Jun 18, 2026',
    image:
      'https://images.unsplash.com/photo-1626015449732-ce7c6b2d1e2e?auto=format&fit=crop&w=800&q=80'
  },
  {
    tag: 'Honeymoon',
    readTime: '7 min read',
    title: "Bali Beyond the Beaches: A Honeymooner's Guide to Ubud",
    excerpt:
      'Skip the crowded clubs of Seminyak. Ubud offers rice-terrace sunrises, private villa pools, and temple ceremonies that make for a quieter, more intimate start to married life.',
    author: 'Karan Mehta',
    date: 'May 12, 2026',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
  },
  {
    tag: 'Trek',
    readTime: '11 min read',
    title: 'Kedarkantha in Winter: A First-Timer\'s Trekking Guide',
    excerpt:
      'One of the Himalayas\' best beginner treks turns into a full snow expedition in December and January. Here is how to layer, what gear actually matters, and why the summit day is worth the 4am start.',
    author: 'Arjun Bisht',
    date: 'Apr 5, 2026',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
  }
]

export default function Journal() {
  return (
    <section id="journal" className="py-22 md:py-24 bg-paper border-t border-line">
      <div className="section-container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow">Travel Journal</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3">
            Stories to plan your next journey by
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ARTICLES.map((a) => (
            <article key={a.title} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-card overflow-hidden mb-4 bg-[#F2F6F4]">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-wide mb-2.5">
                <span className="text-[#C5A059] font-bold">{a.tag}</span>
                <span className="text-ink-soft font-normal normal-case tracking-normal">
                  {a.readTime}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2 leading-snug group-hover:text-[#0F382C] transition-colors">
                {a.title}
              </h3>
              <p className="text-[13.5px] text-ink-soft leading-relaxed mb-4">{a.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-ink-soft border-t border-line pt-3">
                <span className="font-medium text-ink">{a.author}</span>
                <span>{a.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}