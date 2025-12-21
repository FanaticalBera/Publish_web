import React, { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// Context to hold preloaded data during SSR/SSG
const PreloadContext = createContext<any>(null);

export function PreloadProvider({ value, children }: { value: any, children: React.ReactNode }) {
    return (
        <PreloadContext.Provider value={value}>
            {children}
        </PreloadContext.Provider>
    );
}

export function usePreloadedData() {
    const location = useLocation();
    const preloaded = useContext(PreloadContext);

    if (!preloaded) return null;

    if (typeof preloaded === 'object' && 'path' in preloaded && 'data' in preloaded) {
        const payload = preloaded as { path?: string; data?: any };
        return payload.path === location.pathname ? payload.data : null;
    }

    return preloaded;
}
