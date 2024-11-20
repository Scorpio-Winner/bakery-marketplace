import React from 'react';
import MainSection from './bakeryPage/MainSection';
import ProductSection from './bakeryPage/ProductSection';
import PastrychefSection from './bakeryPage/PastrychefSection';
import ReviewsSection from './bakeryPage/ReviewsSection';
import InstSection from './bakeryPage/InstSection';
import Footer from './bakeryPage/Footer';


const BakeryPage = () => {
  return (
    <div>
      <MainSection />
      <ProductSection />
      <PastrychefSection />
      <ReviewsSection />
      <InstSection />
      <Footer />
    </div>
  );
};

export default BakeryPage;