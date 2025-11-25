import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import { ResumeProvider } from './context/ResumeContext';
import ResumeEditor from './components/Editor/ResumeEditor';

function App() {
  return (
    <ResumeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="editor" element={<ResumeEditor />} />
            <Route path="templates" element={<div className="text-center py-12">Templates Page Coming Soon</div>} />
          </Route>
        </Routes>
      </Router>
    </ResumeProvider>
  );
}

export default App;
