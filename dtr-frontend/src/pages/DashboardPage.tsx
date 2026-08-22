import {useAuth} from '../hooks/useAuth';

function DashboardPage() {
  const auth = useAuth();


  return (
    <div className="dashboard-page">
      <h1>Dashboard Page</h1>
      <p>Welcome, {auth.user?.fullName}!</p>
      <p>You are logged in as {auth.user?.role}.</p>
      {/* Add your dashboard content here */}

    </div> 
  );
  
}

export default DashboardPage;