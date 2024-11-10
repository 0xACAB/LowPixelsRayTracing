'use client';
import React, { useState } from 'react';

const SpoilerForSolution = ({ children }: { children: React.ReactNode }) => {
	const [hidden, setHidden] = useState(true);
	return (<>
		<div className="m-1">
			<button onClick={() => {
				setHidden(!hidden);
			}}>
				{hidden ? 'Показать решение' : 'Скрыть решение'}
			</button>
			<div className={hidden ? 'hidden' : 'block'}>{children}</div>
		</div>
	</>);
};

export default SpoilerForSolution;