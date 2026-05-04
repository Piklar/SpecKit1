import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Dashboard from './pages/dashboard/Dashboard';
import WeatherPage from './pages/weather/WeatherPage';
import CropsPage from './pages/crops/CropsPage';
import CropDetail from './pages/crops/CropDetail';
import PestsPage from './pages/pests/PestsPage';
import PestDetail from './pages/pests/PestDetail';
import MyFarmPage from './pages/farm/MyFarmPage';
import AddFarmForm from './pages/farm/AddFarmForm';
import CalendarPage from './pages/calendar/CalendarPage';
import NewsPage from './pages/news/NewsPage';
import AboutPage from './pages/about/AboutPage';
import ProfilePage from './pages/profile/ProfilePage';
import { FarmProvider } from './contexts/FarmContext';
import Navbar from './components/layout/Navbar';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <FarmProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/weather" 
              element={
                <PrivateRoute>
                  <WeatherPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/crops" 
              element={
                <PrivateRoute>
                  <CropsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/crops/:id" 
              element={<PrivateRoute><CropDetail /></PrivateRoute>} 
            />
            <Route 
              path="/pests" 
              element={<PrivateRoute><PestsPage /></PrivateRoute>} 
            />
            <Route 
              path="/pests/:id" 
              element={<PrivateRoute><PestDetail /></PrivateRoute>} 
            />
            <Route 
              path="/farm" 
              element={<PrivateRoute><MyFarmPage /></PrivateRoute>} 
            />
            <Route 
              path="/farm/add" 
              element={<PrivateRoute><AddFarmForm /></PrivateRoute>} 
            />
            <Route 
              path="/calendar" 
              element={<PrivateRoute><CalendarPage /></PrivateRoute>} 
            />
            <Route 
              path="/news" 
              element={<PrivateRoute><NewsPage /></PrivateRoute>} 
            />
            <Route
              path="/profile"
              element={<PrivateRoute><ProfilePage /></PrivateRoute>}
            />
            <Route 
              path="/about" 
              element={<AboutPage />} 
            />
          </Routes>
          </FarmProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
