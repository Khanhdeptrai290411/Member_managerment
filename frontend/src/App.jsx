import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditMember from './pages/EditMember';
import CreateMember from './pages/CreateMember';

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1>Member Management</h1>
          </div>
        </div>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/members/new" element={<CreateMember />} />
          <Route path="/members/:id" element={<EditMember />} />
        </Routes>
      </main>
    </div>
  );
}
