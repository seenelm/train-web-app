import Navigation from './components/navigation/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './styles/global.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-root">
        <Navigation />
      </div>
    </QueryClientProvider>
  );
}

export default App;