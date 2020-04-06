import React from 'react'

const Square = ({ value, winSquare, onClick }) => {
	const classes = ['square']
	if (winSquare) {
		classes.push('winSquare')
	}

	return (
		<button className={classes.join(' ')} onClick={onClick}>
			{value}
		</button>
	)
}

export default Square
