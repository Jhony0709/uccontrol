import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime-picker';
import { uri } from '../../constants';

const AddEvent = ({ handleClose, status, newEvent }) => {
  const [nombre, setNombre] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [type, setType] = useState('');
  const [horas, setHoras] = useState(0);
  const [typeInfo, setTypeInfo] = useState([]);
  const [dimension, setDimension] = useState(0);
  const [requestState, setRequestState] = useState('');

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

  const postUser = () => {
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
  };

  const buttonDisabled = () => {
    return !(nombre && type !== '');
  };

  return (
    <div className="add-event">
      <Modal.Header>
        <Modal.Title>Nuevo evento</Modal.Title>
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
                />
              </Col>
              <Col>
                <Form.Label>Tipo</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value=''></option>
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
                  amPmAriaLabel
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
          onClick={postUser}
          disabled={buttonDisabled()}
          type="submit"
        >
          Enviar
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
