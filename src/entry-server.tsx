import React, { StrictMode } from 'react';
import { StaticRouter } from 'react-router';
// @ts-ignore
import * as HelmetAsync from 'react-helmet-async';
// @ts-ignore
const HelmetProvider = HelmetAsync.HelmetProvider || HelmetAsync.default?.HelmetProvider;
import App from './App';
import { PreloadProvider } from './context/PreloadContext';

// Server-side entry point for SSG
export function render(url: string, context: any) {
    const helmetContext = {};

    // StaticRouter is from react-router-dom/server which might need to be imported differently depending on version
    // But Vite's standard way usually involves just mapping it.
    // NOTE: In React Router v6, StaticRouter is exported from 'react-router-dom/server'

    const app = (
        <StrictMode>
            <HelmetProvider context={helmetContext}>
                <PreloadProvider value={context}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </PreloadProvider>
            </HelmetProvider>
        </StrictMode>
    );

    return { app, helmetContext };
}
