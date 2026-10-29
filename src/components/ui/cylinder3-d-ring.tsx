"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export interface CylinderItem {
    src?: string
    alt?: string
    title?: string
    [key: string]: any
}

const DEFAULT_IMAGES: CylinderItem[] = [
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=540&fit=crop&q=80", alt: "Digital Marketing Analytics" },
    { src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=540&fit=crop&q=80", alt: "Data Dashboard Insights" },
    { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=540&fit=crop&q=80", alt: "Creative Team Collaboration" },
    { src: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=400&h=540&fit=crop&q=80", alt: "Brand Strategy Planning" },
    { src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=540&fit=crop&q=80", alt: "Modern Workspace Design" },
    { src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=540&fit=crop&q=80", alt: "Content Marketing Strategy" },
    { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=540&fit=crop&q=80", alt: "Business Growth Meeting" },
    { src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=540&fit=crop&q=80", alt: "Professional Presentation" },
]

export interface Cylinder3DRingProps<T = CylinderItem> {
    items?: T[]
    images?: CylinderItem[]
    renderCard?: (item: T, index: number) => React.ReactNode
    duration?: number
    perspective?: number
    initialTiltX?: number
    interactiveTilt?: boolean
    pauseOnHover?: boolean
    cardWidth?: number
    cardHeight?: number
    className?: string
    cardClassName?: string
}

export function Cylinder3DRing<T = CylinderItem>({
    items,
    images = DEFAULT_IMAGES,
    renderCard,
    duration = 24,
    perspective = 1200,
    initialTiltX = -10,
    interactiveTilt = true,
    pauseOnHover = true,
    cardWidth,
    cardHeight,
    className = "",
    cardClassName = "",
}: Cylinder3DRingProps<T>) {
    const stageRef = useRef<HTMLDivElement>(null)
    const tiltRef = useRef<HTMLDivElement>(null)
    const drumRef = useRef<HTMLDivElement>(null)
    const spinTweenRef = useRef<gsap.core.Tween | null>(null)
    const [width, setWidth] = useState(0)

    const isDraggingRef = useRef(false)
    const lastXRef = useRef(0)
    const currentRotY = useRef(0)

    useEffect(() => {
        const el = stageRef.current
        if (!el) return
        const updateWidth = () => {
            if (stageRef.current) {
                setWidth(stageRef.current.clientWidth)
            }
        }
        updateWidth()
        const ro = new ResizeObserver(([entry]) => {
            if (entry && entry.contentRect.width > 0) {
                setWidth(entry.contentRect.width)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // Prepare items list ensuring sufficient items for a smooth cylinder
    const sourceList = (items && items.length > 0 ? items : (images as unknown as T[]))
    const effectiveItems: T[] = sourceList.length > 0
        ? (sourceList.length < 8 ? [...sourceList, ...sourceList] : sourceList)
        : []
    const count = Math.max(effectiveItems.length, 8)

    const isCustomSize = Boolean(cardWidth && cardHeight)

    // Fluid responsive card dimensions adapting to mobile, tablet, and desktop
    const cardW = width <= 0
        ? (cardWidth || 160)
        : isCustomSize
        ? (width < 480
            ? Math.min(Math.round(width * 0.74), 260)
            : width < 768
            ? Math.min(Math.round(width * 0.46), 280)
            : Math.min(cardWidth!, Math.round(width * 0.28)))
        : (width < 420
            ? Math.max(Math.round(width * 0.26), 90)
            : width < 640
            ? Math.max(Math.round(width * 0.22), 110)
            : width < 1024
            ? Math.min(Math.max(Math.round(width * 0.18), 130), 180)
            : Math.min(Math.max(Math.round(width * 0.16), 140), 210))

    const cardH = cardHeight
        ? (width < 480 ? Math.round(cardHeight * 0.84) : width < 768 ? Math.round(cardHeight * 0.92) : cardHeight)
        : Math.round(cardW * 1.36)

    // Mathematically computed cylindrical radius with responsive clearance
    const chordSpacing = isCustomSize
        ? (width < 480 ? 16 : width < 768 ? 22 : 32)
        : (width < 480 ? 12 : width < 768 ? 16 : 22)
    const radiusScale = isCustomSize ? 1.15 : (width < 480 ? 1.08 : width < 768 ? 1.15 : 1.22)
    const radius = Math.round(((cardW + chordSpacing) / (2 * Math.tan(Math.PI / count))) * radiusScale)

    // Responsive container min-height
    const containerHeight = isCustomSize
        ? Math.max(cardH + (width < 640 ? 60 : 90), 380)
        : (width <= 0 ? 460 : width < 480 ? 350 : width < 768 ? 420 : 490)

    // GSAP continuous spin loop
    useGSAP(
        () => {
            if (!drumRef.current || !width) return
            spinTweenRef.current = gsap.to(drumRef.current, {
                rotationY: "-=360",
                duration,
                ease: "none",
                repeat: -1,
                onUpdate: () => {
                    if (drumRef.current) {
                        currentRotY.current = gsap.getProperty(drumRef.current, "rotationY") as number
                    }
                }
            })
        },
        { scope: stageRef, dependencies: [duration, width > 0], revertOnUpdate: true }
    )

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        isDraggingRef.current = true
        lastXRef.current = e.clientX
        if (spinTweenRef.current) {
            spinTweenRef.current.pause()
        }
    }, [])

    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!stageRef.current) return

            if (isDraggingRef.current && drumRef.current) {
                const deltaX = e.clientX - lastXRef.current
                lastXRef.current = e.clientX
                currentRotY.current += deltaX * 0.4
                gsap.set(drumRef.current, { rotationY: currentRotY.current })
                return
            }

            if (!interactiveTilt || !tiltRef.current) return
            const rect = stageRef.current.getBoundingClientRect()
            const normY = (e.clientY - rect.top) / rect.height - 0.5
            const normX = (e.clientX - rect.left) / rect.width - 0.5

            gsap.to(tiltRef.current, {
                rotationX: initialTiltX - normY * 14,
                rotationZ: normX * 3,
                duration: 0.5,
                ease: "power2.out",
                overwrite: "auto",
            })

            if (spinTweenRef.current && !isDraggingRef.current) {
                if (pauseOnHover) {
                    const targetScale = Math.abs(normX) > 0.35 ? 1 + normX * 2 : 0.2
                    gsap.to(spinTweenRef.current, {
                        timeScale: targetScale,
                        duration: 0.5,
                        overwrite: "auto",
                    })
                } else {
                    const targetTimeScale = 1 + normX * 3
                    gsap.to(spinTweenRef.current, {
                        timeScale: targetTimeScale,
                        duration: 0.4,
                        overwrite: "auto",
                    })
                }
            }
        },
        [interactiveTilt, initialTiltX, pauseOnHover]
    )

    const handlePointerUp = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false
            if (spinTweenRef.current) {
                spinTweenRef.current.play()
            }
        }
    }, [])

    const handlePointerLeave = useCallback(() => {
        isDraggingRef.current = false
        if (tiltRef.current) {
            gsap.to(tiltRef.current, {
                rotationX: initialTiltX,
                rotationZ: 0,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto",
            })
        }
        if (spinTweenRef.current) {
            spinTweenRef.current.play()
            gsap.to(spinTweenRef.current, { timeScale: 1, duration: 0.8, overwrite: "auto" })
        }
    }, [initialTiltX])

    return (
        <div
            ref={stageRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onPointerCancel={handlePointerLeave}
            className={`relative flex w-full items-center justify-center overflow-hidden py-6 sm:py-10 select-none cursor-grab active:cursor-grabbing touch-pan-y ${className}`}
            style={{
                minHeight: containerHeight,
                perspective: `${width < 640 ? Math.min(perspective, 900) : perspective}px`,
                maskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 8%, #000 92%, transparent 100%)",
            }}
        >
            {width > 0 && (
                <div
                    ref={tiltRef}
                    className="will-change-transform"
                    style={{
                        transformStyle: "preserve-3d",
                        transform: `translateZ(${-radius * 0.35}px) rotateX(${initialTiltX}deg)`,
                    }}
                >
                    <div
                        ref={drumRef}
                        className="relative will-change-transform"
                        style={{
                            width: cardW,
                            height: cardH,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {effectiveItems.map((item, i) => {
                            const angle = (360 / count) * i
                            return (
                                <div
                                    key={i}
                                    className={`absolute top-0 left-0 will-change-transform ${cardClassName}`}
                                    style={{
                                        width: cardW,
                                        height: cardH,
                                        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                        backfaceVisibility: "hidden",
                                        WebkitBackfaceVisibility: "hidden",
                                    }}
                                >
                                    {renderCard ? (
                                        renderCard(item, i)
                                    ) : (
                                        <div className="group relative size-full overflow-hidden rounded-xl sm:rounded-2xl border border-black/[0.08] dark:border-white/[0.14] shadow-2xl bg-stone-900">
                                            <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 animate-pulse" />
                                            <img
                                                src={(item as CylinderItem).src}
                                                alt={(item as CylinderItem).alt || ""}
                                                loading="lazy"
                                                draggable={false}
                                                className="relative size-full object-cover transition-transform duration-500 will-change-transform select-none"
                                            />
                                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/15" />
                                            <div className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/10" />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cylinder3DRing
