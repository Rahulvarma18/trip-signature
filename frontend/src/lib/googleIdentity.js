// src/lib/googleIdentity.js
// Lazily loads Google Identity Services (GIS) and renders the
// "Continue with Google" button. Only used if VITE_GOOGLE_CLIENT_ID is set.

let scriptPromise = null

function loadGoogleScript() {
    if (scriptPromise) return scriptPromise

    scriptPromise = new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
            resolve(window.google)
            return
        }
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google?.accounts?.id) resolve(window.google)
            else reject(new Error('Google Sign-In script loaded but API is unavailable.'))
        }
        script.onerror = () => reject(new Error('Failed to load Google Sign-In.'))
        document.head.appendChild(script)
    })

    return scriptPromise
}

/**
 * Renders the Google button into `container`.
 * `onCredential` receives the raw Google ID token (JWT) to send to the backend.
 */
export function renderGoogleButton({ container, clientId, onCredential, onError }) {
    if (!container || !clientId) return

    loadGoogleScript()
        .then((google) => {
            google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => onCredential(response.credential)
            })
            google.accounts.id.renderButton(container, {
                type: 'standard',
                theme: 'outline',
                size: 'large',
                shape: 'rectangular',
                text: 'continue_with',
                width: container.offsetWidth || 320
            })
        })
        .catch((err) => onError?.(err))
}