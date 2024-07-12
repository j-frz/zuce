import { expect, test } from "@jest/globals";

import { div, start /* $ */ } from "../src";
// import userEvent from '@testing-library/user-event';

// const user = userEvent.setup();

// test('div', () => {
// 	start(() => div().attributes({ id: 'test' }).styles({ background: 'red' }));

// 	const divElement = window.document.getElementById('test');

// 	expect(divElement).toBeDefined();

// 	const [styleSheet] = getStyleSheet();
// 	console.log('style 1 =>', styleSheet);
// });
// test('div', () => {
// 	start(() => div().attributes({ id: 'test' }).styles({ background: 'green' }));

// 	const divElement = window.document.getElementById('test');

// 	expect(divElement).toBeDefined();

// 	const [styleSheet] = getStyleSheet();
// 	console.log('style 2 =>', styleSheet);
// });
// test('div', () => {
// 	start(() => div().attributes({ id: 'test' }).styles({ background: 'blue' }));

// 	const divElement = window.document.getElementById('test');

// 	expect(divElement).toBeDefined();

// 	const [styleSheet] = getStyleSheet();
// 	console.log('style 3 =>', styleSheet);
// });

// test('styling update on state update', async () => {
// 	const isBlue = $(false);

// 	const red = isBlue
// 		.div()
// 		.attributes({ id: 'red' })
// 		.events({
// 			click: () => {
// 				isBlue.value = true;
// 			},
// 		})
// 		.styles(({ s }) => {
// 			return { color: s ? 'blue' : 'red' };
// 		});

// 	start(() => div(red) as any);

// 	const [firstRule_test_1, secondRule_test_1] = getStyleSheet();

// 	const redOrBlueDiv = window.document.getElementById('red');

// 	expect(redOrBlueDiv).toBeDefined();
// 	expect(firstRule_test_1).toMatch('._001{color:red;}');
// 	expect(secondRule_test_1).toBe(undefined);

// 	user.click(redOrBlueDiv);

// 	await new Promise((r) => setTimeout(r, 2000));

// 	const [styleSheet] = window.document.adoptedStyleSheets;
// 	styleSheet.cssRules;

// 	const [firstRule_test_2, secondRule_test_2] = getStyleSheet();
// 	expect(firstRule_test_2).toMatch('._001{color:red;}');
// 	expect(secondRule_test_2).toMatch('._002{color:blue;}');
// });

test("basic styling", () => {
	const red = div().attributes({ id: "red" }).styles({ color: "pink" });
	const blue = div().attributes({ id: "blue" }).styles({ color: "green" });

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	start(() => div(red, blue) as any);

	const redDiv = window.document.getElementById("red");
	const blueDiv = window.document.getElementById("blue");

	const [[firstSelector, firstRule], [secondSelector, secondRule]] = getStyleSheet();

	expect(redDiv).toBeDefined();
	expect(blueDiv).toBeDefined();
	expect(redDiv.classList.toString()).toMatch(firstSelector);
	expect(blueDiv.classList.toString()).toMatch(secondSelector);

	expect(firstRule).toMatch("{color:pink;}");

	expect(secondRule).toMatch("{color:green;}");
});

const getStyleSheet = () => {
	const styleSheet = window.document.adoptedStyleSheets[0];
	console.log("asd", styleSheet.cssRules);
	return Array.from(styleSheet.cssRules).map((cssRule: CSSRule) => {
		const [selector, rule] = String(cssRule).split(/(?={)/g);
		return [selector.replace(/[.#]/, ""), rule];
	});
};
