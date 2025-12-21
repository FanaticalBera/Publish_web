import { Link } from 'react-router-dom';
import React, { useState } from 'react';


export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="header">
            <div className="container header-container">
                <div className="logo">
                    <Link to="/">동틀녘</Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    <Link to="/books">도서</Link>
                    <Link to="/authors">저자</Link>
                    <Link to="/news">소식</Link>
                    <Link to="/about">소개</Link>
                </nav>

                {/* Mobile Menu Button */}
                <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Toggle menu">
                    <span className="hamburger-icon">☰</span>
                </button>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="mobile-nav-overlay" onClick={closeMenu}>
                        <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={closeMenu}>&times;</button>
                            <Link to="/books" onClick={closeMenu}>도서</Link>
                            <Link to="/authors" onClick={closeMenu}>저자</Link>
                            <Link to="/news" onClick={closeMenu}>소식</Link>
                            <Link to="/about" onClick={closeMenu}>소개</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
