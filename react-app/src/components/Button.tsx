import React from 'react'


interface Props {
	children: string
}

function Button( {children} : Props) {
	return <h1>{children}</h1>
}


export default Button