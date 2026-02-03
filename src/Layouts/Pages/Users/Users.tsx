import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllUsersAPI } from '../../../apis/user.api';
import { UserIF, UserFilterIF } from '../../../types/users.interface';
import { DropDownIF } from '../../../types/general.interface';
import { TABLE_ROW_COUNT } from '../../../constants/general.data';
import { useDebounce } from '../../../hooks/useDebounce';
import { formatValue, formatDate } from '../../../utils/formatters';
import './Users.scss';

const USER_FILTER_TYPES: DropDownIF[] = [
  { code: 'all', name: 'All users' },
  { code: 'pro', name: 'Pro users' },
  { code: 'free', name: 'Free users' },
];

const Users = () => {
  const [usersList, setUsersList] = useState<UserIF[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalMatchingUsers, setTotalMatchingUsers] = useState(0);
  const [tablePaginationFirst, setTablePaginationFirst] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [tableFilters, setTableFilters] = useState<UserFilterIF>({});
  const [selectedUserType, setSelectedUserType] = useState<DropDownIF>(USER_FILTER_TYPES[0]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const debouncedSearch = useDebounce(searchKey, 300);
  const isInitialMount = useRef(true);
  const prevFiltersRef = useRef<string>('');

  // Initialize from URL params on mount
  useEffect(() => {
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const userType = searchParams.get('userType') || 'all';

    if (search) {
      setSearchKey(search);
    }

    const selectedType =
      USER_FILTER_TYPES.find((type) => type.code === userType) || USER_FILTER_TYPES[0];
    setSelectedUserType(selectedType);

    const pageNum = parseInt(page);
    setCurrentPage(pageNum);

    if (pageNum === 1) {
      setTablePaginationFirst(0);
    } else {
      setTablePaginationFirst((pageNum - 1) * TABLE_ROW_COUNT);
    }

    setTableFilters({
      userType: selectedType.code === 'all' ? null : selectedType.code,
      joinedDate: null,
    });

    isInitialMount.current = false;
  }, []); // Only run on mount

  // Fetch users when filters/page/search change
  useEffect(() => {
    if (isInitialMount.current) return; // Skip on initial mount, let the URL param effect run first

    const filtersKey = JSON.stringify({ currentPage, tableFilters, searchKey: debouncedSearch });
    
    // Only fetch if filters actually changed
    if (prevFiltersRef.current === filtersKey) return;
    prevFiltersRef.current = filtersKey;

    const fetchUsers = async () => {
      setIsTableLoading(true);
      setUsersList([]);

      try {
        const result = await getAllUsersAPI({
          page: currentPage,
          count: TABLE_ROW_COUNT,
          filters: tableFilters,
          search: debouncedSearch || undefined,
        });

        setUsersList(result?.users ?? []);
        setTotalUsers(result?.totalDocCount ?? 0);
        setTotalMatchingUsers(result?.totalMatchedCount ?? 0);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchUsers();
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
      newParams.set('page', '1'); // Reset to page 1 on search
      setSearchParams(newParams, { replace: true });
      setCurrentPage(1);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // Handle URL param changes (back/forward navigation)
  useEffect(() => {
    if (isInitialMount.current) return;

    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search') || '';
    const userType = searchParams.get('userType') || 'all';

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

    const selectedType =
      USER_FILTER_TYPES.find((type) => type.code === userType) || USER_FILTER_TYPES[0];
    if (selectedType.code !== selectedUserType.code) {
      setSelectedUserType(selectedType);
      setTableFilters({
        userType: selectedType.code === 'all' ? null : selectedType.code,
        joinedDate: null,
      });
    }
  }, [searchParams]); // Only depend on searchParams

  const [tableScrollHeight, setTableScrollHeight] = useState(window.innerHeight - 310);

  useEffect(() => {
    const setTableScrolling = () => {
      setTableScrollHeight(window.innerHeight - 310);
    };
    setTableScrolling();
    window.addEventListener('resize', setTableScrolling);
    return () => window.removeEventListener('resize', setTableScrolling);
  }, []);

  const handleUserRowClick = (uid?: string) => {
    if (uid) {
      navigate(`/users/${uid}`);
    }
  };

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

  const handlePageChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPage > 1) {
      updateQueryParams({ page: currentPage - 1 });
    } else if (direction === 'next' && tablePaginationFirst + TABLE_ROW_COUNT < totalMatchingUsers) {
      updateQueryParams({ page: currentPage + 1 });
    }
  };

  const handleFilterByUserType = () => {
    updateQueryParams({ userType: selectedUserType.code, page: 1 });
  };

  const handleSearchChange = (value: string) => {
    setSearchKey(value);
    // Don't update URL here - let debounce handle it
  };

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>Users</h2>
        <h3 className="total-users">Total Users: {totalUsers}</h3>
      </div>
      <div className="page-body">
        <div className="filters-section">
          <div className="search-input-wrapper">
            <span className="search-icon"> <i className="pi pi-search" /></span>
            <input
              type="text"
              placeholder="Search"
              value={searchKey}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={selectedUserType.code}
            onChange={(e) => {
              const type = USER_FILTER_TYPES.find((t) => t.code === e.target.value) || USER_FILTER_TYPES[0];
              setSelectedUserType(type);
              handleFilterByUserType();
            }}
            className="filter-select"
          >
            {USER_FILTER_TYPES.map((type) => (
              <option key={type.code} value={type.code}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="table-container" style={{ maxHeight: `${tableScrollHeight}px` }}>
          <table className="users-table">
            <thead>
              <tr>
                <th >Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Profession</th>
                <th>User Type</th>
                <th>Joined date</th>
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
                    <td>
                      <div className="skeleton" />
                    </td>
                  </tr>
                ))
              ) : usersList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <img
                      src="/illustrations/no_data.svg"
                      alt="No data"
                      height="100"
                      width="100"
                    />
                    <p className="empty-text">No users</p>
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr
                    key={user._id}
                    className="table-row"
                    onClick={() => handleUserRowClick(user.uid)}
                  >
                    <td >
                      {formatValue(user.username, 'titlecase')}
                    </td>
                    <td>{user.primaryMobile || '-'}</td>
                    <td>{user.primaryEmail || '-'}</td>
                    <td>{user.profession || '-'}</td>
                    <td>
                      <span className={`user-type-tag ${user.isPro ? 'pro' : 'free'}`}>
                        {user.isPro ? 'Pro' : 'Free'}
                      </span>
                    </td>
                    <td>
                      {user._id
                        ? formatDate(formatValue(user._id, 'dateFromObjectId'))
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalMatchingUsers > 0 && (
          <div className="pagination-section">
            <div className="pagination-info">
              Showing {tablePaginationFirst + 1} to{' '}
              {Math.min(tablePaginationFirst + TABLE_ROW_COUNT, totalMatchingUsers)} of{' '}
              {totalMatchingUsers}
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
                disabled={tablePaginationFirst + TABLE_ROW_COUNT >= totalMatchingUsers}
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

export default Users;
