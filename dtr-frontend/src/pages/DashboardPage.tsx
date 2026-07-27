import { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';

function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    auth.logout();
    navigate('/');
  }
  
  return (
    <div className="dashboard-page">
      <h1>Dashboard Page</h1>
      <p>Welcome, {auth.user?.fullName}!</p>
      <p>You are logged in as {auth.user?.role}.</p>
      {/* Add your dashboard content here */}

      <button onClick={handleLogout}>
        Logout
      </button>
    </div> 
  );
  
}

export default DashboardPage;