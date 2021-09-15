import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Col, Jumbotron, Container, Row, Form, Button, Modal, Toast } from 'react-bootstrap';
import { SiNfc } from 'react-icons/si';
import { ipcRenderer } from 'electron';
import nfcLogo from '../../../assets/NFC.gif';
import { uri } from '../constants';
import { useLocation } from 'react-router-dom';

const Associate = () => {
  const [studentId, setStudentId] = useState('');
  const [requestState, setRequestState] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [student, setStudent] = useState('');
  const location = useLocation();

  const registerStudent = (event, arg) => {
    setRequestState('loading');
    const cardKey = arg.atr.toString();

    console.log(cardKey, studentId);
    if (location.pathname === '/associate' && studentId !== '') {
      axios
        .put(`${uri}/users/card`, {
          cardId: cardKey,
          idStudent: studentId,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setShowModal(false);
            setStudentId('');
            setStudent('');
            setRequestState('update-card');
            ipcRenderer.removeListener('card-inserted', registerStudent);
            return setShowToast(true);
          }

          return setRequestState('error');
        })
        .catch(err => {
          console.log(err)
          setRequestState('error');
        });
    } else {
      ipcRenderer.removeListener('card-inserted', registerStudent);
    }
  };

  useEffect(() => {
    if (showModal) {
      ipcRenderer.on('card-inserted', registerStudent);
    } else {
      ipcRenderer.removeListener('card-inserted', registerStudent);
    }
  }, [showModal]);

  const searchStudent = () => {
    const reg = /^\d+$/;

    if (reg.test(studentId)) {
      axios
        .get(`${uri}/users/user?st=${studentId}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.length) {
            const { id_carnet, nombre, apellido } = res.data[0];
            setShowModal(true);
            setStudent(`${nombre} ${apellido}`);
            if (id_carnet !== '') {
              return setRequestState('update-card');
            }
            return setRequestState('link-card');
          }
          setShowToast(true);
          return setRequestState('student-not-found');
        })
        .catch((err) => {
          setShowToast(true);
          setRequestState('error');
        });
    } else {
      setShowToast(true);
      setRequestState('error');
    }
  }

  return (
    <Col md={9} className="associate">
      <Container fluid>
        <Row>
          <Jumbotron fluid>
            <Container>
              <h1 style={{textAlign: 'center'}}>
                <SiNfc /> <br />
                Vincular carné
              </h1>
              <p>Por favor busca el estudiante a relacionar, posteriormente selecciona "Vincular" y pasas el carné por el lector</p>
            </Container>
          </Jumbotron>
        </Row>
        <Row>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder="Número de identificación"
                  onChange={(e) => setStudentId(e.target.value)}
                  value={studentId}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Button variant="primary" onClick={searchStudent}>
                  Buscar Estudiante
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {requestState === 'update-card' && `Modificar carnet de estudiante`}
            {requestState === 'link-card' && `Vincular carnet de estudiante`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <p>{`Este carnet pertenece al estudiante ${student}`}</p>
              <p>
                {requestState === 'update-card' &&
                  `Este estudiante ya tiene un id asignado, si deseas proceder, se reemplazará por el nuevo registro`}
                {requestState === 'link-card' &&
                  `Por favor pasa el carnet para realizar el registro`}
              </p>
            </Row>
            <Row>
              <Col style={{ textAlign: 'center' }}>
                <b>Por favor acerca el carnet a vincular</b>
                <img src={nfcLogo} width="200" alt="nfc" />
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        className={requestState === 'student-not-found' || requestState === 'error' ? 'danger' : 'success'}
        delay={3000}
        autohide
      >
        <Toast.Body>
          {requestState === 'update-card' && `Estudiante vinculado con éxito`}
          {requestState === 'student-not-found' &&
            `Estudiante no encontrado, por favor verifica tu búsqueda`}
          {requestState === 'error' &&
            `Algo salió mal`}
        </Toast.Body>
      </Toast>
    </Col>
  );
};

export default Associate;
