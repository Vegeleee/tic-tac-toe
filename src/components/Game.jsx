import React, { useState } from 'react'
import Board from './Board'

const Game = () => {
	const [history, setHistory] = useState([
		{
			squares: Array(9).fill(null),
		},
	])
	const [stepNumber, setStepNumber] = useState(0)
	const [xIsNext, setXIsNext] = useState(true)
	const [reverseList, setReverseList] = useState(false)

	/*
		Обрабатывает клики по клеткам
		Принимает номер клетки, по которой произошел клик, присваивает клетке значение,
		обновляет состояние
	*/
	const handleClick = (i) => {
		const historyToStep = history.slice(0, stepNumber + 1) // История ходов до текущего номера хода включительно
		const current = historyToStep[historyToStep.length - 1]
		const squares = current.squares.slice()

		// Не обрабатывать клики, если побелитель определен (игра окончена) или клекте уже присвоено значение
		if (calculationWinner(squares).winner || squares[i]) {
			return
		}

		squares[i] = xIsNext ? 'X' : 'O'

		setHistory([...historyToStep, { squares, i }])
		setStepNumber(historyToStep.length)
		setXIsNext(!xIsNext)
	}

	/*
		Обновляет состояние
		Меняет номер хода и текущего игрока
	*/
	const jumpTo = (step) => {
		setStepNumber(step)
		setXIsNext(step % 2 === 0)
	}

	const current = history[stepNumber]
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
		if (move === stepNumber) {
			classes.push('currentMove')
		}

		return (
			<li key={move}>
				<button onClick={() => jumpTo(move)} className={classes.join(' ')}>
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
		status = 'Следующий ход: ' + (xIsNext ? 'X' : 'O')
	}

	return (
		<div className="game">
			<div className="game-board">
				<Board
					squares={current.squares}
					winSquares={winSquares}
					onClick={handleClick}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{reverseList ? moves.reverse() : moves}</ol>
				{moves.length > 1 && (
					<button
						onClick={
							() => setReverseList(!reverseList)
							// this.setState({ reverseList: !this.state.reverseList })
						}
					>
						Сортировать по
						{reverseList ? ' возрастанию' : ' убыванию'}
					</button>
				)}
			</div>
		</div>
	)
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
