import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import Capabilities from './pages/Capabilities';
import Approach from './pages/Approach';
import Insights from './pages/Insights';
import InsightDetail from './pages/InsightDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Impressum from './pages/Impressum';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import LocalLanding from './pages/LocalLanding';
import CookieBanner from './components/CookieBanner';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<ProjectDetail />} />
          <Route path="/local/:id" element={<LocalLanding />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/insights/:id" element={<InsightDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/privacy" element={<Privacy />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieBanner />
      </Layout>
    </Router>
  );
}
