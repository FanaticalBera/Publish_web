import React from 'react';
import { Routes, Route } from 'react-router-dom';
// @ts-ignore
import * as HelmetAsync from 'react-helmet-async';
// @ts-ignore
const HelmetProvider = HelmetAsync.HelmetProvider || HelmetAsync.default?.HelmetProvider;
import SEOHead from './components/common/SEOHead';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Authors from './pages/Authors';
import AuthorDetail from './pages/AuthorDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import DataRoom from './pages/DataRoom';
import DataRoomDetail from './pages/DataRoomDetail';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <SEOHead title="Home" />
      <Routes>
        {/* Admin Route (No Layout) */}
        <Route path="/keystatic/*" element={<Admin />} />

        {/* Main Site Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/books/:slug" element={<BookDetail />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/:slug" element={<AuthorDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/dataroom" element={<DataRoom />} />
        <Route path="/dataroom/:slug" element={<DataRoomDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HelmetProvider>
  )
}

export default App
