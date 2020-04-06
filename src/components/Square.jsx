import React from 'react'

const Square = ({ value, winSquare, onClick }) => {
	let winStyle = {}
	if (winSquare) {
		winStyle = {
			backgroundColor: '#ededed',
		}
	}

	return (
		<button className="square" onClick={onClick} style={winStyle}>
			{value}
		</button>
	)
}

export default Square
