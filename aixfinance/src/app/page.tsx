"use client";

// src/app/page.tsx

import React from 'react';
import Board from '../components/Board';
import NewCardForm from '../components/NewCardForm';
import { PanelProvider } from '../contexts/PanelContext';
import '../styles/globals.css';

const HomePage: React.FC = () => {
  return (
    <PanelProvider>
      <div>
        <Board />
        <NewCardForm />
      </div>
    </PanelProvider>
  );
};

export default HomePage;
