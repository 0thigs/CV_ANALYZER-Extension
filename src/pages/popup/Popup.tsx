import React from "react";
import logo from "@assets/img/logo.svg";
import { PopupBody } from "@src/components/popup";

export default function Popup(): JSX.Element {
	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
			<PopupBody />
		</div>
	);
}
