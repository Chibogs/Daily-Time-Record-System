import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const auth = useAuth();
  const isStudent = auth.user?.role === 'Student';

  return (
    <div className="dashboard-page">
      <section className="page-heading dashboard-heading">
        <div>
          <p className="page-eyebrow">Dashboard</p>
          <h1>Good day, {auth.user?.fullName}.</h1>
          <p className="page-description">
            {isStudent
              ? 'Keep your attendance record up to date from one place.'
              : 'Stay on top of attendance activity across your workspace.'}
          </p>
        </div>
      </section>

      <section className="dashboard-hero" aria-label="Workspace summary">
        <div className="dashboard-hero-main">
          <p className="dashboard-hero-label">{isStudent ? 'Attendance workspace' : 'Administration workspace'}</p>
          <h2>{isStudent ? 'Your daily time record, in one place.' : 'Manage attendance with confidence.'}</h2>
          <p>
            {isStudent
              ? 'Record today\'s attendance and keep track of your submitted time records.'
              : 'Review attendance requests and maintain user access from your workspace.'}
          </p>
          <NavLink to={isStudent ? '/attendance' : '/admin/attendance'} className="dashboard-primary-link">
            {isStudent ? 'Open attendance' : 'Review requests'}
            <span aria-hidden="true">&#8594;</span>
          </NavLink>
        </div>
        <div className="dashboard-hero-aside">
          <span className="dashboard-hero-aside-label">Signed in as</span>
          <strong>{isStudent ? 'Student' : 'Administrator'}</strong>
          <span className="dashboard-hero-aside-rule" aria-hidden="true" />
          <span className="dashboard-hero-aside-note">
            {isStudent ? 'Personal attendance records' : 'Attendance and user management'}
          </span>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">Quick access</p>
            <h2>Common tasks</h2>
          </div>
          <p className="dashboard-section-note">Choose a workspace to continue</p>
        </div>

        <div className="action-grid">
          {isStudent ? (
            <>
              <NavLink to="/attendance" className="action-card">
                <span className="action-number">01</span>
                <span className="action-copy">
                  <strong>Record attendance</strong>
                  <span>Record time in or out and review today&apos;s status.</span>
                </span>
                <span className="action-arrow" aria-hidden="true">&#8594;</span>
              </NavLink>
              <NavLink to="/history" className="action-card">
                <span className="action-number">02</span>
                <span className="action-copy">
                  <strong>View attendance history</strong>
                  <span>Review your previous attendance records.</span>
                </span>
                <span className="action-arrow" aria-hidden="true">&#8594;</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/admin/attendance" className="action-card">
                <span className="action-number">01</span>
                <span className="action-copy">
                  <strong>Review attendance requests</strong>
                  <span>Review and respond to pending time-out requests.</span>
                </span>
                <span className="action-arrow" aria-hidden="true">&#8594;</span>
              </NavLink>
              <NavLink to="/admin/users" className="action-card">
                <span className="action-number">02</span>
                <span className="action-copy">
                  <strong>Manage users</strong>
                  <span>Create accounts and manage workspace access.</span>
                </span>
                <span className="action-arrow" aria-hidden="true">&#8594;</span>
              </NavLink>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
