import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import './styles/global.css'
import App from './App.tsx'

const root = document.getElementById("root");

async function enableMocking() {
  // Skip mocking if not in development or if explicitly disabled via env variable
  if (process.env.NODE_ENV !== 'development' || import.meta.env.VITE_DISABLE_MSW === 'true') {
    console.log('MSW mocking is disabled');
    return
  }
 
  const { worker } = await import('./mocks/browser.ts')
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  console.log('MSW mocking is enabled');
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(root!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
