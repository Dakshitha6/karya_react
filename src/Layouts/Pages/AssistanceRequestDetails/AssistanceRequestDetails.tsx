import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssistanceDetailsAPI, updateAssistanceDetailsAPI } from '../../../apis/assistance.api';
import { getUserDetailsAPI } from '../../../apis/user.api';
import { AssistanceIF } from '../../../types/assistance.interface';
import { UserIF } from '../../../types/users.interface';
import { isValidObjectId } from '../../../utils/helper.function';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';
import { getSeverityByStage, formatStage } from '../../../utils/assistance.function';
import { STAGE_LIST } from '../../../constants/general.data';
import './AssistanceRequestDetails.scss';

const AssistanceRequestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [assistanceDetails, setAssistanceDetails] = useState<AssistanceIF | null>(null);
  const [userDetails, setUserDetails] = useState<UserIF | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isUpdateButtonLoading, setIsUpdateButtonLoading] = useState(false);
  const [stage, setStage] = useState('');
  const [notes, setNotes] = useState('');
  const [attempt1Comment, setAttempt1Comment] = useState('');
  const [attempt2Comment, setAttempt2Comment] = useState('');
  const [attempt3Comment, setAttempt3Comment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !isValidObjectId(id)) {
        setIsPageLoading(false);
        setIsNotFound(true);
        return;
      }

      try {
        const result = await getAssistanceDetailsAPI(id);
        if (result) {
          setAssistanceDetails(result);
          setStage(result.stage || '');
          setNotes(result.notes || '');
          setAttempt1Comment(result.attempt1Comment || '');
          setAttempt2Comment(result.attempt2Comment || '');
          setAttempt3Comment(result.attempt3Comment || '');

          // Fetch user details if uid is available
          if (result.metadataCreate?.by) {
            const userResult = await getUserDetailsAPI(result.metadataCreate.by);
            if (userResult) {
              setUserDetails(userResult);
            }
          }
        } else {
          setIsNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching assistance details:', error);
        setIsNotFound(true);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleUpdate = async () => {
    if (!assistanceDetails?._id || !stage) {
      toast.error('Stage is required');
      return;
    }

    setIsUpdateButtonLoading(true);

    try {
      const detailsToUpdate: AssistanceIF = {
        stage,
        notes,
        attempt1Comment,
        attempt2Comment,
        attempt3Comment,
        metadataCreate: assistanceDetails.metadataCreate,
      };

      const result = await updateAssistanceDetailsAPI(detailsToUpdate, assistanceDetails._id);

      if (result) {
        setAssistanceDetails(result);
        toast.success('Assistance request updated successfully');
      } else {
        toast.error('Failed to update. Please try again');
      }
    } catch (error) {
      console.error('Error updating assistance:', error);
      toast.error('Failed to update. Please try again');
    } finally {
      setIsUpdateButtonLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="assistance-details-page loading-container">
        <div className="spinner" />
        <p>Loading assistance details...</p>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="assistance-details-page not-found-container">
        <img
          src="/illustrations/no_data.svg"
          alt="Not found"
          className="not-found-image"
        />
        <p className="not-found-text">
          Oops! The assistance request you are looking for is not found.
        </p>
        <button className="back-button" onClick={() => navigate('/assistance-requests')}>
          View all requests
        </button>
      </div>
    );
  }

  return (
    <div className="assistance-details-page">
      <div className="page-header">
        <div className="header-content">
          <button className="back-icon" onClick={handleGoBack} title="Go back">
            ←
          </button>
          <h2>Assistance Request Details</h2>
          {assistanceDetails?.transactionId && (
            <span className="transaction-id">ID: {assistanceDetails.transactionId}</span>
          )}
        </div>
      </div>
      <div className="page-body">
        <div className="details-grid">
          <div className="info-section">
            <h3>Request Information</h3>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-tag ${assistanceDetails?.progressStatus || 'open'}`}>
                {assistanceDetails?.progressStatus || 'Open'}
              </span>
            </div>
            <div className="info-item">
              <label>Stage:</label>
              <span className={`stage-tag ${getSeverityByStage(assistanceDetails?.stage)}`}>
                {formatStage(assistanceDetails?.stage)}
              </span>
            </div>
            <div className="info-item">
              <label>Requested Date:</label>
              <span>
                {assistanceDetails?.metadataCreate?.at
                  ? formatDate(assistanceDetails.metadataCreate.at)
                  : '-'}
              </span>
            </div>
            {assistanceDetails?.metadataUpdate?.at && (
              <div className="info-item">
                <label>Last Updated:</label>
                <span>{formatDate(assistanceDetails.metadataUpdate.at)}</span>
              </div>
            )}
          </div>

          {userDetails && (
            <div className="info-section">
              <h3>User Information</h3>
              <div className="info-item">
                <label>Username:</label>
                <span>{userDetails.username || '-'}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{userDetails.primaryEmail || '-'}</span>
              </div>
              <div className="info-item">
                <label>Mobile:</label>
                <span>{userDetails.primaryMobile || '-'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Update Request</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="stage">Stage *</label>
              <select
                id="stage"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select stage</option>
                {STAGE_LIST.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Add notes..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="attempt1">First Attempt Comment</label>
              <textarea
                id="attempt1"
                value={attempt1Comment}
                onChange={(e) => setAttempt1Comment(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Add comment..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="attempt2">Second Attempt Comment</label>
              <textarea
                id="attempt2"
                value={attempt2Comment}
                onChange={(e) => setAttempt2Comment(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Add comment..."
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="attempt3">Third Attempt Comment</label>
              <textarea
                id="attempt3"
                value={attempt3Comment}
                onChange={(e) => setAttempt3Comment(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Add comment..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdateButtonLoading || !stage}
              className="update-button"
            >
              {isUpdateButtonLoading ? 'Updating...' : 'Update Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistanceRequestDetails;


