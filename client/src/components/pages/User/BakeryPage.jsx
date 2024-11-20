import React from 'react';
import MainSection from './mainPage/MainSection';
import ProductSection from './mainPage/ProductSection';
import PastrychefSection from './mainPage/PastrychefSection';
import ReviewsSection from './mainPage/ReviewsSection';
import InstSection from './mainPage/InstSection';
import Footer from './mainPage/Footer';


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