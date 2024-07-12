// import { beforeEach } from '@jest/globals';

const nanoid = jest.mock("nanoid", () => {
	let index = 0;
	return {
		nanoid: () => {
			index++;
			return String(index).padStart(3, "0");
		},
	};
});

beforeEach(() => {
	const [styleSheet] = window.document.adoptedStyleSheets;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	(styleSheet.cssRules as any) = [];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	((styleSheet as any).index as any) = 0;
	window.document.body.innerHTML = "";
});
