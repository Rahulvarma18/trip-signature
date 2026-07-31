// src/components/AdminRoute.jsx
// Guards admin-only routes: redirects non-admins away, and shows a brief
// loading state while the session is still being validated on first load.

import { Navigate } from 'react-router-dom'

export default function AdminRoute({ user, checking, children }) {
    if (checking) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-ink-soft text-sm">
                Checking your session…
            </div>
        )
    }

    if (!user?.isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}