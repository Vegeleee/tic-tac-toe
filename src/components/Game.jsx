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

	/*
		Обрабатывает клики по клеткам
		Принимает номер клетки, по которой произошел клик, присваивает клетке значение,
		обновляет состояние
	*/
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1) // История ходов до текущего номера хода включительно
		const current = history[history.length - 1]
		const squares = current.squares.slice()

		// Не обрабатывать клики, если побелитель определен (игра окончена) или клекте уже присвоено значение
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

	/*
		Обновляет состояние
		Меняет номер хода и текущего игрока
	*/
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

		// Формирование списка ходов
		let moves = history.map((step, move) => {
			const rowNumber = Math.floor(step.i / 3) + 1 // Номер строки в которой находится клетка i
			const colNumber = step.i - (rowNumber - 1) * 3 + 1 // Номер колонки в которой находится клетка i
			const desc = move
				? `Перейти к ходу #${move} (${colNumber}, ${rowNumber})`
				: 'К началу игры'

			// Выделение выбранного эдемента в списке ходов
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

		// Определение статуса
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
					<ol>{this.state.reverseList ? moves.reverse() : moves}</ol>
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

/*
	Определяет победителя
	Принимает массив клеток
	Обходит массив выигрышных комбинаций и проверяет равны ли значения ячеек в рамках одной комбинации
	Если равны, возырвщает объект содержащий победителя (Х или О) и выигрышную комбинацию
	Еслине равны, возвращает объект, у которого поля победителя и комбинации равны null
*/
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
