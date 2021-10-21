import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Col, Form } from 'react-bootstrap';
import mainLogo from '../../../assets/main.png';
import { uri } from '../constants';
import { validateEmail } from '../validations';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [requestState, setRequestState] = useState('');

  const getUser = async () => {
    setRequestState('loading');
    axios
      .post(`${uri}/login`, { email, pwd })
      .then((res) => {
        const { data } = res;
        localStorage.setItem('name', `${data.nombre} ${data.apellido}`);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('user', data.email);
        return setRequestState('success');
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
      });
  };

  return (
    <Col md={12}>
      <div className="login">
        {requestState === 'success' ? (
          <Redirect push to="/home" />
        ) : (
          <>
            <img src={mainLogo} alt="main logo" />
            <Form className="login-form">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Correo institucional</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={requestState === 'loading'}
                  onBlur={() => {
                    !validateEmail(email)
                      ? setRequestState('emailError')
                      : setRequestState('');
                  }}
                  isInvalid={requestState === 'emailError'}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Contraseña"
                  onChange={(e) => setPwd(e.target.value)}
                  disabled={ requestState === 'loading' }
                />
              </Form.Group>
              <Alert
                variant={'danger'}
                show={requestState === 'error'}
                onClose={() => setRequestState('')}
                dismissible
              >
                Credenciales inválidas, intente nuevamente
              </Alert>
              <Button
                variant="primary"
                onClick={getUser}
                disabled={ requestState === 'loading' || requestState === 'emailError' }
              >
                Enviar
              </Button>
            </Form>
          </>
        )}
      </div>
    </Col>
  );
};

export default Login;
