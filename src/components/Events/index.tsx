import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Col, Container, Modal, Row, Toast } from 'react-bootstrap';
import { AiFillPlusCircle } from 'react-icons/ai';
import moment from 'moment';
import { uri, months } from '../constants';
import AddEvent from './components/AddEvent';

const Events = () => {
  const [eventsCommon, setEventsCommon] = useState([]);
  const [eventsExtra, setEventsExtra] = useState([]);
  const [extra, setExtra] = useState(false);
  const [status, setAddStatus] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [requestState, setRequestState] = useState('');

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
  }, [newEvent]);

  return (
    <Col md={9}>
      <Container className="main-wrapper events-wrapper" fluid>
        <Row>
          <h1>Extracurriculares</h1>
        </Row>
        <Row>
          <Card style={{ width: '5rem' }} className="card-add-new">
            <Card.Body>
              <AiFillPlusCircle
                onClick={() => {
                  setExtra(true);
                  setShowAddEvent(true);
                }}
              />
            </Card.Body>
          </Card>
          {eventsExtra.length && eventsExtra.map((event, i) => (
              <Card key={i} className="event-card" style={{ width: '10rem' }}>
                <Card.Body>
                  <Card.Title>{event.descripcion}</Card.Title>
                </Card.Body>
              </Card>
            ))}
        </Row>
        <Row>
          <h1>Comunes</h1>
        </Row>
        <Row>
          <Card style={{ width: '5rem' }} className="card-add-new">
            <Card.Body>
              <AiFillPlusCircle
                onClick={() => {
                  setExtra(false);
                  setShowAddEvent(true);
                }}
              />
            </Card.Body>
          </Card>
          {eventsCommon.length > 0 && eventsCommon.map((event, i) => (
              <Card key={i} className="event-card" style={{ width: '18rem' }}>
                <Card.Body>
                  <Row>
                    <Col md={2} className="event-card--side">
                      <div className="event-card--date">
                        {`${moment(event.hora_inicio)
                          .subtract(5, 'hours')
                          .format('D')}`}
                      </div>
                      <div className="event-card--month">
                        {`${months[moment(event.hora_inicio)
                          .subtract(5, 'hours')
                          .format('M') - 1]
                        }`}
                      </div>
                    </Col>
                    <Col md={10}>
                      <Card.Title>{event.descripcion}</Card.Title>
                      <Card.Subtitle>{`${moment(event.hora_inicio)
                        .subtract(5, 'hours')
                        .format('LT')} - ${moment(event.hora_fin)
                        .subtract(5, 'hours')
                        .format('LT')}`}</Card.Subtitle>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
        </Row>
        <Modal show={showAddEvent} size="lg">
          <AddEvent
            status={() => setAddStatus(true)}
            handleClose={() => setShowAddEvent(false)}
            newEvent={() => setNewEvent(true)}
          />
        </Modal>
        <Toast
          onClose={() => setAddStatus(false)}
          show={status}
          delay={3000}
          autohide
        >
          <Toast.Body>Evento creado correctamente</Toast.Body>
        </Toast>
      </Container>
    </Col>
  );
}

export default Events;
