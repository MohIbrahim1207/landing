import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CatalogHome from './components/CatalogHome';
import ProductDetail from './pages/ProductDetail';
import Footer from './components/Footer';

function App() {
  const [viewState, setViewState] = useState({ page: 'catalog', productId: null });

  const handleNavigate = (page, productId = null) => {
    setViewState({ page, productId });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between">
      <div className="flex-grow">
        <Navbar onNavigate={handleNavigate} currentPage={viewState.page} />
        
        {viewState.page === 'catalog' ? (
          <CatalogHome onViewProduct={(id) => handleNavigate('detail', id)} />
        ) : (
          <ProductDetail
            productId={viewState.productId}
            onBack={() => handleNavigate('catalog')}
            onNavigateProduct={(id) => handleNavigate('detail', id)}
          />
        )}
      </div>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
