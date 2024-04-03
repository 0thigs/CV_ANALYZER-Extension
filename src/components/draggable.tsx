import React, { useState } from "react";

const Draggable = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	const startDrag = (e: React.MouseEvent<HTMLDivElement>) => {
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		});
		setIsDragging(true);
	};

	const onDrag = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isDragging) {
			setPosition({
				x: e.clientX - dragStart.x,
				y: e.clientY - dragStart.y,
			});
		}
	};

	const stopDrag = () => {
		setIsDragging(false);
	};

	return (
		<div
			style={{
				position: "fixed",
				top: position.y,
				left: position.x,
				width: "200px",
				height: "100px",
				backgroundColor: "lightgrey",
				padding: "10px",
				cursor: isDragging ? "grabbing" : "grab",
				zIndex: 1000,
			}}
			onMouseDown={startDrag}
			onMouseMove={onDrag}
			onMouseUp={stopDrag}
			onMouseLeave={stopDrag}
		>
			{children}
		</div>
	);
};

export default Draggable;
