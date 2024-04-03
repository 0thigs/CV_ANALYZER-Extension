import {
	generationConfig,
	getModel,
	safetySettings,
} from "../../src/services/ai";

export const matchCv = async (
	cv: string,
	jobDescription: string,
	apiKey: string,
) => {
	const chat = getModel(apiKey).startChat({
		generationConfig,
		safetySettings,
		history: [],
	});

	const { response } = await chat.sendMessage(`
      You are a recruiter. You are going to rate from 1-10 the match between the candidate's resume and a job description. Your output is a number followed by a short sentence exaplaining why.
      
      Resume:
      ${cv}
      
      Job description page:
      ${jobDescription}

      `);
	console.log("Response:: ", response);
	console.log("Response text:: ", response.text());
	return response.text();
};
