import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Container, Card, Row, ListGroup, Modal, Toast, Button } from 'react-bootstrap';
import { FaUserAlt, FaUserPlus, FaUserTimes, FaUserCog } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { uri } from '../constants';
import AddUser from './components/AddUser';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showRemoveUser, setShowRemoveUser] = useState(false);
  const [userToRemove, setUserToRemove] = useState({});
  const [addStatus, setAddStatus] = useState(false);
  const [showStatusToggle, setShowStatusToggle] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [requestState, setRequestState] = useState('');

  useEffect(() => {
    axios
      .get(`${uri}/users`)
      .then((res) => {
        console.log(res.data);
        return setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  }, [newUser]);

  const handleUserStatusChange = (user) => {
    axios
      .put(`${uri}/users/status`, { email: user.email, estado: !user.estado})
      .then((res) => {
        if (res.status === 200) {
          const usersCopy = [...users];
          const userCopy = user;
          userCopy.estado = !user.estado;
          return setUsers(usersCopy);
        }
        return setRequestState('error');
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  };

  const handleRemoveUser = () => {
    axios
      .delete(`${uri}/users`, { data: { email: userToRemove.email } })
      .then((res) => {
        if (res.status === 200) {
          const usersCopy = [...users];
          const userCopy = userToRemove;

          usersCopy.map((e, i) => {
            if (e.email === userCopy.email) {
              usersCopy.splice(i, 1);
              return setUsers(usersCopy);
            }
          });

          setShowRemoveUser(false);
        }
        return setRequestState('error');
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
      });
  };

  return (
    <Col md={9}>
      <Container className="main-wrapper" fluid>
        <Row>
          {users.map((user, i) => (
            <Card key={i}>
              <Card.Body>
                <Row>
                  <Col md={2} className="side-pic">
                    <FaUserAlt className="user-pic" />
                  </Col>
                  <Col md={10}>
                    <Card.Title>{`${user.nombre} ${user.apellido}`}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {user.email}
                    </Card.Subtitle>
                    <hr />
                    <Card.Subtitle className="mb-2 text-muted">
                      {user.rol.toUpperCase()}
                    </Card.Subtitle>
                  </Col>
                  {showStatusToggle ?
                    <div className="form-check">
                      <label className="form-check-label form-check-toggle">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={user.estado}
                          onClick={() => handleUserStatusChange(user)}
                        />
                        <span />
                      </label>
                    </div> :
                    <GoPrimitiveDot
                      className={`card-status card-item-${
                        user.estado ? 'active' : 'inactive'
                      }`}
                    />
                  }
                  {!showStatusToggle && (
                    <RiDeleteBin6Line
                      className="card-remove"
                      onClick={() => {
                        setUserToRemove(user);
                        setShowRemoveUser(true);
                      }}
                    />
                  )}
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Row>
        <ListGroup className="header-actions" horizontal>
          {!showStatusToggle && (
            <ListGroup.Item onClick={() => setShowAddUser(true)}>
              <FaUserPlus /> Agregar usuario
            </ListGroup.Item>
          )}
          {!showStatusToggle && (
            <ListGroup.Item onClick={() => setShowStatusToggle(true)}>
              <FaUserCog /> Cambiar estado
            </ListGroup.Item>
          )}
          {showStatusToggle && (
            <ListGroup.Item onClick={() => setShowStatusToggle(false)}>
              <FaUserCog /> Finalizar cambio de estado
            </ListGroup.Item>
          )}
        </ListGroup>
        <Modal show={showAddUser} size="lg">
          <AddUser
            status={() => setAddStatus(true)}
            handleClose={() => setShowAddUser(false)}
            newUser={() => setNewUser(true)}
          />
        </Modal>
        <Modal show={showRemoveUser}>
          <Modal.Header>
            <Modal.Title>Eliminar usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {`¿Seguro que deseas eliminar a ${userToRemove.nombre} ${userToRemove.apellido}?`}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowRemoveUser(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleRemoveUser}>
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal>
        <Toast
          onClose={() => setAddStatus(false)}
          show={addStatus}
          delay={3000}
          autohide
        >
          <Toast.Body>Usuario creado correctamente</Toast.Body>
        </Toast>
      </Container>
    </Col>
  );
};

export default Users;
