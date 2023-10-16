const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
  const invalidPuzzle = '..9..5.1.85.4....2432......A.c.69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidLength = '..9..5.1.85....2432......1...69.83.9.71...9......1945....4.37.4.3..6..';

  
  test('Logic handles a valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.solve(puzzle), solution);
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    assert.equal(solver.solve(invalidPuzzle), false);
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', (done) => {
    assert.equal(solver.solve(invalidLength), false);
    done();
  });
  test('Logic handles a valid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(puzzle, 'A', 2, 3), true);
    done();
  });
  test('Logic handles an invalid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(puzzle, 'A', 2, 1), false);
    done();
  });
  test('Logic handles a valid column placement', (done) => {
    assert.equal(solver.checkColPlacement(puzzle, 'A', 2, 8), true);
    done();
  });
  test('Logic handles an invalid column placement', (done) => {
    assert.equal(solver.checkColPlacement(puzzle, 'A', 2, 5), false);
    done();
  });
  test('Logic handles a valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzle, 'A', 1, 7), true);
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(puzzle, 'A', 1, 2), false);
    done();
  });
  test('Valid puzzle strings pass the solver', (done) => {
    assert.equal(solver.solve(puzzle), solution);
    done();
  });
  test('Invalid puzzle strings fail the solver', (done) => {
    assert.equal(solver.solve(invalidPuzzle), false);
    done();
  });
  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    assert.equal(solver.solve(puzzle), solution);
    done();
  })

});
