import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Jumbotron, Modal, Toast } from 'react-bootstrap';
import { SiNfc } from 'react-icons/si';
import { uri } from '../constants';
import { ipcRenderer } from 'electron';
import RegEst from './components/RegEst';

const Register = () => {
  const [eventsCommon, setEventsCommon] = useState([]);
  const [eventsExtra, setEventsExtra] = useState([]);
  const [showRegEst, setShowRegEst] = useState(false);
  const [status, setStatus] = useState(false);
  const [relatedEvent, setRelatedEvent] = useState({});
  const [estudiante, setEstudiante] = useState({});
  const [requestState, setRequestState] = useState('');

  const registerStudent = (event, arg) => {
    const cardKey = arg.atr.toString();
    
    axios
      .get(`${uri}/users/card?card=${cardKey}`)
      .then((res) => {
        console.log(res);
        if (res.data.length) {
          const estudiante = res.data[0];
          setEstudiante(estudiante);
          setRequestState('success');
          ipcRenderer.removeListener('card-inserted', registerStudent);
        } else {
          setRequestState('error');
        }
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
        ipcRenderer.removeListener('card-inserted', registerStudent);
      });
  };

  useEffect(() => {
    if (showRegEst) {
      ipcRenderer.on('card-inserted', registerStudent);
    } else {
      ipcRenderer.removeListener('card-inserted', registerStudent);
    }
  }, [showRegEst]);

  useEffect(() => {
    axios
      .get(`${uri}/events`)
      .then((res) => {
        console.log(res.data);

        const extra = res.data.filter((e) => e.hora_fin === null);
        const common = res.data.filter((e) => e.hora_fin !== null);

        setEventsCommon(common);
        return setEventsExtra(extra);
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  }, []);

  return (
    <Col md={9}>
      <Container fluid>
        <Row>
          <Jumbotron fluid>
            <Container>
              <h1 style={{textAlign: 'center'}}>
                <SiNfc /> <br />
                Registrar horas
              </h1>
              <p>Por favor selecciona el evento a relacionar, posteriormente acerca el carné del estudiante al lector <SiNfc /> (NFC)</p>
            </Container>
          </Jumbotron>
        </Row>
        <Row>
          <h3 className="title-3">Extracurriculares</h3>
        </Row>
        <Row>
          {eventsExtra.length && eventsExtra.map((event, i) => (
              <Col
                md={5}
                key={i}
                className="select-event"
                onClick={() => {
                  setRelatedEvent(event);
                  setShowRegEst(true);
                }}>
                <p>{event.descripcion}</p>
              </Col>
            ))}
        </Row>
        <Row>
          <h3 className="title-3">Comunes</h3>
        </Row>
        <Row>
          {eventsCommon.length && eventsCommon.map((event, i) => (
              <Col
                md={5}
                key={i}
                className="select-event"
                onClick={() => {
                  setRelatedEvent(event);
                  setShowRegEst(true);
                }}>
                <p>{event.descripcion}</p>
              </Col>
            ))}
        </Row>
        <Modal show={showRegEst} size="lg">
          <RegEst
            status={() => setStatus(true)}
            handleClose={(state) => {
              setEstudiante({});
              setRequestState(state);
              setShowRegEst(false);
            }}
            event={relatedEvent}
            estudiante={estudiante}
            setEstudiante={setEstudiante}
            requestState={requestState}
            setRequestState={setRequestState}
          />
        </Modal>
        <Toast
          onClose={() => setStatus(false)}
          show={status}
          delay={3000}
          autohide
        >
          <Toast.Body>
            {requestState === 'success' && 'Estudiante registrado correctamente'}
            {requestState === 'error' && 'No es posible registrar dos veces el mismo día para el evento seleccionado'}
          </Toast.Body>
        </Toast>
      </Container>
    </Col>
  );
};

export default Register;
