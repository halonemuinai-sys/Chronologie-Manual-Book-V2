import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Download, ShieldCheck, Compass, Info } from 'lucide-react';
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
    // Remove leading numbers and codes like 1000_ID, 1001-id-, 1004_IDKRONOGRAF
    cleaned = cleaned.replace(/^\d+[-_ ]?(id)?/i, '').trim();
    cleaned = cleaned.replace(/^(id)/i, '').trim();
    // Strip leading dashes or underscores
    cleaned = cleaned.replace(/^[-_]+/g, '').trim();
  }

  if (brand === 'Yema') {
    // Remove "SISTEM OPERSIONAL "
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
const brandInfo: Record<string, { tag: string; desc: string }> = {
  'All': {
    tag: 'Koleksi Lengkap',
    desc: 'Telusuri seluruh koleksi panduan operasional jam tangan mewah dari berbagai brand.'
  },
  'Cali / Raymond Weil': {
    tag: 'Swiss Luxury Watches',
    desc: 'Panduan presisi untuk jam tangan mewah Raymond Weil & Cali dengan detail fungsional tinggi.'
  },
  'Edox': {
    tag: 'Maître Horloger Depuis 1884',
    desc: 'Panduan operasional jam tangan sport berkinerja tinggi berkekuatan ketahanan air khas Edox.'
  },
  'Frederique Constant': {
    tag: 'Live Your Passion',
    desc: 'Instruksi penggunaan jam tangan klasik buatan Jenewa dengan keanggunan abadi.'
  },
  'Hamilton': {
    tag: 'American Spirit, Swiss Precision',
    desc: 'Petunjuk penggunaan jam tangan legendaris berkarakter aviasi, militer, dan inovasi ikonik.'
  },
  'Maen': {
    tag: 'Modern Classic Elegance',
    desc: 'Panduan teknis bagi jam tangan neo-vintage berdesain minimalis dengan spesifikasi premium.'
  },
  'Yema': {
    tag: 'French Haute Horlogerie',
    desc: 'Petunjuk teknis kaliber buatan Prancis (CMM) dan jam tangan petualang legendaris.'
  }
};

export default function LandingPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
        staggerChildren: 0.04
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120, damping: 18 } }
  };

  return (
    <div className="landing-container">
      {/* Decorative Glow Ambient Elements */}
      <div className="glow-element-1" />
      <div className="glow-element-2" />
      
      {/* Header Boutique */}
      <header className="header-boutique">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="brand-tag"
        >
          <Compass className="spin-slow" style={{ width: '14px', height: '14px' }} />
          Chronologie Manual Books
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="main-title"
        >
          The Horology <span>Archive</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="main-subtitle"
        >
          Temukan dan pelajari panduan pengoperasian jam tangan mewah Anda dengan presisi.
        </motion.p>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Search Bar */}
        <div className="search-wrapper">
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="search-input-container"
          >
            <div className="search-icon-left">
              <Search style={{ width: '18px', height: '18px' }} />
            </div>
            <input
              type="text"
              placeholder="Cari seri jam, kaliber, atau panduan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>

        {/* Brand tabs navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="brand-nav-container"
        >
          {/* Scrollable Brand Container */}
          <div className="brand-scroll-wrapper no-scrollbar">
            <div className="brand-tabs-list">
              {brands.map((brand) => {
                const isActive = selectedBrand === brand;
                return (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`brand-tab ${isActive ? 'active' : ''}`}
                  >
                    {brand}
                    {isActive && (
                      <motion.div
                        layoutId="activeBrandIndicator"
                        className="active-brand-indicator"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Brand Highlight Card */}
          <div className="brand-info-card-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBrand}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="brand-info-card"
              >
                <span className="brand-info-tag">
                  {brandInfo[selectedBrand]?.tag || 'Brand Manual'}
                </span>
                <p className="brand-info-desc">
                  {brandInfo[selectedBrand]?.desc || 'Telusuri koleksi manual book.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Counter Stats */}
        <div className="stats-row">
          <div className="stats-count">
            Menampilkan <span>{filteredManuals.length}</span> dari {manualsList.length} manual book
          </div>
          <div className="stats-badge">
            <ShieldCheck style={{ width: '14px', height: '14px' }} />
            <span>100% PDF Original</span>
          </div>
        </div>

        {/* Manual Grid */}
        <AnimatePresence mode="wait">
          {filteredManuals.length > 0 ? (
            <motion.div
              key={selectedBrand + '-' + searchQuery}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="manuals-grid"
            >
              {filteredManuals.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={cardVariants}
                  className="manual-card"
                >
                  <div>
                    {/* Brand Badge */}
                    <div className="card-badge-row">
                      <span className="brand-badge">
                        {item.brand}
                      </span>
                      <span className="file-size-badge">PDF • Manual</span>
                    </div>

                    {/* Manual Title */}
                    <h3 className="manual-title">
                      {item.cleanedTitle}
                    </h3>
                    
                    {/* Sub-label showing raw file title if requested for context */}
                    <p className="manual-ref">
                      Ref: {item.title}
                    </p>
                  </div>

                  {/* Actions Grid */}
                  <div className="actions-grid">
                    <Link
                      to={`/${item.slug}`}
                      className="action-btn-view"
                    >
                      <BookOpen style={{ width: '14px', height: '14px' }} />
                      Baca Online
                    </Link>
                    <Link
                      to={`/download/${item.slug}`}
                      className="action-btn-download"
                    >
                      <Download style={{ width: '14px', height: '14px' }} />
                      Unduh PDF
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-results"
            >
              <div className="no-results-icon">
                <Info style={{ width: '32px', height: '32px' }} />
              </div>
              <h3 className="no-results-title">Tidak ada manual book yang cocok</h3>
              <p className="no-results-desc">Coba gunakan kata kunci pencarian atau pilih kategori brand lain.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Boutique Footer */}
      <footer className="boutique-footer">
        <p>
          © {new Date().getFullYear()} Chronologie Manual Library. Dioperasikan khusus untuk kustomer loyal kami.
        </p>
      </footer>
    </div>
  );
}
