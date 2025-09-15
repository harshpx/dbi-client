const BASE_URL = import.meta.env.PROD ? "https://64.225.85.94.nip.io" : "/api";

export type CommonResponse<T> = {
	status: number;
	timestamp: number;
	success: boolean;
	response: T;
};

export type PredictionResponse = {
	label: string;
	confidence: number;
};

export const checkApiHealth = async (): Promise<CommonResponse<String>> => {
	const reponse = await fetch(`${BASE_URL}`);
	const data = await reponse.json();
	return data;
};

export const getPredictionFromUrl = async (
	imageUrl: string,
): Promise<CommonResponse<PredictionResponse>> => {
	const endpoint = `${BASE_URL}/predict/url`;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ url: imageUrl }),
	};
	const response = await fetch(endpoint, options);
	const data = await response.json();
	return data;
};

export const getPredictionFromFile = async (
	file: File,
): Promise<CommonResponse<PredictionResponse>> => {
	const formData = new FormData();
	formData.append("file", file);

	const endpoint = `${BASE_URL}/predict/upload`;
	const options = {
		method: "POST",
		body: formData,
	};
	const response = await fetch(endpoint, options);
	const data = await response.json();
	return data;
};
