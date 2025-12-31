/* ========================================
   Responsive Design - التصميم المتجاوب
   Mobile First Approach
======================================== */

/* ========================================
   Tablet (أجهزة التابلت)
   640px - 1024px
======================================== */
@media (max-width: 1024px) {
  html {
    font-size: 15px;
  }

  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.7rem;
  }

  .grid-3,
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }

  .navbar-menu {
    gap: 0.5rem;
  }

  .navbar-menu a {
    padding: 0.5rem 0.8rem;
    font-size: 1rem;
  }
}

/* ========================================
   Mobile (الجوالات)
   < 640px
======================================== */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  h3 {
    font-size: 1.4rem;
  }

  /* Navbar للجوال */
  .navbar-toggle {
    display: block;
  }

  .navbar-menu {
    position: fixed;
    top: 70px;
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: calc(100vh - 70px);
    background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary-medium) 100%);
    flex-direction: column;
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-xl);
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  .navbar-menu.active {
    right: 0;
  }

  .navbar-menu a {
    width: 100%;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Grid للجوال */
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }

  /* Buttons */
  .btn {
    padding: 0.9rem 1.5rem;
    font-size: 1rem;
  }

  .btn-lg {
    padding: 1.1rem 2rem;
    font-size: 1.1rem;
  }

  /* Cards */
  .card {
    padding: var(--spacing-md);
  }

  /* Result Display */
  .result-value {
    font-size: 2rem;
  }

  .result-percentage {
    font-size: 1.2rem;
    padding: 0.3rem 0.8rem;
  }

  /* Container */
  .container {
    padding: 0 1rem;
  }

  .section {
    padding: var(--spacing-lg) 0;
  }

  /* Footer */
  .footer-content {
    grid-template-columns: 1fr;
  }

  /* Form */
  .form-input,
  .form-select {
    padding: 0.9rem 1rem;
    font-size: 1rem;
  }
}

/* ========================================
   Small Mobile (الجوالات الصغيرة)
   < 480px
======================================== */
@media (max-width: 480px) {
  html {
    font-size: 13px;
  }

  .navbar-brand-text {
    font-size: 1.4rem;
  }

  .navbar-brand-icon {
    font-size: 1.5rem;
  }

  h1 {
    font-size: 1.8rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .result-value {
    font-size: 1.7rem;
  }

  .card {
    padding: 1rem;
  }

  .btn {
    padding: 0.8rem 1.2rem;
    font-size: 0.95rem;
  }
}

/* ========================================
   Print Styles (أنماط الطباعة)
======================================== */
@media print {
  .navbar,
  .footer,
  .btn,
  .navbar-toggle {
    display: none;
  }

  body {
    background: white;
    color: black;
  }

  .card {
    box-shadow: none;
    border: 1px solid #ccc;
    page-break-inside: avoid;
  }

  h1, h2, h3 {
    color: black;
    page-break-after: avoid;
  }
}

/* ========================================
   Landscape Mode (الوضع الأفقي للجوال)
======================================== */
@media (max-width: 768px) and (orientation: landscape) {
  .navbar-menu {
    height: calc(100vh - 60px);
  }
}

/* ========================================
   High DPI Screens (شاشات عالية الدقة)
======================================== */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  /* تحسينات للشاشات عالية الدقة */
  .btn,
  .card,
  .form-input {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* ========================================
   Accessibility (إمكانية الوصول)
======================================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Dark Mode Support (دعم الوضع الداكن - اختياري) */
@media (prefers-color-scheme: dark) {
  /* يمكن إضافة دعم للوضع الداكن لاحقاً */
}
