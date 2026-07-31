// src/lib/api.js
// Minimal fetch-based client for the TripSignature backend API.
// Base URL is configurable via VITE_API_URL (see .env.example).

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiError extends Error {
    constructor(message, { status, fieldErrors } = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        // Array of { field, message } from Joi validation errors, when present
        this.fieldErrors = fieldErrors || null
    }
}

async function request(path, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    let res
    try {
        res = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        })
    } catch (networkErr) {
        throw new ApiError('Could not reach the server. Please check your connection and try again.')
    }

    let data = null
    try {
        data = await res.json()
    } catch {
        // Non-JSON response (e.g. 204, or server down) — fall through with null data
    }

    if (!res.ok) {
        throw new ApiError(data?.message || `Request failed (${res.status})`, {
            status: res.status,
            fieldErrors: data?.errors
        })
    }

    return data
}

export const authApi = {
    signup: ({ name, email, password }) =>
        request('/auth/signup', { method: 'POST', body: { name, email, password } }),

    login: ({ email, password }) =>
        request('/auth/login', { method: 'POST', body: { email, password } }),

    google: (idToken) => request('/auth/google', { method: 'POST', body: { token: idToken } }),

    me: (token) => request('/auth/me', { token }),

    logout: (token) => request('/auth/logout', { method: 'POST', token })
}

export const destinationsApi = {
    list: ({ category, all, token } = {}) => {
        const params = new URLSearchParams()
        if (category) params.set('category', category)
        if (all) params.set('all', 'true')
        const qs = params.toString()
        return request(`/destinations${qs ? `?${qs}` : ''}`, { token })
    },

    create: (payload, token) => request('/destinations', { method: 'POST', body: payload, token }),

    update: (slug, payload, token) =>
        request(`/destinations/${encodeURIComponent(slug)}`, { method: 'PUT', body: payload, token }),

    remove: (slug, token) =>
        request(`/destinations/${encodeURIComponent(slug)}`, { method: 'DELETE', token })
}

export const inquiryApi = {
    create: (payload, token) => request('/inquiry/create', { method: 'POST', body: payload, token }),

    adminList: ({ status, limit, offset, token } = {}) => {
        const params = new URLSearchParams()
        if (status) params.set('status', status)
        if (limit) params.set('limit', limit)
        if (offset) params.set('offset', offset)
        const qs = params.toString()
        return request(`/inquiry/admin/all${qs ? `?${qs}` : ''}`, { token })
    },

    adminStats: (token) => request('/inquiry/admin/stats', { token }),

    updateStatus: (inquiryId, status, token) =>
        request(`/inquiry/${inquiryId}/status`, { method: 'PATCH', body: { status }, token }),

    addNote: (inquiryId, text, token) =>
        request(`/inquiry/${inquiryId}/note`, { method: 'POST', body: { text }, token })
}

export { ApiError }