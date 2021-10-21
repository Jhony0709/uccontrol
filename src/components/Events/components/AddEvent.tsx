import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import { uri } from '../../constants';

const AddEvent = ({ handleClose, status, newEvent, selectedEvent }) => {
  const getParsedDate = (dat) => {
    const date = new Date(dat);
    date.setHours(date.getHours() - 5);
    return date;
  };

  const [nombre, setNombre] = useState(
    selectedEvent.descripcion ? selectedEvent.descripcion : ''
  );
  const [dateFrom, setDateFrom] = useState(
    selectedEvent.hora_inicio ? getParsedDate(selectedEvent.hora_inicio) : ''
  );
  const [dateTo, setDateTo] = useState(
    selectedEvent.hora_fin ? getParsedDate(selectedEvent.hora_fin) : ''
  );
  const [type, setType] = useState(
    selectedEvent.tipo_evento
    ? parseInt(selectedEvent.tipo_evento)
    : ''
  );
  const [horas, setHoras] = useState(
    selectedEvent.horas_otorgadas
    ? parseInt(selectedEvent.horas_otorgadas)
    : 0
  );
  const [typeInfo, setTypeInfo] = useState([]);
  const [dimension, setDimension] = useState(
    selectedEvent.dimension
    ? parseInt(selectedEvent.dimension)
    : 0
  );
  const [requestState, setRequestState] = useState('');

  const isValidRange = () => {
    if (dateFrom && dateTo) {
      const diff = moment(dateFrom).diff(moment(dateTo));
      return diff > 0;
    }
    return false;
  };

  useEffect(() => {
    axios
      .get(`${uri}/events/types`)
      .then((res) => {
        console.log(res);
        return setTypeInfo(res.data);
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
      });
  }, []);

  const postEvent = () => {
    if(selectedEvent.descripcion) {
      axios
        .put(`${uri}/events`, {
          id: selectedEvent.id,
          nombre,
          type,
          dateFrom,
          dateTo,
          dimension,
          horas,
        })
        .then((res) => {
          if (res.status === 200) {
            status();
            newEvent();
            handleClose();
          }
        })
        .catch(err => {
          console.log(err)
          setRequestState('error');
        });
    } else {
      axios
        .post(`${uri}/events`, {
          nombre,
          type,
          dateFrom,
          dateTo,
          dimension,
          horas,
        })
        .then((res) => {
          if (res.status === 200) {
            status();
            newEvent();
            handleClose();
          }
        })
        .catch(err => {
          console.log(err)
          setRequestState('error');
        });
    }
  };

  const buttonDisabled = () => {
    return !(nombre && type !== '' && dateFrom && dateTo && !isValidRange());
  };

  return (
    <div className="add-event">
      <Modal.Header>
        <Modal.Title>
          {selectedEvent.descripcion ? "Modificar evento" : "Nuevo evento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form className="event-form">
            <Row>
              <Col>
                <Form.Label>Nombre evento</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  onChange={(e) => setNombre(e.target.value)}
                  value={nombre}
                />
              </Col>
              <Col>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option
                    value={selectedEvent.tipo_evento ? selectedEvent.tipo_evento : ''}>
                    {selectedEvent.tipo_evento ? (typeInfo.length && typeInfo.find( tipo => tipo.id === selectedEvent.tipo_evento).descripcion) : ''}
                  </option>
                  {typeInfo.length &&
                    typeInfo.map((e, i) =>
                      <option value={e.id} key={i}>
                        {e.descripcion}
                      </option>)}
                </Form.Control>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col style={{ textAlign: 'center' }}>
                <label>Desde</label><br />
                <DateTimePicker
                  onChange={(e) => setDateFrom(e)}
                  value={dateFrom}
                />
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <label>Hasta</label><br />
                <DateTimePicker
                  onChange={(e) => setDateTo(e)}
                  value={dateTo}
                />
              </Col>
            </Row>
            {isValidRange() && (
              <Row
                style={{
                  textAlign: 'center',
                  flexDirection: 'column',
                  color: 'red',
                  fontWeight: 'bold',
                }}
              >
                <p>Fechas inválidas</p>
              </Row>
            )}
            <hr />
            <Row>
              <Col>
                <Form.Label>Dimensión</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Dimensión"
                  value={dimension}
                  onChange={(e) => setDimension(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Label>Horas otorgadas</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Horas"
                  value={horas}
                  onChange={(e) => setHoras(e.target.value)}
                />
              </Col>
            </Row>
            <Alert variant={'danger'} show={requestState === 'error'} onClose={() => setRequestState('')} dismissible>
              Credenciales inválidas, intente nuevamente
            </Alert>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-dismiss" onClick={handleClose}>
          Cancelar
        </Button>
        <Button
          className="btn-send"
          onClick={postEvent}
          disabled={buttonDisabled()}
          type="submit"
        >
          {selectedEvent.descripcion ? "Modificar" : "Enviar"}
        </Button>
      </Modal.Footer>
    </div>
  );
};

AddEvent.propTypes = {
  handleClose: PropTypes.func.isRequired,
  status: PropTypes.func.isRequired,
  newEvent: PropTypes.func.isRequired,
};

export default AddEvent;
