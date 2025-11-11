import { Route, Routes } from 'react-router-dom';
import './App.css';
import CustomerApp from './pages/CustomerApp';
import DriverApp from './pages/DriverApp';
import Home from './pages/Home';
import ErrorCustomer from './pages/ErrorCustomer';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/driver" element={<DriverApp />} />
      <Route path="/customer" element={<CustomerApp />} />
      <Route path="/error-customer" element={<ErrorCustomer />} />
    </Routes>
  );
};

export default App;
