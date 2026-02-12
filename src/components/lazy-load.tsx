'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
    children: ReactNode;
    fallback?: ReactNode;
    threshold?: number;
    rootMargin?: string;
}

export function LazyLoad({
    children,
    fallback = <div className="min-h-[200px]" />,
    threshold = 0.01,
    rootMargin = '200px'
}: LazyLoadProps) {
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold, rootMargin }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return (
        <div ref={containerRef}>
            {isInView ? children : fallback}
        </div>
    );
}
