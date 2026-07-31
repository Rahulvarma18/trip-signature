// src/lib/useDestinations.js
// Fetches destinations from the backend (MongoDB) and groups them by
// category, matching the shape the site's pages already expect
// (CATEGORIES / CATEGORY_LIST from the old static data file).
//
// Results are cached in-module for the session so navigating between
// pages doesn't refetch every time — call invalidateDestinationsCache()
// after an admin create/update/delete so the next read is fresh.

import { useEffect, useState } from 'react'
import { destinationsApi } from './api'

// Category-level marketing copy — not stored per-destination in MongoDB,
// so it's kept here alongside the grouping logic. Falls back to a generic
// line for any new category an admin creates that isn't listed below.
const CATEGORY_TAGLINES = {
    pilgrimage: 'Sacred journeys across India\u2019s most revered shrines and temples.',
    beach: 'Sun, sand and turquoise water across India\u2019s best coastlines and islands.',
    honeymoon: 'Quiet, romantic escapes designed around just the two of you.',
    trek: 'High-altitude trails across the Himalayas for every experience level.',
    safari: 'Wildlife encounters across India and Africa\u2019s best national parks.',
    family: 'Easy-paced itineraries built for travelling with kids and grandparents alike.',
    luxury: 'Private villas, overwater stays, and five-star service for a no-compromise trip.',
    weekend: 'Short, easy trips that fit into a two- or three-day break.'
}

let cache = null
let inflight = null

function groupByCategory(destinations) {
    const map = {}
    destinations.forEach((d) => {
        if (!map[d.category]) {
            map[d.category] = {
                key: d.category,
                label: d.categoryLabel || d.category,
                shortLabel: d.categoryLabel || d.category,
                tagline: CATEGORY_TAGLINES[d.category] || 'Curated journeys, planned around you.',
                items: []
            }
        }
        map[d.category].items.push(d)
    })
    return map
}

function fetchDestinations() {
    if (cache) return Promise.resolve(cache)
    if (!inflight) {
        inflight = destinationsApi
            .list()
            .then((res) => {
                const categories = groupByCategory(res.data.destinations)
                cache = { categories, categoryList: Object.values(categories) }
                return cache
            })
            .finally(() => {
                inflight = null
            })
    }
    return inflight
}

export function invalidateDestinationsCache() {
    cache = null
}

export function useDestinations() {
    const [data, setData] = useState(cache)
    const [loading, setLoading] = useState(!cache)
    const [error, setError] = useState('')

    useEffect(() => {
        if (cache) {
            setData(cache)
            setLoading(false)
            return
        }
        let cancelled = false
        setLoading(true)
        fetchDestinations()
            .then((res) => {
                if (!cancelled) setData(res)
            })
            .catch((err) => {
                if (!cancelled) setError(err.message || 'Failed to load destinations.')
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [])

    return {
        categories: data?.categories || {},
        categoryList: data?.categoryList || [],
        loading,
        error
    }
}