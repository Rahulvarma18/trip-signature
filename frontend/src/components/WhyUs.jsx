import { UserCheck, ShieldCheck, Landmark, Clock } from 'lucide-react'

const FEATURES = [
  {
    icon: UserCheck,
    title: 'Dedicated Curator',
    desc: 'One point of contact who shapes your itinerary end to end.'
  },
  {
    icon: ShieldCheck,
    title: 'Verified Partners',
    desc: 'Stays, guides and transport vetted for safety and comfort.'
  },
  {
    icon: Landmark,
    title: 'Transparent Pricing',
    desc: 'No hidden costs — every quote is itemised before you commit.'
  },
  {
    icon: Clock,
    title: 'Round-the-Clock Support',
    desc: 'On-trip assistance whenever your journey needs it.'
  }
]

export default function WhyUs() {
  return (
    <section className="py-22 md:py-24 bg-paper border-y border-line">
      <div className="section-container">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="eyebrow">The TripSignature Promise</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3">
            Minimal effort, maximum care
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-paper border border-line rounded-card p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-signature"
            >
              <div className="w-[52px] h-[52px] rounded-full bg-[#84A095] border border-[#84A095] flex items-center justify-center mx-auto mb-4.5">
                <Icon size={24} className="stroke-[#040809]" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
              <p className="text-[13.5px] text-ink-soft leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}