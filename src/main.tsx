import { createRoot } from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/newsreader/wght.css';
import '@fontsource-variable/geist-mono/index.css';
import './styles/global.css';
import { App } from './App';

// No <StrictMode>: the WebGL hero owns a GPU context, and StrictMode's double-mount would tear it down on purpose.
createRoot(document.getElementById('root')!).render(<App />);
