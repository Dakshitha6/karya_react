import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>
      <div className="page-body">
        <div className="coming-soon-container">
          <img
            src="/coming_soon.svg"
            alt="Coming soon"
            className="coming-soon-image"
          />
          <p className="coming-soon-text">Good Things Take Time. Stay tuned.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


