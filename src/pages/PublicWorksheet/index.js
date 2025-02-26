import React from 'react';
import { createRoot } from 'react-dom/client';
import PublicWorksheet from './PublicWorksheet';
import { Theme } from 'pandora';

const root = createRoot(document.querySelector('#app'));

root.render(<Theme><PublicWorksheet /></Theme>);
