// src/components/LegalPageLayout.jsx
// Shared shell for simple content pages (About, Privacy, Terms, Cookies)
// so they all match the site's look without duplicating the wrapper markup.

export default function LegalPageLayout({ eyebrow, title, updated, children }) {
    return (
        <div className="section-container py-14 md:py-20 max-w-3xl">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold mt-2 mb-2">{title}</h1>
            {updated && <p className="text-ink-soft text-sm mb-10">Last updated: {updated}</p>}
            <div className="prose-legal space-y-6 text-[15px] leading-relaxed text-ink-soft">{children}</div>
        </div>
    )
}