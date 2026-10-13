import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const auth = useAuth();
  const isStudent = auth.user?.role === 'Student';

  return (
    <div className="dashboard-page">
      <section className="page-heading dashboard-heading">
        <div>
          <p className="page-eyebrow">Overview</p>
          <h1>Good day, {auth.user?.fullName}.</h1>
          <p className="page-description">
            {isStudent
              ? 'Keep your attendance record up to date from one place.'
              : 'Stay on top of attendance activity across your workspace.'}
          </p>
        </div>
      </section>

      <section className="dashboard-hero" aria-label="Workspace summary">
        <div>
          <p className="dashboard-hero-label">Your workspace</p>
          <h2>{isStudent ? 'Ready to record today?' : 'Keep the day moving.'}</h2>
          <p>
            {isStudent
              ? 'Use the attendance workspace to record your time in and time out.'
              : 'Review requests and keep user records organized from the admin tools.'}
          </p>
        </div>
        <div className="dashboard-hero-mark" aria-hidden="true">DTR</div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">Quick access</p>
          </div>
        </div>

        <div className="action-grid">
          {isStudent ? (
            <>
              <NavLink to="/attendance" className="action-card">
                <span className="action-number">01</span>
                <span className="action-copy">
                  <strong>Record attendance</strong>
                  <span>Time in, time out, and review today&apos;s status.</span>
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
                  <span>Approve or reject pending time-out requests.</span>
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