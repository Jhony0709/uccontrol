import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Col, Container, Modal, Row, Toast } from 'react-bootstrap';
import { AiFillPlusCircle, AiFillEdit } from 'react-icons/ai';
import { RiDeleteBin6Line } from 'react-icons/ri';
import moment from 'moment';
import { uri, months } from '../constants';
import AddEvent from './components/AddEvent';

const Events = () => {
  const [eventsCommon, setEventsCommon] = useState([]);
  const [eventsExtra, setEventsExtra] = useState([]);
  const [extra, setExtra] = useState(false);
  const [status, setAddStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showDeleteEvent, setShowDeleteEvent] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [requestState, setRequestState] = useState('');
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    setSelectedEvent({});
    axios
      .get(`${uri}/events`)
      .then((res) => {
        console.log(res.data);

        const extra = res.data.filter((e) => e.tipo_evento === 1);
        const common = res.data.filter((e) => e.tipo_evento === 2);

        setEventsCommon(common);
        return setEventsExtra(extra);
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  }, [newEvent]);

  const handleDeleteEvent = () => {
    axios
      .delete(`${uri}/events/${selectedEvent.id}`)
      .then((res) => {
        setSelectedEvent({});
        setNewEvent(true);
        setDeleteStatus(true);
        return setShowDeleteEvent(false);
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  };

  const modifyEvent = (event) => {
    setSelectedEvent(event);
    setShowAddEvent(true);
  };

  const deleteEvent = (event) => {
    setSelectedEvent(event);
    setShowDeleteEvent(true);
  };

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
                  {localStorage.getItem('rol') === 'admin' && moment().diff(moment(event.hora_inicio).subtract(5, 'hours'), 'days') < 0 && (
                      <Row className="event-card--actions">
                        <AiFillEdit onClick={() => modifyEvent(event)} />
                        <RiDeleteBin6Line onClick={() => deleteEvent(event)} />
                      </Row>
                    )}
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
            handleClose={() => {
              setShowAddEvent(false);
              setSelectedEvent({});
            }}
            newEvent={() => setNewEvent(true)}
            selectedEvent={selectedEvent}
          />
        </Modal>
        <Modal show={showDeleteEvent}>
          <Modal.Header>
            <Modal.Title>Eliminar evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                {`¿Está seguro que desea eliminar el evento ${selectedEvent.descripcion}?`}
              </Row>
              <Row className="modal-actions">
                <Button
                  variant="light"
                  onClick={() => {
                    setShowDeleteEvent(false);
                    setSelectedEvent({});
                  }}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteEvent}>
                  Eliminar
                </Button>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
        <Toast
          onClose={() => setAddStatus(false)}
          show={status}
          delay={3000}
          autohide
        >
          <Toast.Body>Evento creado correctamente</Toast.Body>
        </Toast>
        <Toast
          onClose={() => setDeleteStatus(false)}
          show={deleteStatus}
          delay={3000}
          autohide
        >
          <Toast.Body>Evento eliminado correctamente</Toast.Body>
        </Toast>
      </Container>
    </Col>
  );
}

export default Events;
