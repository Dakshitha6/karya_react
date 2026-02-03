import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserDetailsAPI } from '../../../apis/user.api';
import { UserIF } from '../../../types/users.interface';
import { isValidFirebaseUID } from '../../../utils/helper.function';
import './UserDetails.scss';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserIF | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id || !isValidFirebaseUID(id)) {
        setIsPageLoading(false);
        setIsUserNotFound(true);
        return;
      }

      try {
        const result = await getUserDetailsAPI(id);
        if (result) {
          setUserDetails(result);
        } else {
          setIsUserNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsUserNotFound(true);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isPageLoading) {
    return (
      <div className="user-details-page loading-container">
        <div className="spinner" />
        <p>Loading user details...</p>
      </div>
    );
  }

  if (isUserNotFound) {
    return (
      <div className="user-details-page not-found-container">
        <img
          src="/illustrations/no_user.svg"
          alt="No user found"
          className="not-found-image"
        />
        <p className="not-found-text">
          Oops! the user you are looking for is not found.
        </p>
        <button className="back-button" onClick={() => navigate('/users')}>
          View all users
        </button>
      </div>
    );
  }

  return (
    <div className="user-details-page">
      <div className="page-header">
        <div className="header-content">
          <button className="back-icon" onClick={handleGoBack} title="Go back">
            ←
          </button>
          <h2>{userDetails?.username || 'User Details'}</h2>
        </div>
      </div>
      <div className="page-body">
        <div className="user-info-grid">
          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-item">
              <label>Username:</label>
              <span>{userDetails?.username || '-'}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{userDetails?.primaryEmail || '-'}</span>
            </div>
            <div className="info-item">
              <label>Mobile:</label>
              <span>{userDetails?.primaryMobile || '-'}</span>
            </div>
            <div className="info-item">
              <label>Profession:</label>
              <span>{userDetails?.profession || '-'}</span>
            </div>
            <div className="info-item">
              <label>User Type:</label>
              <span className={`user-type-tag ${userDetails?.isPro ? 'pro' : 'free'}`}>
                {userDetails?.isPro ? 'Pro' : 'Free'}
              </span>
            </div>
          </div>

          <div className="info-section">
            <h3>Credits</h3>
            <div className="info-item">
              <label>Assistance:</label>
              <span>{userDetails?.credits?.assistance || 0}</span>
            </div>
            <div className="info-item">
              <label>Mail Generate:</label>
              <span>{userDetails?.credits?.mailGenerate || 0}</span>
            </div>
            <div className="info-item">
              <label>Resume Download:</label>
              <span>{userDetails?.credits?.resumeDownload || 0}</span>
            </div>
          </div>
        </div>

        {userDetails?.details && (
          <div className="details-section">
            <h3>Resume Details</h3>
            <div className="details-content">
              {userDetails.details.name && (
                <div className="info-item">
                  <label>Name:</label>
                  <span>{userDetails.details.name}</span>
                </div>
              )}
              {userDetails.details.profileSummary && (
                <div className="info-item full-width">
                  <label>Profile Summary:</label>
                  <p>{userDetails.details.profileSummary}</p>
                </div>
              )}
              {userDetails.details.skills && userDetails.details.skills.length > 0 && (
                <div className="info-item full-width">
                  <label>Skills:</label>
                  <div className="skills-list">
                    {userDetails.details.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="coming-soon-section">
          <img
            src="/illustrations/coming_soon.svg"
            alt="Coming soon"
            className="coming-soon-image"
          />
          <p>More details coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;


