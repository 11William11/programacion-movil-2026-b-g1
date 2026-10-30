import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Home from './Home';
import { searchMovies } from '../services/tmdb';

vi.mock('../services/tmdb', () => ({ searchMovies: vi.fn() }));

// En jsdom el ion-searchbar no emite ionInput; se reemplaza por un input simple
vi.mock('@ionic/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ionic/react')>();

  return {
    ...actual,
    IonSearchbar: ({ placeholder, onIonInput }: {
      placeholder?: string;
      onIonInput: (event: { detail: { value: string } }) => void;
    }) => (
      <input
        placeholder={placeholder}
        onChange={(event) => onIonInput({ detail: { value: event.target.value } })}
      />
    ),
  };
});

test('muestra el error y Reintentar vuelve a pedir las películas', async () => {
  const mockedSearch = vi.mocked(searchMovies);
  mockedSearch
    .mockRejectedValueOnce(new Error('Sin conexión'))
    .mockResolvedValueOnce([]);

  render(<Home />);
  fireEvent.change(screen.getByPlaceholderText('Buscar película...'), {
    target: { value: 'dune' },
  });

  expect(await screen.findByText(/No se pudieron cargar las películas/)).toBeInTheDocument();

  fireEvent.click(screen.getByText('Reintentar'));

  expect(await screen.findByText(/No encontramos películas para/)).toBeInTheDocument();
  expect(mockedSearch).toHaveBeenCalledTimes(2);
  expect(mockedSearch).toHaveBeenLastCalledWith('dune');
});
