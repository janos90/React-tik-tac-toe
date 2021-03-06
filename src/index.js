import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const winningStyle = {
        backgroundColor: '#fcc'
    };
    return (
        <button className="square" onClick={props.onClick} style={props.winningSquare? winningStyle : null}>
            {props.value}
        </button>
    );
}


class Board extends React.Component {

    renderSquare(i) {
        let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winningSquare = {winningSquare}
            />
        );
    }

    renderRow(i) {
        return (
            <div className="board-row">
                {this.renderSquare(i)}
                {this.renderSquare(i + 1)}
                {this.renderSquare(i + 2)}
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.renderRow(0)}
                {this.renderRow(3)}
                {this.renderRow(6)}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{squares: Array(9).fill(null), log: [Array(9).fill(null)]}],
            stepNumber: 0,
            xIsNext: true,
            inverseList: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{squares: squares, log: i + 1}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }
    switchToggle(){
        this.setState({
            inverseList: !this.state.inverseList
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' (' + ((history[move].log - 1) % 3 + 1) + ',' + (Math.floor((history[move].log - 1) / 3) + 1) + ')'
                : 'Go to game start';
            return (
                <li key={move} className={move === this.state.stepNumber ? 'selected' : ''}>
                    <button onClick={() => this.jumpTo(move)}
                            className={move === this.state.stepNumber ? 'selected' : ''}>
                        {desc}
                    </button>
                </li>
            );
        });

        if(this.state.inverseList) {
            moves = moves.reverse()
        }
        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (

            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winner={winner && winner.winningSquares}
                    />
                </div>
                <div className="game-info">
                    <button onClick={() => this.switchToggle()}> inverse list </button>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: lines[i]
            }
        }
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
