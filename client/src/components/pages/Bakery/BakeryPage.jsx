import React from 'react';

import BakeryMainSection from './bakeryPage/BakeryMainSection';
import ProductSection from './bakeryPage/ProductSection';
import ReviewsSection from './bakeryPage/ReviewsSection';

const BakeryPage = () => {
  return (
    <div>
      <BakeryMainSection />
      <ProductSection />
      <ReviewsSection />
    </div>
  );
};

export default BakeryPage;