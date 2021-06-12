import React, { useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom'
import { ipcRenderer } from 'electron';
import { useLocation } from 'react-router-dom';
import { Alert, Button, Form, Col, Jumbotron } from 'react-bootstrap';
import mainLogo from '../../../assets/main.png';

const Reports = () => {

  console.log(useLocation());

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [requestState, setRequestState] = useState('');

  ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log("Hiii", arg) // prints "Hiii pong"
  });

  const handleHome = () => {
    console.log(email, pwd);
    const acceptedEmail = 'jhony@ucc.edu.co';
    const acceptedPwd = '1234';

    if (email === acceptedEmail && pwd === acceptedPwd) {
      return <Redirect to='/home'/>
    } else {
      setRequestState('error');
    }
  }

  return (
    <Col md={9}>
      <Jumbotron style={ { marginTop: '30px'} }>
        Este módulo aún se encuentra en desarrollo, ofrecemos disculpas
      </Jumbotron>
    </Col>
  );
};

export default Reports;
