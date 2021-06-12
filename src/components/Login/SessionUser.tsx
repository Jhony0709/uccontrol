import React, { useState, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Users = () => {
  const [requestState, setRequestState] = useState('');

  const handleLogOut = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('rol');
    localStorage.removeItem('user');
    return setRequestState('success');
  }

  return useLocation().pathname !== '/' && (
      <>
        {requestState === 'success' && <Redirect to='/'/>}
        <div className="user-session">
          <label>Hola {localStorage.getItem('name')}</label>
          <FiLogOut onClick={handleLogOut} />
        </div>
      </>
  );
}

export default Users;
