import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberForm from '../components/MemberForm';
import { memberService } from '../services/api';

const CreateMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await memberService.create(formData);
      alert('Add member successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating member:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        alert(`Error: ${errorMessages.join(', ')}`);
      } else {
        alert('An error occurred while adding member.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="back-btn" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12,19 5,12 12,5"></polyline>
        </svg>
        Back to list
      </div>
      
      <MemberForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateMember;
