import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './styles.css';
import './market.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AvatarApp } from './AvatarApp';
import { initAnalytics } from './analytics';

void initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AvatarApp />
  </StrictMode>,
);
