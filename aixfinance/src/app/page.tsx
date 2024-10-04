"use client";

// src/app/page.tsx

import React from 'react';
import Canvas from '../components/Canvas';
import '../styles/globals.css';

const HomePage: React.FC = () => {
  return (
    <div>
      <Canvas />
    </div>
  );
};

export default HomePage;
