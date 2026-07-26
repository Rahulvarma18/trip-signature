import { Award, ShieldCheck, Clock, UserCheck } from 'lucide-react'

const ITEMS = [
  { icon: Award, label: 'Handpicked Journeys' },
  { icon: ShieldCheck, label: 'Verified Local Partners' },
  { icon: Clock, label: '24-Hour Enquiry Response' },
  { icon: UserCheck, label: 'Personal Trip Curator' }
]

export default function TrustStrip() {
  return (
    <div className="bg-[#040809] text-[#FFFFFF] py-6 border-y border-[#040809]/30">
      <div className="section-container flex flex-wrap justify-between gap-4">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 text-sm font-medium tracking-wide">
            <Icon size={17} className="stroke-[#040809] flex-none" />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}