export const validateImageUrl = (url: string): boolean => {
	const pattern =
		/^https?:\/\/(www\.)?[\w\-]+(\.[\w\-]+)+\/?.*\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i;
	return !!pattern.test(url);
};

export const cleanLabel = (label: string): string => {
	let cleanLabel = label.split(/[-_ ]/).slice(1).join(" ");
	let capitalizedlabel = cleanLabel.charAt(0).toUpperCase() + cleanLabel.slice(1);
	return capitalizedlabel;
};

export const formatConfidence = (confidence: number): String => {
	return (confidence * 100).toFixed(2) + "%";
};
