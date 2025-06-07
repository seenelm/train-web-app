import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import './styles/global.css'
import App from './App.tsx'

const root = document.getElementById("root");

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
 
  const { worker } = await import('./mocks/browser.ts')
 
  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(root!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
