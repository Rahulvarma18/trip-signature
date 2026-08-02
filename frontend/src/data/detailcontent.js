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
    // Once an admin uploads images, `item.images` holds Cloudinary URLs —
    // use those. Otherwise fall back to the original local-file convention
    // so destinations that haven't been migrated yet keep working.
    if (item.images && item.images.length > 0) return item.images
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
        'A quieter day of shorter excursions and free time to soak it all in.',
        'Today is built around {name}, with a mix of guided time and time to wander on your own.',
        'An immersive day centred on {name}, paced so it never feels rushed.',
        'A dedicated day for {name} — one of the highlights of this trip.'
    ],
    last: [
        'Final sights and a relaxed morning before departure.',
        'Check out and transfer back, with the trip wrapping up on an easy note.'
    ]
}

function shuffledCopy(rng, arr) {
    const copy = [...arr]
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1))
            ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
}

// Picks from `pool`, avoiding `exclude` when there's another option to pick.
function pickAvoiding(rng, pool, exclude) {
    const options = pool.filter((v) => v !== exclude)
    return options.length ? pick(rng, options) : pick(rng, pool)
}

export function getItinerary(item) {
    const days = durationDays(item.duration)
    const rng = mulberry32(seedFromString(item.name + 'itin'))
    const highlights = item.highlights && item.highlights.length ? item.highlights : [item.name]

    // Very short trips: don't waste an entire day on "arrival" and another
    // entire day on "departure" with nothing in between — fold the actual
    // activity into both days instead.
    if (days === 1) {
        return [
            {
                day: 1,
                title: item.name,
                text: `A full day covering the best of ${item.name} — arrival, the main experience, and departure, all in one well-paced day.`
            }
        ]
    }

    if (days === 2) {
        const first = highlights[0]
        const second = highlights[1] || highlights[0]
        return [
            {
                day: 1,
                title: `Arrival & ${first}`,
                text: `Arrive and settle in, then head straight into ${first.toLowerCase()} — no time lost on a short trip like this.`
            },
            {
                day: 2,
                title: `${second} & Departure`,
                text: `A last look at ${second.toLowerCase()}, then check out and transfer back for departure.`
            }
        ]
    }

    // 3+ days: rotate through a shuffled copy of the highlights so middle
    // days don't march through them in the same fixed order every time,
    // and avoid repeating the same title or template text back-to-back —
    // or the same title+text combo again later, if a title has to repeat.
    const rotation = shuffledCopy(rng, highlights)
    const plan = [{ day: 1, title: 'Arrival & Settling In', text: pick(rng, DAY_TEMPLATES.first) }]

    let prevTitle = null
    let prevTemplate = null
    const templatesUsedForTitle = {}
    for (let d = 2; d < days; d++) {
        let idx = (d - 2) % rotation.length
        let title = rotation[idx]
        if (title === prevTitle && rotation.length > 1) {
            idx = (idx + 1) % rotation.length
            title = rotation[idx]
        }
        prevTitle = title

        const alreadyUsedForTitle = templatesUsedForTitle[title] || []
        const avoid = new Set([prevTemplate, ...alreadyUsedForTitle])
        const options = DAY_TEMPLATES.middle.filter((t) => !avoid.has(t))
        const template = options.length ? pick(rng, options) : pickAvoiding(rng, DAY_TEMPLATES.middle, prevTemplate)
        templatesUsedForTitle[title] = [...alreadyUsedForTitle, template]
        prevTemplate = template

        plan.push({ day: d, title, text: template.replace('{name}', title) })
    }

    plan.push({ day: days, title: 'Departure', text: pick(rng, DAY_TEMPLATES.last) })
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