import React from 'react';
import { Link } from 'react-router-dom';


export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-info">
                        <h3>도서출판 동틀녘</h3>
                        <p>이메일: contact@example.com</p>
                        <p>등록번호: 000-00-00000</p>
                    </div>
                    <div className="footer-links">
                        <Link to="/about">출판사 소개</Link>
                        <Link to="/contact">문의하기</Link>
                        <Link to="/legal/privacy">개인정보처리방침</Link>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {currentYear} 도서출판 동틀녘. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
