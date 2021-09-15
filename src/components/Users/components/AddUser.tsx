import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { uri } from '../../constants';
import { validateNoAlphaNumeric, validateEmail } from '../../validations';

const AddUser = ({handleClose, status, newUser}) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [rol, setRol] = useState('');
  const [rolInfo, setRolInfo] = useState([]);
  const [errorState, setErrorState] = useState({
    nombre: false,
    apellido: false,
    email: false,
  });
  const [requestState, setRequestState] = useState('');

  useEffect(() => {
    axios
      .get(`${uri}/roles`)
      .then((res) => {
        console.log(res);
        return setRolInfo(res.data);
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
      });
  }, []);

  const postUser = () => {
    axios
      .post(`${uri}/users`, { nombre, apellido, email, rol, pwd })
      .then((res) => {
        if (res.status === 200) {
          status();
          newUser();
          handleClose();
        }
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
      });
  };

  const buttonDisabled = () => {
    const {nombre, apellido, email} = errorState;
    console.log(!nombre && !apellido && !email);
    return !nombre && !apellido && !email;
  };

  return (
    <div className="add-user">
      <Modal.Header>
        <Modal.Title>Nuevo usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form className="user-form">
            <Row>
              <Col>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  onChange={(e) => setNombre(e.target.value)}
                  onBlur={() => {
                    !validateNoAlphaNumeric(nombre)
                      ? setErrorState({...errorState, nombre: true})
                      : setErrorState({...errorState, nombre: false})
                  }}
                  isInvalid={errorState.nombre}
                />
              </Col>
              <Col>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Apellido"
                  onChange={(e) => setApellido(e.target.value)}
                  onBlur={() => {
                    !validateNoAlphaNumeric(apellido)
                      ? setErrorState({...errorState, apellido: true})
                      : setErrorState({...errorState, apellido: false})
                  }}
                  isInvalid={errorState.apellido}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Correo institucional</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  onBlur={() => {
                    !validateEmail(email)
                      ? setErrorState({...errorState, email: true})
                      : setErrorState({...errorState, email: false})
                  }}
                  isInvalid={errorState.email}
                />
              </Col>
              <Col>
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setRol(e.target.value)}
                >
                  <option value=''></option>
                  {rolInfo.length &&
                    rolInfo.map((e, i) =>
                      <option value={e.id} key={i}>
                        {e.descripcion}
                      </option>)}
                </Form.Control>
              </Col>
              <Col>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPwd(e.target.value)}
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
          disabled={!buttonDisabled()}
          type="submit"
        >
          Enviar
        </Button>
      </Modal.Footer>
    </div>
  );
};

AddUser.propTypes = {
  handleClose: PropTypes.func.isRequired,
  status: PropTypes.func.isRequired,
  newUser: PropTypes.func.isRequired,
};

export default AddUser;
