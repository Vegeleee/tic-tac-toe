import React from 'react'
import Board from './Board'

class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
			reverseList: false,
		}

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1)
		const current = history[history.length - 1]
		const squares = current.squares.slice()

		if (calculationWinner(squares).winner || squares[i]) {
			return
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O'
		this.setState({
			history: [...history, { squares, i }],
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		})
	}

	render() {
		const history = this.state.history
		const current = history[this.state.stepNumber]
		const { winner, winSquares } = calculationWinner(current.squares)

		let moves = history.map((step, move) => {
			const rowNumber = Math.floor(step.i / 3) + 1
			const colNumber = step.i - (rowNumber - 1) * 3 + 1
			const desc = move
				? `Перейти к ходу #${move} (${colNumber}, ${rowNumber})`
				: 'К началу игры'

			let classes = []
			if (move === this.state.stepNumber) {
				classes.push('currentMove')
			}

			return (
				<li key={move}>
					<button
						onClick={() => this.jumpTo(move)}
						className={classes.join(' ')}
					>
						{desc}
					</button>
				</li>
			)
		})

		moves = this.state.reverseList ? [...moves].reverse() : moves

		let status
		if (winner) {
			status = 'Выиграл ' + winner
		} else if (!current.squares.includes(null)) {
			status = 'Ничья'
		} else {
			status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O')
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						winSquares={winSquares}
						onClick={this.handleClick}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
					{moves.length > 1 && (
						<button
							onClick={() =>
								this.setState({ reverseList: !this.state.reverseList })
							}
						>
							Сортировать по
							{this.state.reverseList ? ' возрастанию' : ' убыванию'}
						</button>
					)}
				</div>
			</div>
		)
	}
}

const calculationWinner = (squares) => {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	]

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i]
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], winSquares: [a, b, c] }
		}
	}
	return { winner: null, winSquares: null }
}

export default Game
