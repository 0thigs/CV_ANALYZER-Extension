import { createRoot } from "react-dom/client";
import "./style.css";
import { useEffect, useState } from "react";
const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);
import browser from "webextension-polyfill";
import Draggable from "@src/components/draggable";

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Options root element");
const root = createRoot(rootContainer);
function getTextFromPage() {
	// Create a new document fragment
	const fragment = document.createDocumentFragment();

	// Create a new div element
	const div = document.createElement("div");

	// Clone the entire document body into the div
	div.appendChild(document.body.cloneNode(true));

	// Remove all script elements
	div.querySelectorAll("script").forEach((script) => script.remove());

	// Remove all style elements
	div.querySelectorAll("style").forEach((style) => style.remove());

	// Remove all image elements
	div.querySelectorAll("img").forEach((img) => img.remove());

	// Remove all link elements
	div.querySelectorAll("link").forEach((link) => link.remove());

	// Append the cleaned div to the document fragment
	fragment.appendChild(div);

	// Extract and return the text content
	return fragment.textContent;
}

// Add a listener to get the text when a message is received from the popup
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "getPageText") {
		const pageText = getTextFromPage();
		sendResponse({ pageText });
	}
});

// const DraggableScorePopup = () => {
// 	const [matchResult, setMatchResult] = useState<string>("");
// 	useEffect(() => {
// 	 browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log("mensagem calaio", message)
// 			if (message.type === "FROM_POPUP") {

//         setMatchResult(message.matchResult);
// 			}
// 		});
// 	}, []);
// 	return matchResult ? (
// 		<Draggable>
// 			<div></div>
// 			{matchResult}
// 		</Draggable>
// 	) : null;
// };
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("mensagem calaio", message);
	if (message.type === "FROM_POPUP") {
		root.render(
			<Draggable>
				<div></div>
				{message.matchResult}
			</Draggable>,
		);
	}
});

try {
	const doc = document.querySelector("body");
	console.log("user doc", doc);
	console.log("content script loaded");
} catch (e) {
	console.error(e);
}
