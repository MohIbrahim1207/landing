import React from 'react';
import SifterScrollytelling from './components/SifterScrollytelling';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div className="min-h-screen bg-[#120a03]">
      <SifterScrollytelling />
      <ProductDetail productId="sifter" onBack={() => {}} />
    </div>
  );
}

export default App;
