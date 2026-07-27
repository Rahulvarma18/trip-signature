// Animation Presets - Pick one and copy it!

// ==========================================
// 1. FADE + SLIDE UP (Current Default)
// ==========================================
export const fadeSlideUp = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 2. SUBTLE FADE ONLY (Minimal)
// ==========================================
export const subtleFade = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 3. SLIDE FROM LEFT + FADE
// ==========================================
export const slideFromLeft = {
    initial: {
        opacity: 0,
        x: -50,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 4. SLIDE FROM RIGHT + FADE
// ==========================================
export const slideFromRight = {
    initial: {
        opacity: 0,
        x: 50,
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 5. SCALE + FADE (Zoom In)
// ==========================================
export const scaleZoomIn = {
    initial: {
        opacity: 0,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 6. ROTATE + SCALE (Fancy)
// ==========================================
export const rotateScale = {
    initial: {
        opacity: 0,
        scale: 0.9,
        rotate: -5,
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        rotate: 5,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 7. BLUR + FADE (Glassmorphism Effect)
// ==========================================
export const blurFade = {
    initial: {
        opacity: 0,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        filter: 'blur(10px)',
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 8. SLIDE DOWN + FADE
// ==========================================
export const slideDown = {
    initial: {
        opacity: 0,
        y: -30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: 30,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 9. BOUNCY (Spring Animation)
// ==========================================
export const bouncy = {
    initial: {
        opacity: 0,
        y: 30,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 20,
        }
    },
    exit: {
        opacity: 0,
        y: -30,
        transition: {
            duration: 0.2,
        }
    }
}

// ==========================================
// 10. SMOOTH EASE IN OUT (Slower, Elegant)
// ==========================================
export const smoothElegant = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: 'easeInOut'
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.5,
            ease: 'easeInOut'
        }
    }
}

// ==========================================
// 11. MORPH EFFECT (Scale + Rotate + Fade)
// ==========================================
export const morphEffect = {
    initial: {
        opacity: 0,
        scale: 0.8,
        rotate: 10,
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        rotate: -10,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 12. FLIP VERTICAL (3D-ish Effect)
// ==========================================
export const flipVertical = {
    initial: {
        opacity: 0,
        rotateX: 90,
    },
    animate: {
        opacity: 1,
        rotateX: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        rotateX: -90,
        transition: {
            duration: 0.3,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 13. QUICK SNAP (Fast & Snappy)
// ==========================================
export const quickSnap = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.15,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 14. SLOW CINEMATIC (Movie-like)
// ==========================================
export const cinematicSlow = {
    initial: {
        opacity: 0,
        y: 50,
        scale: 0.9,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut'
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        scale: 0.9,
        transition: {
            duration: 0.5,
            ease: 'easeIn'
        }
    }
}

// ==========================================
// 15. STAGGERED CHILDREN (Advanced)
// ==========================================
export const staggeredContainer = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        }
    },
}

export const staggeredChild = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: 'easeOut'
        }
    }
}