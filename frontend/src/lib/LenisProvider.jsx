import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'

const LenisContext = createContext(null)

// Custom "premium" easing — a slow-settling exponential ease-out.
// Feels weighty and deliberate rather than snappy, which suits a
// luxury travel / concierge brand better than the linear default.
const premiumEasing = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -9 * t))

export function LenisProvider({ children }) {
    const lenisRef = useRef(null)
    const [, forceReady] = useState(0)

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.35,
            easing: premiumEasing,
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.15,
            autoRaf: true,
            anchors: true
        })

        lenisRef.current = lenis
        forceReady((v) => v + 1) // let consumers know the instance exists

        return () => {
            lenis.destroy()
            lenisRef.current = null
        }
    }, [])

    return (
        <LenisContext.Provider value={lenisRef}>
            {children}
        </LenisContext.Provider>
    )
}

// Returns a stable ref; call `.current` inside handlers (not during render)
// since the instance is created after mount.
export function useLenis() {
    return useContext(LenisContext)
}

// Convenience helper for the common "scroll to element by id" case used
// throughout the app for nav / CTA scrolling.
export function scrollToId(lenisRef, id, options = {}) {
    const el = document.getElementById(id)
    if (!el) return
    if (lenisRef?.current) {
        lenisRef.current.scrollTo(el, { duration: 1.5, easing: premiumEasing, ...options })
    } else {
        el.scrollIntoView({ behavior: 'smooth' })
    }
}