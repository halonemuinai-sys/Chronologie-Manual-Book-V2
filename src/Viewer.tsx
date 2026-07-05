import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { ArrowLeft, Download } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';

import mapping from './config/mapping.json';

// Use local worker to avoid internet dependency
import workerUrl from 'pdfjs-dist/build/pdf.worker.js?url';

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
  if (cleaned === cleaned.toUpperCase()) {
    cleaned = cleaned
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return cleaned;
};

export default function AppViewer() {
  const { slug } = useParams<{ slug: string }>();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cleanedDocTitle, setCleanedDocTitle] = useState<string>('Buku Panduan');

  useEffect(() => {
    if (!slug) return;
    const mapData = (mapping as Record<string, { file: string, title: string }>)[slug];
    if (!mapData) {
      setError('Document Not Found');
      return;
    }

    setPdfUrl(`/assets/docs/${mapData.file}`);
    const brand = getBrandFromSlug(slug);
    setCleanedDocTitle(cleanTitle(mapData.title, brand));
  }, [slug]);

  if (error) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>
        <h1>{error}</h1>
        <p>The manual you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>
        Memuat dokumen...
      </div>
    );
  }

  return (
    <div style={{ height: '100dvh', width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#090a0c', fontFamily: 'Outfit, -apple-system, sans-serif' }}>
      {/* Premium Navigation Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0.75rem 1rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
        backgroundColor: '#111317',
        zIndex: 10
      }}>
        <Link to="/" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.375rem', 
          color: '#c5a880', 
          textDecoration: 'none', 
          fontSize: '0.875rem', 
          fontWeight: '500' 
        }}>
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Kembali
        </Link>
        <span style={{ 
          color: '#ffffff', 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          maxWidth: '55%', 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {cleanedDocTitle}
        </span>
        <Link to={`/download/${slug}`} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: '#a1a1aa', 
          textDecoration: 'none', 
          padding: '0.375rem', 
          borderRadius: '50%', 
          backgroundColor: '#1c1e24' 
        }} title="Unduh PDF">
          <Download style={{ width: '15px', height: '15px' }} />
        </Link>
      </div>

      <Worker workerUrl={workerUrl}>
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#090a0c' }}>
          <Viewer
            fileUrl={pdfUrl}
            theme="dark"
            defaultScale={SpecialZoomLevel.PageWidth}
          />
        </div>
      </Worker>
    </div>
  );
}
