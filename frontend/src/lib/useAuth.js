// src/lib/useAuth.js
// Session state: talks to the backend auth API and persists the
// logged-in user + JWT in localStorage so refreshes don't log people out.

import { useState, useEffect, useCallback } from 'react'
import { authApi, ApiError } from './api'

const STORAGE_KEY = 'tripsignature_auth'

function loadStored() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

function saveStored(session) {
    try {
        if (session) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    } catch {
        // Storage unavailable (private browsing, quota, etc.) — session just won't persist.
    }
}

export function useAuth() {
    const [session, setSession] = useState(loadStored)
    const [checking, setChecking] = useState(!!loadStored()?.token)

    const user = session?.user || null
    const token = session?.token || null

    // Validate the stored token in the background on load. If it's expired
    // or the account no longer exists, clear the stale session quietly.
    useEffect(() => {
        if (!token) {
            setChecking(false)
            return
        }
        let cancelled = false
        authApi
            .me(token)
            .then((res) => {
                if (cancelled) return
                setSession((s) => (s ? { ...s, user: res.data.user } : s))
            })
            .catch((err) => {
                if (cancelled) return
                if (err instanceof ApiError && (err.status === 401 || err.status === 404)) {
                    setSession(null)
                    saveStored(null)
                }
            })
            .finally(() => {
                if (!cancelled) setChecking(false)
            })
        return () => {
            cancelled = true
        }
        // Only run once on mount — the token doesn't change without a fresh login.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const login = useCallback(async ({ email, password }) => {
        const res = await authApi.login({ email, password })
        const next = { user: res.data.user, token: res.data.token }
        setSession(next)
        saveStored(next)
        return next.user
    }, [])

    const signup = useCallback(async ({ name, email, password }) => {
        const res = await authApi.signup({ name, email, password })
        const next = { user: res.data.user, token: res.data.token }
        setSession(next)
        saveStored(next)
        return next.user
    }, [])

    const loginWithGoogle = useCallback(async (idToken) => {
        const res = await authApi.google(idToken)
        const next = { user: res.data.user, token: res.data.token }
        setSession(next)
        saveStored(next)
        return next.user
    }, [])

    const logout = useCallback(() => {
        if (token) authApi.logout(token).catch(() => { })
        setSession(null)
        saveStored(null)
    }, [token])

    return { user, checking, login, signup, loginWithGoogle, logout }
}