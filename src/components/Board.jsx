import React from 'react'
import Square from './Square'

const Board = ({ squares, onClick }) => {
	/*
		Рендерит клетку
		Принимает порядковый номер клетки
		Возвращает компонент Square
	*/
	const renderSquare = (i) => {
		return <Square value={squares[i]} onClick={() => onClick(i)} />
	}

	/*
		Рендерит строку клеток на игровом поле
		Принимает номер строки и количество колонок
		Возвращает массив клеток, длиной colsCount
	*/
	const renderRow = (rowNumber, colsCount) => {
		const row = []

		for (
			let i = rowNumber * colsCount;
			i < rowNumber * colsCount + colsCount;
			i++
		) {
			row.push(renderSquare(i))
		}
		return row
	}

	/*
		Рендерит игровое поле
		Принимает количество строк и количество колонок
		Возвращает массив эл-ов div, длиной rowsCount
	*/
	const renderBoard = (rowsCount, colsCount) => {
		const board = []

		for (let i = 0; i < rowsCount; i++) {
			const row = <div className="board-row">{renderRow(i, colsCount)}</div>
			board.push(row)
		}

		return board
	}

	return <React.Fragment>{renderBoard(3, 3)}</React.Fragment>
}

export default Board
