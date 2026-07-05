import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Viewer from './Viewer';
import Downloader from './Downloader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/download/:slug" element={<Downloader />} />
        <Route path="/:slug" element={<Viewer />} />
        <Route path="*" element={
          <div className="not-found" style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
            <h1>404</h1>
            <p>Document Not Found</p>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
