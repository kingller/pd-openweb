import React from 'react';
import { createRoot } from 'react-dom/client';
import NodeShare from '../common/NodeShare';
import { Theme } from 'pandora';
import '../main.css';

export default function () {
  const root = createRoot(document.getElementById('app'));

  root.render(
    <Theme>
      <NodeShare />
    </Theme>,
  );
}
