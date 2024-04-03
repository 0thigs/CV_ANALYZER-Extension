import testCv from "@src/contants/testCv";
import { matchCv } from "@src/prompts/matchCv";
import { useState } from "react";
import browser from "webextension-polyfill";
import pdfToText from "react-pdftotext";
export const PopupBody = () => {
	const [html, setHtml] = useState<string>("");
	const [apiKey, setApiKey] = useState<string>("");
	const [cv, setCv] = useState<string | undefined>();

	const [matchResult, setMatchResult] = useState<string>("");
	const handleChangeFile: React.ChangeEventHandler<HTMLInputElement> = async (
		event,
	) => {
		const pdf = event.target.files?.[0];
		if (!pdf) {
			console.log("No file selected");
			return;
		}
		const cv = extractText(pdf);
		setCv(cv);
	};
	const sendMatchResult = async () => {
		const currentTab = (
			await browser.tabs.query({ active: true, currentWindow: true })
		)[0];
		if (!currentTab.id) {
			console.log("No tab");
			return;
		}
		browser.tabs.sendMessage(currentTab.id, {
			matchResult,
			type: "FROM_POPUP",
		});
	};
	// Call on submit button
	const getMatchResult = async () => {
		if (!cv) {
			console.log("No CV");
			return;
		}
		console.log("Got CV", cv);
		const jobDescription = await getJobDescription();
		console.log("jobDescription", jobDescription);
		const response = await matchCv(cv, jobDescription, apiKey);
		if (!response) {
			console.log("No response from gemini");
			return;
		}
		setMatchResult(response);
	};

	const extractText = (resume: File): string => {
		return pdfToText(testCv);
	};

	const getJobDescription = async (): Promise<string> => {
		browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
			console.log(tabs[0].url);
			console.log(tabs[0]);
		});
		return `
		Senior Software Engineer, Core

		Minimum qualifications:
		Bachelor’s degree or equivalent practical experience.
		5 years of experience with software development in one or more programming languages, and with data structures/algorithms.
		3 years of experience testing, maintaining, or launching software products, and 1 year of experience with software design and architecture.
		Ability to communicate in English fluently.

		Preferred qualifications:
		Master's degree or PhD in Computer Science or related technical field.
		1 year of experience in a technical leadership role.
		Experience developing accessible technologies.
		About the job
		Google's software engineers develop the next-generation technologies that change how billions of users connect, explore, and interact with information and one another. Our products need to handle information at massive scale, and extend well beyond web search. We're looking for engineers who bring fresh ideas from all areas, including information retrieval, distributed computing, large-scale system design, networking and data storage, security, artificial intelligence, natural language processing, UI design and mobile; the list goes on and is growing every day. As a software engineer, you will work on a specific project critical to Google’s needs with opportunities to switch teams and projects as you and our fast-paced business grow and evolve. We need our engineers to be versatile, display leadership qualities and be enthusiastic to take on new problems across the full-stack as we continue to push technology forward.

		With your technical expertise you will manage project priorities, deadlines, and deliverables. You will design, develop, test, deploy, maintain, and enhance software solutions.

		The Core team builds the technical foundation behind Google’s flagship products. We are owners and advocates for the underlying design elements, developer platforms, product components, and infrastructure at Google. These are the essential building blocks for excellent, safe, and coherent experiences for our users and drive the pace of innovation for every developer. We look across Google’s products to build central solutions, break down technical barriers and strengthen existing systems. As the Core team, we have a mandate and a unique opportunity to impact important technical decisions across the company.

		Responsibilities
		Write and test product or system development code.
		Participate in, or lead design reviews with peers and stakeholders to decide amongst available technologies.
		Review code developed by other developers and provide feedback to ensure best practices (e.g., style guidelines, checking code in, accuracy, testability, and efficiency).
		Contribute to existing documentation or educational content and adapt content based on product/program updates and user feedback.
		Triage product or system issues and debug/track/resolve by analyzing the sources of issues and the impact on hardware, network, or service operations and quality.

		`;
	};

	return (
		<main className="flex flex-col items-center justify-center p-6 bg-white rounded">
			<div className="w-full max-w-xs">
				<form className="px-8 pt-6 pb-8 mb-4 bg-white">
					<div className="mb-4">
						<label
							className="block mb-2 text-sm font-bold text-gray-700"
							htmlFor="api-key"
						>
							Api Key
						</label>
						<input
							className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
							id="api-key"
							type="text"
							placeholder="Api Key"
							onChange={(e) => setApiKey(e.target.value)}
						/>
					</div>
					{matchResult && <div className="mb-4">{matchResult}</div>}
					<div className="mb-6">
						<label
							className="block mb-2 text-sm font-bold text-gray-700"
							htmlFor="file"
						>
							Choose File{" "}
							<span className="font-normal text-gray-400">(PDF)</span>
						</label>
						<input
							onChange={handleChangeFile}
							type="file"
							className="text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer"
							name="file"
							id="cv-file"
						/>
					</div>
					<button
						className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline"
						id="send-button"
						type="button"
						onClick={getMatchResult}
					>
						Send
					</button>
				</form>
				<div id="response" className="p-4 mt-4 bg-gray-100 rounded"></div>
				<p className="text-xs text-center text-gray-500">
					&copy;2024 Thigs Ltda. All rights reserved.
				</p>
			</div>
		</main>
	);
};
