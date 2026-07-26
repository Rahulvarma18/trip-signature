const TESTIMONIALS = [
  {
    initial: 'R',
    name: 'Rohit Sharma',
    trip: 'Kedarnath & Badrinath',
    quote:
      "The Char Dham itinerary was planned around our elderly parents' pace — every detail, from stay to darshan timing, was thought through."
  },
  {
    initial: 'A',
    name: 'Ananya & Karan',
    trip: 'Bali Honeymoon',
    quote:
      'Our Bali honeymoon felt entirely personal, not templated. The curator adjusted the plan twice without any fuss.'
  },
  {
    initial: 'S',
    name: 'Siddharth Rao',
    trip: 'Kedarkantha Trek',
    quote:
      'Kedarkantha in the snow was exactly as promised — good guides, honest briefing, no surprises on the trail.'
  }
]

export default function Testimonials() {
  return (
    <section className="py-22 md:py-24">
      <div className="section-container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow">Traveller Words</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3">
            Journeys, remembered fondly
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-paper border border-line rounded-card p-7 relative">
              <span className="absolute top-5 right-5 font-display text-5xl leading-none text-gold-light">
                &rdquo;
              </span>
              <p className="text-[14.5px] text-ink-soft leading-relaxed mb-5 italic">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-full bg-[#84A095] flex items-center justify-center font-display font-bold text-[#040809] border border-[#84A095]">
                  {t.initial}
                </div>
                <div>
                  <b className="block text-[13.5px]">{t.name}</b>
                  <span className="text-xs text-ink-soft">{t.trip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}