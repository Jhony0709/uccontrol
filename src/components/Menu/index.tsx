import React from 'react';
import { Nav, Col } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { AiFillHome, AiTwotoneSetting, AiOutlineUser } from 'react-icons/ai';
import { BiCalendarEvent } from 'react-icons/bi';
import { FiUserCheck } from 'react-icons/fi';
import { GrUserNew } from 'react-icons/gr';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import uccLogo from '../../../assets/ucc-logo.png';

const Menu = () => {
  return useLocation().pathname !== '/' && (
      <Col md={3} style={{ background: "white", minHeight: '100vh', maxWidth: '250px' }}>
        <Col className="side-menu">
          <Nav defaultActiveKey="/home" className="flex-column">
            <div>
              <img src={uccLogo} alt="main logo" />
              <Col>
                <Link to="/home">
                  <Nav.Item>
                    <AiFillHome />
                    Inicio
                  </Nav.Item>
                </Link>
                <Link to="/register">
                  <Nav.Item>
                    <FiUserCheck />
                    Registro
                  </Nav.Item>
                </Link>
                <Link to="/events">
                  <Nav.Item>
                    <BiCalendarEvent />
                    Eventos
                  </Nav.Item>
                </Link>
                <Link to="/reports">
                  <Nav.Item>
                    <HiOutlineDocumentReport />
                    Reportes
                  </Nav.Item>
                </Link>
                {localStorage.getItem('rol') === 'admin' && (
                  <>
                    <Link to="/users">
                      <Nav.Item>
                        <AiOutlineUser />
                        Usuarios
                      </Nav.Item>
                    </Link>
                    <Link to="/associate">
                      <Nav.Item>
                        <GrUserNew />
                        Vincular carné
                      </Nav.Item>
                    </Link>
                  </>
                )}
              </Col>
            </div>
          </Nav>
        </Col>
      </Col>
  );
};

export default Menu;
