import * as guessFns from './guesser';

describe('guesser', () => {
    beforeEach(() => {
        jest.spyOn(guessFns, 'shuffle').mockImplementation((arr) => arr);
    });
    afterEach(() => { jest.restoreAllMocks(); });
    
    const allGreen = 'right';
    const greenAndBlack = 'sight';
    const blackYellowAndGreen = 'great';
    const blackAndYellow = 'fader';

    const answers = [allGreen, greenAndBlack, blackAndYellow, blackYellowAndGreen];
    const dictionary = ['maybe', 'never', 'hello', 'heleo', ...answers];

    const guesser = guessFns.createGuesser(dictionary, answers);

    it('supplies the answer last', () => {
        expect(guesser([['🟩', '🟩', '🟩', '🟩', '🟩']], 'right')).toEqual(['right']);
        expect(guesser([['🟩', '🟩', '🟩', '🟩', '🟩']], 'great')).toEqual(['great']);
        expect(guesser([['🟩', '🟩', '🟩', '🟩', '🟩']], 'fader')).toEqual(['fader']);
    });

    it('supplies guesses from the dictionary that match', () => {
        const guesses = guesser([
            ['⬛️', '⬛️', '⬛️', '⬛️', '⬛️'],
            ['⬛️', '⬛️', '⬛️', '⬛️', '🟨'],
            ['🟨', '🟨', '⬛️', '⬛️', '🟩'],
            ['⬛️', '🟩', '🟩', '🟩', '🟩'],
            ['🟩', '🟩', '🟩', '🟩', '🟩'],
        ], 'right');
        expect(guesses).toEqual(['maybe', 'fader', 'great', 'sight', 'right']);
    });

    it('should not supply reoccuring letters for a yellow letter guess', () => {
        expect(guesser([['🟩', '🟩', '🟩', '🟨', '🟩']], 'hello')).toEqual(['heleo']);
    });

    it('uses answers from the dictionary when the last guess is not correct', () => {
        const guesses = guesser([
            ['⬛️', '⬛️', '⬛️', '⬛️', '⬛️'],
            ['⬛️', '⬛️', '⬛️', '⬛️', '🟨'],
        ], 'right');
        expect(guesses).toEqual(['maybe', 'fader']);
    });
});
