import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/newsreader/wght.css';
import '@fontsource-variable/geist-mono/index.css';
import './styles/global.css';
import { App } from './App';

// Pinned sections add height after load, so a restored scroll position would land somewhere else: always start at the top.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// No <StrictMode>: the WebGL hero owns a GPU context, and StrictMode's double-mount would tear it down on purpose.
createRoot(document.getElementById('root')!).render(<App />);
