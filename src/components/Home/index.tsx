import React, { useState, useEffect } from 'react';
import  { Redirect } from 'react-router-dom'
import { ipcRenderer } from 'electron';
import { useLocation } from 'react-router-dom';
import { Alert, Button, Form, Col, Jumbotron } from 'react-bootstrap';
import mainLogo from '../../../assets/main.png';

const Home = () => {

  return (
    <Col md={9}>
      <img src={mainLogo} alt="main logo" width="600" />
      <Jumbotron style={ { marginTop: '30px'} }>
        Bienvenido al sistema de control de horas de bienestar de la Universidad Cooperativa de Colombia,
        en él podrás registrar las horas de los estudiantes en los diferentes eventos que se creen,
        bien sean <b>Extracurriculares</b> o <b>Comunes</b>.
      </Jumbotron>
    </Col>
  );
};

export default Home;
