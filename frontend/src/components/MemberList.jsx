import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memberService } from '../services/api';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, searchField]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, searchField]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await memberService.getAll();
      setMembers(data);
      setFilteredMembers(data);
      setError(null);
    } catch (err) {
      setError('Unable to load member list');
      console.error('Error loading members:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member => {
      const term = searchTerm.toLowerCase();
      
      switch (searchField) {
        case 'name':
          return member.name?.toLowerCase().includes(term);
        case 'email':
          return member.email?.toLowerCase().includes(term);
        case 'phone':
          return member.phone?.toLowerCase().includes(term);
        case 'city':
          return member.city?.toLowerCase().includes(term);
        case 'country':
          return member.country?.toLowerCase().includes(term);
        default:
          return (
            member.name?.toLowerCase().includes(term) ||
            member.email?.toLowerCase().includes(term) ||
            member.phone?.toLowerCase().includes(term) ||
            member.city?.toLowerCase().includes(term) ||
            member.country?.toLowerCase().includes(term)
          );
      }
    });

    setFilteredMembers(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.delete(id);
        setMembers(members.filter(member => member.id !== id));
        alert('Delete member successfully!');
      } catch (err) {
        alert('An error occurred while deleting member');
        console.error('Error deleting member:', err);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchField('all');
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
          <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="message error">
        <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#495057' }}>
          Member List ({filteredMembers.length} of {members.length})
        </h3>
        <Link to="/members/new" className="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add new member
        </Link>
      </div>

      {/* Search Section */}
      <div className="search-section" style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#495057' }}>
              Search Field
            </label>
            <select 
              value={searchField} 
              onChange={(e) => setSearchField(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="city">City</option>
              <option value="country">Country</option>
            </select>
          </div>
          
          <div style={{ flex: '2', minWidth: '300px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#495057' }}>
              Search Term
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}...`}
                style={{
                  flex: '1',
                  padding: '0.75rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        {searchTerm && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', color: '#667eea' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.5rem' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
            Found {filteredMembers.length} member(s) matching "{searchTerm}" in {searchField === 'all' ? 'all fields' : searchField}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredMembers.length > 0 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '1rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#495057', fontWeight: '500' }}>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              style={{
                padding: '0.5rem',
                border: '2px solid #e9ecef',
                borderRadius: '6px',
                fontSize: '0.9rem',
                background: 'white'
              }}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
            </select>
          </div>
          
          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} results
          </div>
        </div>
      )}

      {filteredMembers.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {searchTerm ? (
            <>
              <h3>No members found</h3>
              <p>No members match your search criteria. Try adjusting your search terms.</p>
            </>
          ) : (
            <>
              <h3>No member found</h3>
              <p>Please add the first member to start managing!</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Birthday</th>
                  <th>City</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div style={{ fontWeight: '500', color: '#495057' }}>{member.name}</div>
                    </td>
                    <td>
                      <div style={{ color: '#6c757d' }}>{member.email}</div>
                    </td>
                    <td>
                      <div style={{ color: '#6c757d' }}>{member.phone || '-'}</div>
                    </td>
                    <td>
                      <div style={{ color: '#6c757d' }}>
                        {member.birthday ? new Date(member.birthday).toLocaleDateString('vi-VN') : '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ color: '#6c757d' }}>{member.city || '-'}</div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/members/${member.id}`} className="action-link">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="delete-btn"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '0.25rem' }}>
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  background: currentPage === 1 ? '#f8f9fa' : 'white',
                  color: currentPage === 1 ? '#6c757d' : '#495057',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
                Previous
              </button>

              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '6px',
                      background: currentPage === page ? '#667eea' : 'white',
                      color: currentPage === page ? 'white' : '#495057',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      minWidth: '2.5rem'
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '6px',
                  background: currentPage === totalPages ? '#f8f9fa' : 'white',
                  color: currentPage === totalPages ? '#6c757d' : '#495057',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MemberList;
