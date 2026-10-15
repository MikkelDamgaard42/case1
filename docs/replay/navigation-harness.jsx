/* Test-only entry: links exercise same-session route changes without changing product UI. */
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Link} from 'react-router';
import App from '../../src/App.jsx';
import '../../src/styles.css';
createRoot(document.getElementById('root')).render(<StrictMode><BrowserRouter><nav aria-label="Testnavigation"><Link to="/events/9">Test event 9</Link>{' | '}<Link to="/events/1">Test event 1</Link>{' | '}<Link to="/events/999999">Test unknown event</Link></nav><App/></BrowserRouter></StrictMode>);
