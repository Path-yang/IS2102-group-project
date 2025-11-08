import { Route, Routes } from 'react-router-dom';
import './App.css';
import CustomerPlaceholder from './pages/CustomerPlaceholder';
import DriverApp from './pages/DriverApp';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/driver" element={<DriverApp />} />
      <Route path="/customer" element={<CustomerPlaceholder />} />
    </Routes>
  );
};

export default App;
