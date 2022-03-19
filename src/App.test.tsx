import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as guesser from './guesser';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('App', () => {
  let mockGuesser: jest.SpyInstance<string[], [guesser.Guesses, string]>;
  beforeEach(() => {
    jest.spyOn(navigator.clipboard, 'writeText');
    mockGuesser = jest.spyOn(guesser, 'default');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should initially show a 5x6 grid of black squares', () => {
    render(<App />);

    expect(screen.getAllByRole('row')).toHaveLength(6);

    const squares = screen.getAllByRole('cell');
    expect(squares).toHaveLength(5 * 6);
    squares.forEach((square: HTMLElement) => {
      expect(square.textContent).toEqual('⬛️');
    });
  });

  it('should turn a square from black to yellow to green to black on click', () => {
    render(<App />);

    const firstCell = screen.getAllByRole('cell')[0];
    const button = buttonInCell(firstCell);
    
    userEvent.click(button);
    expect(firstCell.textContent).toEqual('🟨');
    userEvent.click(button);
    expect(firstCell.textContent).toEqual('🟩');
    userEvent.click(button);
    expect(firstCell.textContent).toEqual('⬛️');
  });

  it('should copy the grid state to the clipboard', () => {
    render(<App />);

    spellHi();

    userEvent.click(screen.getByRole('button', { name: 'Copy!' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`⬛️⬛️⬛️⬛️⬛️
🟨⬛️🟨⬛️🟨
🟨🟨🟨⬛️⬛️
🟨⬛️🟨⬛️🟨
🟨⬛️🟨⬛️🟨
🟩🟩🟩🟩🟩`);
  });

  it('should generate a series of guesses based on the answer', () => {
    const guesses = [ 'WRONG', 'MAYBE', 'CLOSE', 'ALMOST', 'JELLO', 'HELLO' ];
    mockGuesser.mockReturnValue(guesses);

    render(<App />);

    spellHi();

    userEvent.type(screen.getByLabelText('Answer'), 'hello');
    userEvent.click(screen.getByRole('button', { name: 'Generate Guesses' }));

    expect(mockGuesser).toHaveBeenCalledWith([
      ['⬛️', '⬛️', '⬛️', '⬛️', '⬛️'],
      ['🟨', '⬛️', '🟨', '⬛️', '🟨'],
      ['🟨', '🟨', '🟨', '⬛️', '⬛️'],
      ['🟨', '⬛️', '🟨', '⬛️', '🟨'],
      ['🟨', '⬛️', '🟨', '⬛️', '🟨'],
      ['🟩', '🟩', '🟩', '🟩', '🟩'],
    ], 'HELLO');

    guesses.forEach((guess) => {
      expect(screen.getByText(guess, { exact: false })).toBeInTheDocument();
    });
  });
});

function buttonInCell(cell: HTMLElement) {
  const { getByRole } = within(cell);
  return getByRole('button');
}

function spellHi() {
  const cells = screen.getAllByRole('cell');
  const yellowCellIndexes = [5, 7, 9, 10, 11, 12, 15, 17, 19, 20, 22, 24];
  const greenCellIndexes = [25, 26, 27, 28, 29];
  yellowCellIndexes.forEach(index => userEvent.click(buttonInCell(cells[index])));
  greenCellIndexes.forEach(index => {
    userEvent.click(buttonInCell(cells[index]));
    userEvent.click(buttonInCell(cells[index]));
  });
}
