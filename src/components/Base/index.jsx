import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPageIndex from '../Landingpage/LandingPageIndex';

const App = () => {
  return (
    <Routes>
      <Route path={'/'} element={<LandingPageIndex />} exact />
    </Routes>
  );
};

export default App;
