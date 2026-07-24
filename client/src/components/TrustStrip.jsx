import { Award, ShieldCheck, Clock, UserCheck } from 'lucide-react'

const ITEMS = [
  { icon: Award, label: 'Handpicked Journeys' },
  { icon: ShieldCheck, label: 'Verified Local Partners' },
  { icon: Clock, label: '24-Hour Enquiry Response' },
  { icon: UserCheck, label: 'Personal Trip Curator' }
]

export default function TrustStrip() {
  return (
    <div className="bg-[#111111] text-[#FAF7F2] py-6 border-y border-[#C9A86A]/30">
      <div className="section-container flex flex-wrap justify-between gap-4">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-sm font-medium tracking-wide">
            <Icon size={17} className="stroke-[#C9A86A] flex-none" />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}