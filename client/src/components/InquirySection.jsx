import { CheckCircle2 } from 'lucide-react'
import InquiryForm from './InquiryForm'

const POINTS = [
  'Takes less than a minute to fill',
  'No account or payment required',
  "Email is optional — we'll call you either way"
]

export default function InquirySection({ presetDestination }) {
  return (
    <section
      id="inquire"
      className="relative bg-[#111111] text-white py-22 md:py-24 border-t border-[#C9A86A]/20"
    >
      <div className="section-container grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
        <div>
          <span className="eyebrow text-[#C9A86A]">Let Us Help</span>
          <h2 className="font-display font-semibold text-3xl md:text-4xl mt-3.5 mb-4.5 text-[#FAF7F2]">
            Tell us where your heart wants to go
          </h2>
          <p className="text-white/70 leading-relaxed mb-6.5 text-[15px]">
            Share a few details and your dedicated trip curator will reach out with a
            tailored plan — usually within 24 hours.
          </p>
          <div className="flex flex-col gap-3.5">
            {POINTS.map((point) => (
              <div key={point} className="flex gap-3 items-start text-sm text-white/80">
                <CheckCircle2 size={18} className="stroke-[#C9A86A] flex-none mt-0.5" />
                {point}
              </div>
            ))}
          </div>
        </div>

        <InquiryForm presetDestination={presetDestination} />
      </div>
    </section>
  )
}