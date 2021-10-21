import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount, configure } from 'enzyme';
import { act } from '@testing-library/react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Login from './index';

jest.mock('axios');
Enzyme.configure({ adapter: new Adapter() });

describe('Login Component', () => {
  test('should make a post call when user sends correct info', () => {
    // Arrange
    axios.post.mockReset();
    axios.post.mockResolvedValue({
      status: 200,
    });

    // Act
    const component = mount(<Login />,);
    component.find('input').first().props().onChange({ target: { value: 'usuario@gmail.com' } });
    component.find('input').at(0).props().onChange({ target: { value: '1234' } });
    component.find(Button).first().simulate('click');

    // Assert
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
