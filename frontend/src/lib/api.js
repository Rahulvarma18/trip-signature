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

export { ApiError }