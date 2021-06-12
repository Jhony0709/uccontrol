import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Jumbotron, Modal, Toast } from 'react-bootstrap';
import { SiNfc } from 'react-icons/si';
import { uri } from '../constants';
import RegEst from './components/RegEst';

const Register = () => {
  const [eventsCommon, setEventsCommon] = useState([]);
  const [eventsExtra, setEventsExtra] = useState([]);
  const [showRegEst, setShowRegEst] = useState(false);
  const [status, setStatus] = useState(false);
  const [relatedEvent, setRelatedEvent] = useState({});

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
            handleClose={() => setShowRegEst(false)}
            event={relatedEvent}
          />
        </Modal>
        <Toast
          onClose={() => setStatus(false)}
          show={status}
          delay={3000}
          autohide
        >
          <Toast.Body>Estudiante registrado correctamente</Toast.Body>
        </Toast>
      </Container>
    </Col>
  );
};

export default Register;
