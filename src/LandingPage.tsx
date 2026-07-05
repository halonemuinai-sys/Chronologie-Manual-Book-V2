import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  Download, 
  ShieldCheck, 
  Compass, 
  Info, 
  Home, 
  Smartphone, 
  MessageSquare, 
  HelpCircle, 
  MapPin,
  ArrowRight,
  Watch
} from 'lucide-react';
import mapping from './config/mapping.json';
import './LandingPage.css';

interface ManualItem {
  slug: string;
  file: string;
  title: string;
  brand: string;
  cleanedTitle: string;
}

// Brand helper mapping
const getBrandFromSlug = (slug: string): string => {
  const s = slug.toLowerCase();
  if (s.startsWith('cali-')) return 'Cali / Raymond Weil';
  if (s.includes('edox')) return 'Edox';
  if (s.includes('frederique-constant')) return 'Frederique Constant';
  if (s.includes('maen')) return 'Maen';
  if (
    s.includes('yema') ||
    s.includes('sistem-opersional-cmm') ||
    s.includes('sw200') ||
    s.includes('vh-31') ||
    s.includes('vk-64') ||
    s.includes('vk-61')
  ) {
    return 'Yema';
  }
  if (
    /^\d/.test(s) ||
    s.includes('hamilton') ||
    s.includes('khaki') ||
    s.includes('psr') ||
    s.includes('jazzmaster') ||
    s.includes('ventura')
  ) {
    return 'Hamilton';
  }
  return 'Lainnya';
};

// Title cleaning helper
const cleanTitle = (title: string, brand: string): string => {
  let cleaned = title;

  if (brand === 'Hamilton') {
    cleaned = cleaned.replace(/^\d+[-_ ]?(id)?/i, '').trim();
    cleaned = cleaned.replace(/^(id)/i, '').trim();
    cleaned = cleaned.replace(/^[-_]+/g, '').trim();
  }

  if (brand === 'Yema') {
    cleaned = cleaned.replace(/^sistem\s+opersional\s+/i, '').trim();
  }

  // Format capitalized words nicely if they are all uppercase
  if (cleaned === cleaned.toUpperCase()) {
    cleaned = cleaned
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return cleaned;
};

// Short brand taglines / descriptions for aesthetic depth
const brandInfo: Record<string, { tag: string; desc: string; abbrev: string }> = {
  'All': {
    tag: 'Koleksi Lengkap',
    desc: 'Seluruh koleksi panduan operasional jam tangan mewah Chronologie.',
    abbrev: 'ALL'
  },
  'Cali / Raymond Weil': {
    tag: 'Swiss Luxury Watches',
    desc: 'Panduan presisi jam tangan mewah Raymond Weil & Cali dengan detail teknis tinggi.',
    abbrev: 'RW'
  },
  'Edox': {
    tag: 'Maître Horloger Depuis 1884',
    desc: 'Panduan operasional jam tangan sport berkinerja tinggi berkekuatan ketahanan air khas Edox.',
    abbrev: 'ED'
  },
  'Frederique Constant': {
    tag: 'Live Your Passion',
    desc: 'Instruksi penggunaan jam tangan klasik buatan Jenewa dengan keanggunan abadi.',
    abbrev: 'FC'
  },
  'Hamilton': {
    tag: 'American Spirit, Swiss Precision',
    desc: 'Petunjuk penggunaan jam tangan legendaris berkarakter aviasi, militer, dan inovasi ikonik.',
    abbrev: 'HM'
  },
  'Maen': {
    tag: 'Modern Classic Elegance',
    desc: 'Panduan teknis bagi jam tangan neo-vintage berdesain minimalis dengan spesifikasi premium.',
    abbrev: 'MN'
  },
  'Yema': {
    tag: 'French Haute Horlogerie',
    desc: 'Petunjuk teknis kaliber buatan Prancis (CMM) dan jam tangan petualang legendaris.',
    abbrev: 'YM'
  }
};

export default function LandingPage() {
  const [currentTab, setCurrentTab] = useState<'home' | 'scan' | 'help'>('home');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeBrandInfo = brandInfo[selectedBrand] || brandInfo['All'];

  // Process mapping into list
  const manualsList = useMemo((): ManualItem[] => {
    return Object.entries(mapping).map(([slug, value]) => {
      const brand = getBrandFromSlug(slug);
      return {
        slug,
        file: value.file,
        title: value.title,
        brand,
        cleanedTitle: cleanTitle(value.title, brand)
      };
    });
  }, []);

  // Filter list
  const filteredManuals = useMemo(() => {
    return manualsList.filter(item => {
      const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;
      const matchesSearch = item.cleanedTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [manualsList, selectedBrand, searchQuery]);

  const brands = ['All', 'Cali / Raymond Weil', 'Edox', 'Frederique Constant', 'Hamilton', 'Maen', 'Yema'];

  // Grid layout animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 140, damping: 20 } }
  };

  return (
    <div className="app-shell">
      <div className="landing-container">
        {/* Decorative Ambient Glow */}
        <div className="glow-bg" />
        
        {/* App Top Bar */}
        <header className="app-header">
          <div className="header-logo">
            CHRONOLOGIE <span>Archive</span>
          </div>
          <div className="header-badge">
            Official Portal
          </div>
        </header>

        {/* Tab Content Switching */}
        <div className="tab-content-wrapper">
          <AnimatePresence mode="wait">
            {currentTab === 'home' && (
              <motion.div
                key="home-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {/* Welcome Card Banner */}
                <div className="welcome-banner">
                  {/* Watch Medallion Icon */}
                  <div className="banner-icon-wrapper">
                    <div className="banner-icon-inner">
                      <Watch style={{ width: '20px', height: '20px' }} />
                    </div>
                  </div>

                  {/* Banner Content (Crossfading dynamically on brand selection) */}
                  <div className="banner-content">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedBrand}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="banner-tag">{activeBrandInfo.tag}</span>
                        <p className="banner-desc">{activeBrandInfo.desc}</p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Peak Mountains Illustration Vector */}
                  <svg className="banner-mountains-svg" viewBox="0 0 220 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background Soft Peak */}
                    <path d="M120 100 L165 30 L210 100 Z" fill="url(#bgMountainGrad)" opacity="0.06" />
                    
                    {/* Main Matterhorn 3D Shaded Peaks */}
                    {/* Left Shade Face */}
                    <path d="M140 15 L70 100 L135 100 L142 70 L130 45 Z" fill="url(#mountainLeftGrad)" opacity="0.14" />
                    {/* Right Light Face */}
                    <path d="M140 15 L205 100 L135 100 L142 70 L130 45 Z" fill="url(#mountainRightGrad)" opacity="0.05" />
                    
                    {/* Swiss Alps Ridge Lines & Slopes */}
                    <path d="M140 15 L130 45 L142 70 L135 100" stroke="var(--warm-brown)" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
                    <path d="M125 35 L105 70" stroke="var(--warm-brown)" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />
                    <path d="M110 50 L90 90" stroke="var(--warm-brown)" strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />
                    <path d="M152 32 L175 70" stroke="var(--warm-brown)" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />
                    <path d="M165 50 L190 90" stroke="var(--warm-brown)" strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />

                    {/* Texture Hatching Lines for snow slopes */}
                    <path d="M115 70 L108 82 M122 80 L115 92 M158 60 L165 72 M170 78 L177 90" stroke="var(--warm-brown)" strokeWidth="0.6" opacity="0.12" />

                    <defs>
                      <linearGradient id="bgMountainGrad" x1="165" y1="30" x2="165" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--warm-tan)" />
                        <stop offset="1" stopColor="var(--warm-tan)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="mountainLeftGrad" x1="105" y1="15" x2="105" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--warm-brown)" />
                        <stop offset="1" stopColor="var(--warm-brown)" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="mountainRightGrad" x1="172" y1="15" x2="172" y2="100" gradientUnits="userSpaceOnUse">
                        <stop stopColor="var(--warm-gold)" />
                        <stop offset="1" stopColor="var(--warm-gold)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Search Bar */}
                <div className="app-search-box">
                  <div className="search-input-left-icon">
                    <Search style={{ width: '16px', height: '16px' }} />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari seri jam, kaliber, atau panduan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="app-search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="clear-btn"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Circular Brand Selector */}
                <div className="brand-carousel-wrapper no-scrollbar">
                  <div className="brand-carousel">
                    {brands.map((brand) => {
                      const isActive = selectedBrand === brand;
                      const info = brandInfo[brand];
                      const displayName = brand === 'Cali / Raymond Weil' ? 'Raymond Weil' : brand;
                      return (
                        <button
                          key={brand}
                          onClick={() => setSelectedBrand(brand)}
                          className={`brand-story-btn ${isActive ? 'active' : ''}`}
                        >
                          <div className={`brand-avatar-circle ${brand === 'All' ? 'all-brands-avatar' : ''}`}>
                            {info?.abbrev || 'BD'}
                          </div>
                          <span className="brand-story-label">{displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Brand highlight summary */}
                <div className="app-brand-info">
                  <span style={{ color: '#c5a880', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>
                    {brandInfo[selectedBrand]?.tag}
                  </span>
                  {brandInfo[selectedBrand]?.desc}
                </div>

                {/* Counter stats */}
                <div className="stats-row">
                  <div className="stats-count">
                    Menampilkan <span>{filteredManuals.length}</span> dari {manualsList.length} manual
                  </div>
                  <div className="stats-badge">
                    <ShieldCheck style={{ width: '13px', height: '13px' }} />
                    <span>Original PDF</span>
                  </div>
                </div>

                {/* Manual lists */}
                {filteredManuals.length > 0 ? (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="app-manuals-list"
                  >
                    {filteredManuals.map((item) => (
                      <motion.div
                        key={item.slug}
                        variants={cardVariants}
                        className="app-manual-card"
                      >
                        <div className="card-top">
                          <span className="brand-badge-app">{item.brand}</span>
                          <span className="file-size-badge">PDF • Guide</span>
                        </div>
                        
                        <div>
                          <h3 className="app-manual-title">{item.cleanedTitle}</h3>
                        </div>

                        <div className="app-actions-row">
                          <Link to={`/${item.slug}`} className="app-btn-primary">
                            <BookOpen style={{ width: '13px', height: '13px' }} />
                            Baca Panduan
                          </Link>
                          <Link to={`/download/${item.slug}`} className="app-btn-secondary">
                            <Download style={{ width: '13px', height: '13px' }} />
                            Unduh
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="no-results">
                    <div className="no-results-icon">
                      <Info style={{ width: '28px', height: '28px' }} />
                    </div>
                    <h3 className="no-results-title">Tidak ada manual book</h3>
                    <p className="no-results-desc">Coba gunakan kata kunci pencarian atau kategori brand lain.</p>
                  </div>
                )}
              </motion.div>
            )}

            {currentTab === 'scan' && (
              <motion.div
                key="scan-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="app-inner-page"
              >
                <div className="welcome-banner">
                  <span className="banner-tag">Panduan Integrasi</span>
                  <h3 className="banner-title">Cara Kerja Kode QR</h3>
                  <p className="banner-desc">
                    Portal manual book Chronologie didesain agar terbuka otomatis secara instan setelah kustomer melakukan pemindaian.
                  </p>
                </div>

                <div className="scan-card-mockup">
                  <div className="scan-card-glow" />
                  <div className="mockup-qr-container">
                    {/* SVG mockup of a QR code with luxury gold styling */}
                    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                      <rect x="0" y="0" width="22" height="22" fill="#090a0c" />
                      <rect x="3" y="3" width="16" height="16" fill="#c5a880" />
                      <rect x="6" y="6" width="10" height="10" fill="#ffffff" />
                      
                      <rect x="78" y="0" width="22" height="22" fill="#090a0c" />
                      <rect x="81" y="3" width="16" height="16" fill="#c5a880" />
                      <rect x="84" y="6" width="10" height="10" fill="#ffffff" />
                      
                      <rect x="0" y="78" width="22" height="22" fill="#090a0c" />
                      <rect x="3" y="81" width="16" height="16" fill="#c5a880" />
                      <rect x="6" y="84" width="10" height="10" fill="#ffffff" />
                      
                      {/* Random gold QR blocks */}
                      <rect x="30" y="4" width="8" height="8" fill="#c5a880" />
                      <rect x="42" y="10" width="12" height="4" fill="#c5a880" />
                      <rect x="60" y="2" width="6" height="12" fill="#c5a880" />
                      
                      <rect x="4" y="30" width="16" height="8" fill="#c5a880" />
                      <rect x="28" y="28" width="10" height="10" fill="#c5a880" />
                      <rect x="45" y="32" width="20" height="6" fill="#c5a880" />
                      <rect x="72" y="28" width="14" height="14" fill="#c5a880" />
                      
                      <rect x="32" y="48" width="18" height="6" fill="#c5a880" />
                      <rect x="58" y="48" width="8" height="18" fill="#c5a880" />
                      <rect x="72" y="52" width="12" height="8" fill="#c5a880" />
                      
                      <rect x="32" y="68" width="6" height="14" fill="#c5a880" />
                      <rect x="48" y="72" width="14" height="6" fill="#c5a880" />
                      <rect x="72" y="72" width="18" height="18" fill="#c5a880" />
                    </svg>
                  </div>
                  <h4 style={{ color: '#ffffff', margin: '0 0 0.25rem 0', fontWeight: '500' }}>Kartu Garansi QR</h4>
                  <p style={{ color: '#a1a1aa', fontSize: '0.75rem', margin: 0, fontWeight: '300' }}>Pindai barcode unik di balik jam atau kartu garansi.</p>
                </div>

                <div className="scan-instruction-list">
                  <div className="scan-step">
                    <div className="step-num">1</div>
                    <div className="step-content">
                      <h4>Pindai dengan Kamera</h4>
                      <p>Kustomer memindai QR Code menggunakan kamera smartphone bawaan atau aplikasi scanner.</p>
                    </div>
                  </div>
                  <div className="scan-step">
                    <div className="step-num">2</div>
                    <div className="step-content">
                      <h4>Terbuka Secara Otomatis</h4>
                      <p>Tautan QR Code akan langsung mengarahkan kustomer ke halaman pembaca PDF resmi jam tersebut.</p>
                    </div>
                  </div>
                  <div className="scan-step">
                    <div className="step-num">3</div>
                    <div className="step-content">
                      <h4>Baca atau Unduh Panduan</h4>
                      <p>Kustomer dapat langsung membaca panduan interaktif secara online atau menyimpannya langsung ke penyimpanan HP.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentTab === 'help' && (
              <motion.div
                key="help-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="app-inner-page"
              >
                <div className="welcome-banner">
                  <span className="banner-tag">Layanan Pelanggan</span>
                  <h3 className="banner-title">Butuh Bantuan Teknis?</h3>
                  <p className="banner-desc">
                    Tim konsultan horologi Chronologie siap membantu Anda memahami pengoperasian atau klaim garansi jam tangan Anda.
                  </p>
                </div>

                <div className="help-support-card">
                  <h4 className="help-title">Hubungi Kami</h4>
                  <p className="help-desc">Pilih salah satu metode di bawah ini untuk tersambung secara instan.</p>
                  
                  <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="help-option-item">
                    <div className="help-option-icon">
                      <MessageSquare style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div className="help-option-text">
                      <h4>Layanan WhatsApp Support</h4>
                      <p>Respon cepat 24/7 untuk bantuan pengoperasian.</p>
                    </div>
                    <ArrowRight style={{ width: '14px', height: '14px', marginLeft: 'auto', color: '#71717a' }} />
                  </a>

                  <a href="https://chronologie.co.id" target="_blank" rel="noopener noreferrer" className="help-option-item">
                    <div className="help-option-icon">
                      <Compass style={{ width: '18px', height: '18px' }} />
                    </div>
                    <div className="help-option-text">
                      <h4>Website Resmi Chronologie</h4>
                      <p>Lihat koleksi jam tangan mewah terbaru kami.</p>
                    </div>
                    <ArrowRight style={{ width: '14px', height: '14px', marginLeft: 'auto', color: '#71717a' }} />
                  </a>
                </div>

                <div className="help-support-card">
                  <h4 className="help-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin style={{ width: '16px', height: '16px', color: '#c5a880' }} />
                    Chronologie Boutique
                  </h4>
                  <p className="help-desc" style={{ marginBottom: 0 }}>
                    Plaza Indonesia, Lantai 1, Unit 120-121<br />
                    Jl. M.H. Thamrin No. Kav 28-30, Jakarta Pusat<br />
                    Indonesia
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom App Navigation Bar */}
        <nav className="app-bottom-nav">
          <button 
            onClick={() => setCurrentTab('home')}
            className={`app-nav-item ${currentTab === 'home' ? 'active' : ''}`}
          >
            <div className="app-nav-icon-wrapper">
              <Home style={{ width: '22px', height: '22px' }} />
            </div>
            <span>Beranda</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('scan')}
            className={`app-nav-item ${currentTab === 'scan' ? 'active' : ''}`}
          >
            <div className="app-nav-icon-wrapper">
              <Smartphone style={{ width: '22px', height: '22px' }} />
              <div className="nav-dot" />
            </div>
            <span>Pindai QR</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('help')}
            className={`app-nav-item ${currentTab === 'help' ? 'active' : ''}`}
          >
            <div className="app-nav-icon-wrapper">
              <HelpCircle style={{ width: '22px', height: '22px' }} />
            </div>
            <span>Bantuan</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
