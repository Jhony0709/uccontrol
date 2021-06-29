import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Login from './Login';
import Home from './Home';
import Reports from './Reports';
import Menu from './Menu';
import SessionUser from './Login/SessionUser';
import Users from './Users';
import Events from './Events';
import Register from './Register';
import Associate from './Associate';

export default function App() {
  return (
    <Router>
      <Container fluid>
        <Row>
          <Menu />
          <SessionUser />
          <Switch>
            <Route exact path="/associate" component={Associate} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/events" component={Events} />
            <Route exact path="/reports" component={Reports} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/" component={Login} />
          </Switch>
        </Row>
      </Container>
    </Router>
  );
}
