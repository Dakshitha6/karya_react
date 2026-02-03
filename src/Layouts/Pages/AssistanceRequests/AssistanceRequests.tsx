import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllAssistanceAPI, updateAssistanceDetailsAPI } from '../../../apis/assistance.api';
import { AssistanceIF, AssistanceFilterIF } from '../../../types/assistance.interface';
import { TABLE_ROW_COUNT, PROGRESS_STATUS } from '../../../constants/general.data';
import { useDebounce } from '../../../hooks/useDebounce';
import { useToast } from '../../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';
import { getSeverityByStage, formatStage } from '../../../utils/assistance.function';
import { useUserCache } from '../../../hooks/useUserCache';
import { userCacheService } from '../../../services/userCache.service';
import './AssistanceRequests.scss';

const AssistanceRequests = () => {
  const [assistanceList, setAssistanceList] = useState<AssistanceIF[]>([]);
  const { updateCache, getUser, userCache, cacheVersion: _cacheVersion } = useUserCache();
  const [isTableLoading, setIsTableLoading] = useState(true);
  
  // cacheVersion is used to force re-render when users are loaded
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAvailableAssistance, setTotalAvailableAssistance] = useState(0);
  const [tablePaginationFirst, setTablePaginationFirst] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [tableFilters, setTableFilters] = useState<AssistanceFilterIF>({});
  const [selectedStatus, setSelectedStatus] = useState<string>(PROGRESS_STATUS[0].code);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchKey, 300);
  const toast = useToast();
  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef<string>('');

  // Initialize from URL params on mount
  useEffect(() => {
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const progressStatus = searchParams.get('progressStatus') || 'open';

    const isValidStatus = PROGRESS_STATUS.some((s) => s.code === progressStatus);
    const status = isValidStatus ? progressStatus : 'open';

    if (search) {
      setSearchKey(search);
    }

    setSelectedStatus(status);

    const pageNum = parseInt(page);
    setCurrentPage(pageNum);

    if (pageNum === 1) {
      setTablePaginationFirst(0);
    } else {
      setTablePaginationFirst((pageNum - 1) * TABLE_ROW_COUNT);
    }

    setTableFilters({
      progressStatus: status,
      uid: null,
      stage: null,
      requestedOn: null,
      recentlyModified: null,
    });

    isInitialMount.current = false;
  }, []);

  // Fetch assistance when filters/page/search change
  useEffect(() => {
    if (isInitialMount.current) return;

    const filtersKey = JSON.stringify({ currentPage, tableFilters, searchKey: debouncedSearch });
    
    if (prevFiltersRef.current === filtersKey) return;
    prevFiltersRef.current = filtersKey;

    const fetchAssistance = async () => {
      setIsTableLoading(true);
      setAssistanceList([]);

      try {
        const result = await getAllAssistanceAPI({
          page: currentPage,
          count: TABLE_ROW_COUNT,
          filters: tableFilters,
          search: debouncedSearch || undefined,
        });

        const assistanceRequests = result?.assistanceRequests ?? [];
        setAssistanceList(assistanceRequests);
        setTotalAvailableAssistance(result?.totalCount ?? 0);

        // Process UIDs for cache (similar to Angular's processUsedIdsForCache)
        const uids = assistanceRequests
          .map((i) => i.metadataCreate?.by)
          .filter((uid): uid is string => !!uid);

        if (uids.length > 0) {
          try {
            await updateCache(uids);
          } catch (error) {
            console.error('Error updating user cache:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching assistance:', error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchAssistance();
  }, [currentPage, tableFilters, debouncedSearch]);

  // Update URL when debounced search changes
  useEffect(() => {
    if (isInitialMount.current) return;
    
    const currentSearch = searchParams.get('search') || '';
    if (debouncedSearch !== currentSearch) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch) {
        newParams.set('search', debouncedSearch);
      } else {
        newParams.delete('search');
      }
      newParams.set('page', '1');
      setSearchParams(newParams, { replace: true });
      setCurrentPage(1);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Handle URL param changes
  useEffect(() => {
    if (isInitialMount.current) return;

    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const progressStatus = searchParams.get('progressStatus') || 'open';

    const isValidStatus = PROGRESS_STATUS.some((s) => s.code === progressStatus);
    const status = isValidStatus ? progressStatus : 'open';

    const pageNum = parseInt(page);
    if (pageNum !== currentPage) {
      setCurrentPage(pageNum);
      if (pageNum === 1) {
        setTablePaginationFirst(0);
      } else {
        setTablePaginationFirst((pageNum - 1) * TABLE_ROW_COUNT);
      }
    }

    if (search !== searchKey) {
      setSearchKey(search);
    }

    if (status !== selectedStatus) {
      setSelectedStatus(status);
      setTableFilters((prev) => ({
        ...prev,
        progressStatus: status,
      }));
    }
  }, [searchParams]);

  // Update user cache when assistance list changes
  useEffect(() => {
    if (assistanceList.length === 0) return;

    const uids = assistanceList
      .map((i) => i.metadataCreate?.by)
      .filter((uid): uid is string => !!uid);

    if (uids.length > 0) {
      updateCache(uids).catch((error) => {
        console.error('Error updating user cache:', error);
      });
    }
  }, [assistanceList, updateCache]);

  const [tableScrollHeight, setTableScrollHeight] = useState(window.innerHeight - 320);

  useEffect(() => {
    const setTableScrolling = () => {
      setTableScrollHeight(window.innerHeight - 320);
    };
    setTableScrolling();
    window.addEventListener('resize', setTableScrolling);
    return () => window.removeEventListener('resize', setTableScrolling);
  }, []);

  const updateQueryParams = useCallback((params: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });

    setSearchParams(newParams, { replace: false });
  }, [searchParams, setSearchParams]);

  const handleStatusChange = (code: string) => {
    // Update state immediately
    setSelectedStatus(code);
    setCurrentPage(1);
    setTablePaginationFirst(0);
    
    // Update filters immediately to trigger fetch
    const newFilters: AssistanceFilterIF = {
      ...tableFilters,
      progressStatus: code,
    };
    setTableFilters(newFilters);
    
    // Update URL params
    updateQueryParams({ progressStatus: code, page: 1 });
  };

  const handleRowClick = (id?: string) => {
    if (id) {
      navigate(`/assistance-requests/${id}`);
    }
  };

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      updateQueryParams({ page: currentPage - 1 });
    } else if (direction === 'next' && tablePaginationFirst + TABLE_ROW_COUNT < totalAvailableAssistance) {
      updateQueryParams({ page: currentPage + 1 });
    }
  };

  const handleComplete = async (request: AssistanceIF) => {
    if (!window.confirm('Are you sure that you want to complete this assistance request?')) {
      return;
    }

    try {
      const detailsToUpdate: AssistanceIF = {
        progressStatus: 'completed',
        metadataCreate: request.metadataCreate,
      };

      const result = await updateAssistanceDetailsAPI(detailsToUpdate, request._id!);

      if (result) {
        setAssistanceList((prev) => prev.filter((item) => item._id !== request._id));
        toast.success('Successfully moved to completed.');
      } else {
        toast.error('Unable to complete. Try again');
      }
    } catch (error) {
      console.error('Error completing assistance:', error);
      toast.error('Unable to complete. Try again');
    }
  };

  const handleCancel = async (request: AssistanceIF) => {
    if (!window.confirm('Are you sure that you want to mark this assistance request as cancelled?')) {
      return;
    }

    try {
      const detailsToUpdate: AssistanceIF = {
        progressStatus: 'cancelled',
        metadataCreate: request.metadataCreate,
      };

      const result = await updateAssistanceDetailsAPI(detailsToUpdate, request._id!);

      if (result) {
        setAssistanceList((prev) => prev.filter((item) => item._id !== request._id));
        toast.success('Successfully moved to cancelled');
      } else {
        toast.error('Unable to cancel. Try again');
      }
    } catch (error) {
      console.error('Error cancelling assistance:', error);
      toast.error('Unable to cancel. Try again');
    }
  };

  return (
    <div className="assistance-requests-page">
      <div className="page-header">
        <h2>Assistance Requests</h2>
      </div>
      <div className="page-body">
        <div className="status-segment">
          {PROGRESS_STATUS.map((status) => (
            <button
              key={status.code}
              className={`segment-button ${selectedStatus === status.code ? 'active' : ''}`}
              onClick={() => handleStatusChange(status.code)}
            >
              {status.name}
            </button>
          ))}
        </div>

        <div className="table-container" style={{ maxHeight: `${tableScrollHeight}px` }}>
          <table className="assistance-table">
            <thead>
              <tr>
                <th >User name</th>
                <th>Mobile number</th>
                <th>Email</th>
                <th>Requested date</th>
                <th>Stage</th>
                {selectedStatus === 'open' && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {isTableLoading ? (
                Array.from({ length: TABLE_ROW_COUNT }).map((_, index) => (
                  <tr key={index}>
                    <td >
                      <div className="skeleton" />
                    </td>
                    <td>
                      <div className="skeleton" />
                    </td>
                    <td>
                      <div className="skeleton" />
                    </td>
                    <td>
                      <div className="skeleton" />
                    </td>
                    <td>
                      <div className="skeleton" />
                    </td>
                    {selectedStatus === 'open' && (
                      <td>
                        <div className="skeleton" />
                      </td>
                    )}
                  </tr>
                ))
              ) : assistanceList.length === 0 ? (
                <tr>
                  <td colSpan={selectedStatus === 'open' ? 6 : 5} className="empty-state">
                    <img
                      src="/illustrations/no_data.svg"
                      alt="No data"
                      height="100"
                      width="100"
                    />
                    <p className="empty-text">No Assistance Request</p>
                  </td>
                </tr>
              ) : (
                assistanceList.map((request) => {
                  const uid = request.metadataCreate?.by;
                  // Try to get from local cache first, then from service cache
                  const user = uid ? (userCache.get(uid) || userCacheService.getUserFromCacheSync(uid)) : null;
                  
                  return (
                    <tr key={request._id} className="table-row">
                      <td
                        className="cursor-pointer"
                        onClick={() => handleRowClick(request._id)}
                      >
                        {user?.username || '-'}
                      </td>
                      <td className="cursor-pointer" onClick={() => handleRowClick(request._id)}>
                        {user?.primaryMobile || '-'}
                      </td>
                      <td className="cursor-pointer" onClick={() => handleRowClick(request._id)}>
                        {user?.primaryEmail || '-'}
                      </td>
                      <td className="cursor-pointer" onClick={() => handleRowClick(request._id)}>
                        {request.metadataCreate?.at
                          ? formatDate(request.metadataCreate.at)
                          : '-'}
                      </td>
                      <td
                        className={`cursor-pointer ${selectedStatus !== 'open' ? 'dynamic-padding' : ''}`}
                        onClick={() => handleRowClick(request._id)}
                      >
                        <span
                          className={`stage-tag ${getSeverityByStage(request.stage)}`}
                        >
                          {formatStage(request.stage)}
                        </span>
                      </td>
                      {selectedStatus === 'open' && (
                        <td className="action-buttons">
                          <button
                            className="action-btn success"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleComplete(request);
                            }}
                            title="Mark assistance as Completed"
                          >
                            ✓
                          </button>
                          <button
                            className="action-btn danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(request);
                            }}
                            title="Mark assistance as Cancelled"
                          >
                            ×
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalAvailableAssistance > 0 && (
          <div className="pagination-section">
            <div className="pagination-info">
              Showing {tablePaginationFirst + 1} to{' '}
              {Math.min(tablePaginationFirst + TABLE_ROW_COUNT, totalAvailableAssistance)} of{' '}
              {totalAvailableAssistance}
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange('prev')}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-number">Page {currentPage}</span>
              <button
                onClick={() => handlePageChange('next')}
                disabled={tablePaginationFirst + TABLE_ROW_COUNT >= totalAvailableAssistance}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistanceRequests;


