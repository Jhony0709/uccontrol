import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Container, Jumbotron, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import { uri } from '../../constants';
import nfcLogo from '../../../../assets/NFC.gif';
import { useLocation } from 'react-router-dom';

const RegEst = ({ handleClose, status, event }) => {
  const [estudiante, setEstudiante] = useState({});
  const [requestState, setRequestState] = useState('');
  const location = useLocation();

  ipcRenderer.on('card-inserted', (event, arg) => {
    const cardKey = arg.atr.toString();

    console.log(cardKey);
    if (location.pathname === '/register') {
      axios
        .get(`${uri}/users/card?card=${cardKey}`)
        .then((res) => {
          console.log(res);
          if (res.data.length) {
            const estudiante = res.data[0];
            setEstudiante(estudiante);
            setRequestState('success');
          } else {
            setRequestState('error');
          }
        })
        .catch(err => {
          console.log(err)
          setRequestState('error');
        });
    }
  });

  const postReg = () => {
    axios
      .post(`${uri}/events/register`, { id_estudiante: estudiante.id, id_evento: event.id })
      .then((res) => {
        if (res.status === 200) {
          status();
          handleClose();
        }
      })
      .catch(err => {
        console.log(err)
        setRequestState('error');
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
