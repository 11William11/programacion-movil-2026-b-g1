import { fireEvent, render, screen } from '@testing-library/react';
import Saludo from './Saludo';

test('muestra el nombre y el botón', () => {
  render(<Saludo nombre="William" />);

  expect(screen.getByText('William')).toBeInTheDocument();
  expect(screen.getByText('Saludar')).toBeInTheDocument();
  expect(screen.getByText('Toca el botón para saludar.')).toBeInTheDocument();
});

test('al tocar el botón muestra el saludo y al tocarlo otra vez lo oculta', () => {
  render(<Saludo nombre="William" />);

  fireEvent.click(screen.getByText('Saludar'));
  expect(screen.getByText('¡Hola, William! Bienvenido a Movie Rater 🎬')).toBeInTheDocument();
  expect(screen.getByText('Ocultar saludo')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Ocultar saludo'));
  expect(screen.getByText('Toca el botón para saludar.')).toBeInTheDocument();
});

test('usa el nombre que recibe por props', () => {
  render(<Saludo nombre="Ana" />);
  fireEvent.click(screen.getByText('Saludar'));

  expect(screen.getByText('¡Hola, Ana! Bienvenido a Movie Rater 🎬')).toBeInTheDocument();
});
