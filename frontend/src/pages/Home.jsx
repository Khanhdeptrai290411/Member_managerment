import React from 'react';
import MemberList from '../components/MemberList';

const Home = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <div className="card-header">
          <h2>Welcome to Member Management System</h2>
        </div>
        <div className="card-body">
          <MemberList />
        </div>
      </div>
    </div>
  );
};

export default Home;
