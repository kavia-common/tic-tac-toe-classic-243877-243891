import React, { useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;

function calculateWinner(squares) {
  // All possible winning lines in a 3x3 Tic Tac Toe.
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  for (const [a, b, c] of lines) {
    const v = squares[a];
    if (v && v === squares[b] && v === squares[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
function App() {
  /** Main application entry component for the retro Tic Tac Toe game UI. */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const isBoardFull = useMemo(() => squares.every((s) => s !== null), [squares]);
  const isDraw = !winner && isBoardFull;

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner}`;
    if (isDraw) return "Draw game!";
    return `Turn: ${xIsNext ? "X" : "O"}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    /** Handle user clicking a square: place X/O if allowed. */
    if (winner) return;
    if (squares[index] !== null) return;

    const next = squares.slice();
    next[index] = xIsNext ? "X" : "O";

    setSquares(next);
    setXIsNext((v) => !v);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    /** Reset the board and set X to start. */
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  }

  const currentPlayer = xIsNext ? "X" : "O";

  return (
    <div className="App">
      <main className="retro-shell">
        <div className="scanlines" aria-hidden="true" />

        <header className="retro-header">
          <div className="badge">8-BIT ARCADE</div>
          <h1 className="retro-title">Tic Tac Toe</h1>
          <p className="retro-subtitle">Local 2-player classic • X vs O</p>
        </header>

        <section className="panel" aria-label="Game panel">
          <div className="status-row" role="status" aria-live="polite">
            <div className="status-text">{statusText}</div>

            {!winner && !isDraw ? (
              <div className="pill" aria-label="Current player">
                <span className="pill-label">Now playing</span>
                <span className={`pill-value ${currentPlayer === "X" ? "x" : "o"}`}>
                  {currentPlayer}
                </span>
              </div>
            ) : (
              <div className="pill" aria-label="Game result">
                <span className="pill-label">Result</span>
                <span className={`pill-value ${winner === "X" ? "x" : winner === "O" ? "o" : ""}`}>
                  {winner ? winner : "—"}
                </span>
              </div>
            )}
          </div>

          <div className="board-wrap">
            <div className="board" role="grid" aria-label="Tic Tac Toe board">
              {squares.map((value, idx) => {
                const isWinningSquare = Boolean(line && line.includes(idx));
                const isDisabled = Boolean(winner || value !== null);

                return (
                  <button
                    key={idx}
                    type="button"
                    className={[
                      "square",
                      value ? `square--${value.toLowerCase()}` : "",
                      isWinningSquare ? "square--win" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => handleSquareClick(idx)}
                    disabled={isDisabled}
                    role="gridcell"
                    aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                  >
                    <span className="square-value" aria-hidden="true">
                      {value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="controls">
            <button type="button" className="btn btn-primary" onClick={handleRestart}>
              Restart
            </button>
          </div>

          <div className="hint" aria-label="Hint">
            Tip: First to get three in a row wins.
          </div>
        </section>

        <footer className="retro-footer">
          <span className="footer-dim">Made for the web •</span> <span className="footer-bright">No ads. No tracking.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
