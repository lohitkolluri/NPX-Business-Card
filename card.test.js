import { jest } from '@jest/globals';

// Basic smoke test to ensure the CLI entry point can be imported without throwing.
describe('NPX Business Card', () => {
  it('loads card.js without crashing', async () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

    // Dynamic import to respect ESM
    await import('./card.js');

    expect(mockExit).not.toHaveBeenCalledWith(1);
    mockExit.mockRestore();
  });
});

