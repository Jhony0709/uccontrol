import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Jumbotron, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { uri } from '../../constants';
import nfcLogo from '../../../../assets/NFC.gif';

const RegEst = ({ handleClose, status, event, estudiante, setEstudiante, requestState, setRequestState }) => {
  const postReg = () => {
    axios
      .post(`${uri}/events/register`, { id_estudiante: estudiante.id, id_evento: event.id })
      .then((res) => {
        if (res.status === 200) {
          status();
          handleClose('');
        }
      })
      .catch(err => {
        console.log(err)
        status();
        handleClose('error')
      });
  };

  return (
    <div className="add-user">
      <Modal.Header>
        <Modal.Title>Registrar horas a estudiante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <h5>Registrando hora para el evento {event.descripcion}</h5>
          <Jumbotron fluid>
            <Container style={{textAlign: 'center'}}>
              {requestState === 'success'
                ?
                  (<>
                    <p>Se registrarán las horas correspondientes al estudiante {estudiante.nombre} {estudiante.apellido}</p>
                    <Button onClick={postReg}>Confirmar</Button>
                    <Button
                      variant="light"
                      onClick={() => {
                        setEstudiante({});
                        setRequestState('');
                      }}>Cancelar</Button>
                  </>)
                :
                  (<>
                    <p>Acerca el carné universitario al dispositivo NFC</p>
                    <img src={nfcLogo} width="200" alt="nfc" />
                  </>
                  )
              }
            </Container>
          </Jumbotron>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btn-dismiss" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </div>
  );
};

RegEst.propTypes = {
  handleClose: PropTypes.func.isRequired,
  status: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

export default RegEst;
