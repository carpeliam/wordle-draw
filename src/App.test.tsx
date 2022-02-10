import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(navigator.clipboard, 'writeText');
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

    const cells = screen.getAllByRole('cell');
    const yellowCellIndexes = [5, 7, 9, 10, 11, 12, 15, 17, 19, 20, 22, 24];
    const greenCellIndexes = [25, 26, 27, 28, 29];
    yellowCellIndexes.forEach(index => userEvent.click(buttonInCell(cells[index])));
    greenCellIndexes.forEach(index => {
      userEvent.click(buttonInCell(cells[index]));
      userEvent.click(buttonInCell(cells[index]));
    });

    userEvent.click(screen.getByRole('button', { name: 'Copy!' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(`⬛️⬛️⬛️⬛️⬛️
🟨⬛️🟨⬛️🟨
🟨🟨🟨⬛️⬛️
🟨⬛️🟨⬛️🟨
🟨⬛️🟨⬛️🟨
🟩🟩🟩🟩🟩`);
  });
});

function buttonInCell(cell: HTMLElement) {
  const { getByRole } = within(cell);
  return getByRole('button');
}
