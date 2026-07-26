// Generates the extra detail-page content (gallery, itinerary, reviews,
// inclusions/exclusions) from the existing lightweight item data, so the
// main destinations.js list doesn't need to be hand-expanded per item.

function seedFromString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function mulberry32(seed) {
    let a = seed
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function pick(rng, arr) {
    return arr[Math.floor(rng() * arr.length)]
}

function durationDays(duration) {
    const n = parseInt(duration, 10)
    return Number.isFinite(n) && n > 0 ? n : 3
}

// ---------- Gallery ----------
export function getGallery(item) {
    return [1, 2, 3, 4, 5].map((n) => `/images/destinations/${item.slug}/${n}.png`)
}

// ---------- Itinerary ----------
const DAY_TEMPLATES = {
    first: [
        'Arrive and settle in, with a relaxed evening to acclimatise before the journey begins.',
        'Arrival and transfer to your stay, followed by a briefing on the days ahead.'
    ],
    middle: [
        'A full day exploring {name}, with time built in to move at your own pace.',
        'Continue on to the heart of the experience — this is what {name} is really about.',
        'A quieter day of shorter excursions and free time to soak it all in.'
    ],
    last: [
        'Final sights and a relaxed morning before departure.',
        'Check out and transfer back, with the trip wrapping up on a easy note.'
    ]
}

export function getItinerary(item) {
    const days = durationDays(item.duration)
    const rng = mulberry32(seedFromString(item.name + 'itin'))
    const highlights = item.highlights && item.highlights.length ? item.highlights : [item.name]

    const plan = []
    for (let d = 1; d <= days; d++) {
        let title
        let text
        if (d === 1) {
            title = `Arrival${days > 1 ? ' & Settling In' : ''}`
            text = pick(rng, DAY_TEMPLATES.first)
        } else if (d === days && days > 1) {
            title = 'Departure'
            text = pick(rng, DAY_TEMPLATES.last)
        } else {
            const h = highlights[(d - 2) % highlights.length]
            title = h
            text = pick(rng, DAY_TEMPLATES.middle).replace('{name}', h)
        }
        plan.push({ day: d, title, text })
    }
    return plan
}

// ---------- Inclusions / Exclusions ----------
const BASE_INCLUSIONS = [
    'Accommodation as per itinerary',
    'Daily breakfast',
    'All transfers and sightseeing by private vehicle',
    'Dedicated trip coordinator',
    'All applicable taxes'
]
const BASE_EXCLUSIONS = [
    'Airfare / train fare to and from the base city',
    'Personal expenses and tips',
    'Meals not mentioned in the itinerary',
    'Travel insurance',
    'Anything not specifically mentioned as included'
]

const CATEGORY_INCLUSIONS = {
    pilgrimage: ['Assistance with darshan / temple entry queues', 'Puja arrangements on request'],
    trek: ['Trekking permits and forest fees', 'Camping equipment and experienced trek guide', 'All meals during the trek'],
    safari: ['Jeep safari fees and park entry permits', 'Naturalist / wildlife guide'],
    beach: ['Water sports session as per package', 'Airport-hotel transfers'],
    honeymoon: ['Romantic candlelight dinner', 'Room upgrade / decoration on request'],
    luxury: ['Butler or concierge service', 'Premium dining experiences'],
    family: ['Kid-friendly activity stops', 'Flexible, easy-paced schedule'],
    weekend: ['Return transfers from the nearest major city']
}

const CATEGORY_EXCLUSIONS = {
    trek: ['Personal trekking gear (unless rented separately)', 'Medical evacuation charges, if required'],
    safari: ['Camera fees inside the national park'],
    pilgrimage: ['VIP / special darshan tickets, if opted']
}

export function getInclusions(categoryKey) {
    return [...(CATEGORY_INCLUSIONS[categoryKey] || []), ...BASE_INCLUSIONS]
}

export function getExclusions(categoryKey) {
    return [...(CATEGORY_EXCLUSIONS[categoryKey] || []), ...BASE_EXCLUSIONS]
}

// ---------- Reviews ----------
const REVIEWER_NAMES = [
    'Ananya Iyer', 'Rohit Sharma', 'Priya Menon', 'Karan Malhotra', 'Sneha Reddy',
    'Arjun Nair', 'Divya Kapoor', 'Vikram Singh', 'Neha Joshi', 'Aditya Verma',
    'Kavya Pillai', 'Rahul Bose', 'Meera Krishnan', 'Sameer Khan', 'Pooja Desai'
]
const REVIEW_LINES = [
    'Everything was planned so well — {name} lived up to every bit of the description.',
    'Our trip to {name} was smooth from start to finish. Would book again without a second thought.',
    'The team was responsive and the itinerary for {name} was thoughtfully paced, not rushed at all.',
    'Loved the small details — stays, timing, guides — all handled properly for {name}.',
    'A genuinely memorable trip. {name} exceeded what we expected for the price.',
    'Good value and honest planning. No hidden surprises on the {name} trip.',
    'Minor hiccups with timing but the coordinator sorted it quickly. Overall happy with {name}.'
]
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function getReviews(item) {
    const rng = mulberry32(seedFromString(item.name + 'reviews'))
    const count = 3 + Math.floor(rng() * 2) // 3-4 reviews
    const usedNames = new Set()
    const reviews = []

    for (let i = 0; i < count; i++) {
        let name
        do {
            name = pick(rng, REVIEWER_NAMES)
        } while (usedNames.has(name) && usedNames.size < REVIEWER_NAMES.length)
        usedNames.add(name)

        const ratingOffset = pick(rng, [0, 0, 0, -0.5, 0.5])
        const rating = Math.min(5, Math.max(4, Math.round((item.rating + ratingOffset) * 2) / 2))
        const month = pick(rng, MONTHS)
        const year = pick(rng, [2025, 2026])

        reviews.push({
            id: `${item.slug}-review-${i}`,
            name,
            rating,
            date: `${month} ${year}`,
            quote: pick(rng, REVIEW_LINES).replace('{name}', item.name)
        })
    }
    return reviews
}

export function averageRating(reviews, fallback) {
    if (!reviews.length) return fallback
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
}