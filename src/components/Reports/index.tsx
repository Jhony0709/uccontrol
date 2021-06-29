import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, InputGroup, Modal, Toast, Table, Badge } from 'react-bootstrap';
import { CSVLink, CSVDownload } from "react-csv";
import { BsSearch } from 'react-icons/bs';
import { FaFileExcel } from 'react-icons/fa';
import axios from 'axios';
import { uri, tableReportFormat, genre } from '../constants';

const Reports = () => {
  const [idStudent, setIdStudent] = useState('');
  const [idEvent, setIdEvent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [stHours, setStHours] = useState(0);
  const [events, setEvents] = useState([]);
  const [requestState, setRequestState] = useState('');
  const [reportResults, setReportResults] = useState([]);

  const searchByStudent = () => {
    axios
      .get(`${uri}/reports/student?id=${idStudent}`)
      .then((res) => {
        res.data.report.map((e) => (e.tipo_beneficiario = 'Estudiante'));
        setReportResults(res.data.report);
        setStHours(res.data.hours);
        return setRequestState('success');
      })
      .catch((err) => {
        setRequestState('error');
        setShowToast(true);
      });
  };

  const searchByEvent = () => {
    axios
      .get(`${uri}/reports/event?id=${idEvent}`)
      .then((res) => {
        res.data.map((e) => (e.tipo_beneficiario = 'Estudiante'));
        setStHours(0);
        setReportResults(res.data);
        return setRequestState('success');
      })
      .catch((err) => {
        setRequestState('error');
        setShowToast(true);
      });
  };

  useEffect(() => {
    axios
      .get(`${uri}/events?`)
      .then((res) => {
        console.log(res.data);
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
        setRequestState('error');
        setShowToast(true);
      });
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  };

  return (
    <>
      <Col md={9}>
        <Row>
          <Col md={5}>
            <Form className="form-report">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Reporte por estudiante</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Id estudiante"
                    onChange={(e) => setIdStudent(e.target.value)}
                    disabled={requestState === 'loading'}
                  />
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsSearch onClick={searchByStudent} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
          <Col md={5}>
            <Form className="form-report">
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Reporte por evento</Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      setIdEvent(e.target.value);
                    }}
                  >
                    <option value=""></option>
                    {events.length &&
                      events.map((event, i) => (
                        <option key={i} value={event.id}>
                          {event.descripcion}
                        </option>
                      ))}
                  </Form.Control>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <BsSearch onClick={searchByEvent} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                </InputGroup>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col className="table-container">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  {tableReportFormat.map((title, i) => (
                    <th key={i}>{title.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reportResults.length > 0 &&
                  reportResults.map((e, i) => (
                    <tr key={i}>
                      <td>{formatDate(e.date)}</td>
                      <td>{e.dimension === null ? '-' : e.dimension}</td>
                      <td>{e.event_desc}</td>
                      <td>{e.nombre}</td>
                      <td>{e.apellido}</td>
                      <td>{e.tipo_doc}</td>
                      <td>{e.num_identificacion}</td>
                      <td>{genre[e.sexo]}</td>
                      <td>{e.tipo_beneficiario}</td>
                      <td>{e.programa}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {reportResults.length > 0 && (
              <div className="details-container">
                <div>
                  {stHours !== 0 && (
                    <p>
                      El estudiante tiene{' '}
                      <Badge pill variant="success">
                        {stHours}
                      </Badge>{' '}
                      horas de bienestar registradas
                    </p>
                  )}
                </div>
                <div>
                  <Button>
                    <CSVLink
                      data={reportResults}
                      headers={tableReportFormat}
                      filename={'control-ucc-report.csv'}>
                      Exportar <FaFileExcel />
                    </CSVLink>
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Col>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Body>
          {requestState === 'error' && `Ups, ocurrió un error`}
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Reports;
