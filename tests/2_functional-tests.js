const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const solution = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
  const invalidPuzzle = '..9..5.1.85.4....2432......A.c.69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  const invalidLength = '..9..5.1.85....2432......1...69.83.9.71...9......1945....4.37.4.3..6..';
  const unsolve = '..911511.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, solution);
        done();
      });
  });
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });
  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({puzzle: invalidPuzzle})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({puzzle: invalidLength})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/solve')
      .send({puzzle: unsolve})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle, coordinate: 'A1', value: '7'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle, coordinate: 'A2', value: '8'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    const puzzle = '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....7..13';

    chai.request(server)
      .post('/api/check')
      .send({ puzzle, coordinate: 'A2', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });
  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "2" })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle, value: '2'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });
  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle: invalidPuzzle, coordinate: 'A2', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle: invalidLength, coordinate: 'A1', value: '7'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle, coordinate: 'L2', value: '3'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
      .keepOpen()
      .post('/api/check')
      .send({puzzle, coordinate: 'A2', value: 'l'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });
  




  
});

