import { expect, test } from "@jest/globals";

import { div, start, zuce } from "../src";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

test("styles update", async () => {
	const getStyleSheet = () => {
		const styleSheet = window.document.adoptedStyleSheets[0];
		return Array.from(styleSheet.cssRules).map((cssRule: CSSRule) => {
			const [selector, rule] = String(cssRule).split(/(?={)/g);
			return [selector.replace(/[.#]/, ""), rule];
		});
	};

	const pink = div().attributes({ id: "pink" }).styles({ color: "pink" });
	const green = div().attributes({ id: "green" }).styles({ color: "green" });

	const isBlue = zuce(false);

	const redOrBlue = isBlue
		.div()
		.attributes({ id: "red-or-blue" })
		.events({
			click: () => {
				isBlue.value = true;
			},
		})
		.styles(({ s }) => {
			return { color: s ? "blue" : "red" };
		});

	start(() => div(pink, green, redOrBlue));

	const pinkDiv = window.document.getElementById("pink");
	const greenDiv = window.document.getElementById("green");
	const redOrBlueDiv = window.document.getElementById("red-or-blue");

	const [[pinkSelector, pinkRule], [greenSelector, greenRule], [redSelector, redRule]] =
		getStyleSheet();

	expect(pinkDiv).toBeDefined();
	expect(pinkDiv?.classList.toString()).toMatch(pinkSelector);
	expect(pinkRule).toMatch("{color:pink;}");

	expect(greenDiv).toBeDefined();
	expect(greenDiv?.classList.toString()).toMatch(greenSelector);
	expect(greenRule).toMatch("{color:green;}");

	expect(redOrBlueDiv).toBeDefined();
	expect(redOrBlueDiv?.classList.toString()).toMatch(redSelector);
	expect(redRule).toMatch("{color:red;}");

	user.click(redOrBlueDiv as Element);

	await new Promise((r) => setTimeout(r, 100));

	const [, , , [blueSelector, blueRule]] = getStyleSheet();

	expect(redOrBlueDiv).toBeDefined();
	expect(redOrBlueDiv?.classList.toString()).toMatch(blueSelector);
	expect(blueRule).toMatch("{color:blue;}");
});

test("attributes update", async () => {
	const isBlue = zuce(false);

	const redOrBlue = isBlue
		.div()
		.attributes(({ s }) => ({ id: s ? "blue" : "red" }))
		.events({
			click: () => {
				isBlue.value = true;
			},
		});

	start(() => div(redOrBlue));

	const redDiv = window.document.getElementById("red");
	expect(redDiv).toBeDefined();
	expect(redDiv?.attributes.getNamedItem("id")?.value).toMatch("red");

	user.click(redDiv as Element);

	await new Promise((r) => setTimeout(r, 100));

	const blueDiv = window.document.getElementById("blue");
	expect(blueDiv).toBeDefined();
	expect(blueDiv).toEqual(redDiv);
});

test("events update", async () => {
	const clickAssertFalse = jest.fn(() => {
		isBlue.value = true;
	});
	const clickAssertTrue = jest.fn(() => {
		isBlue.value = false;
	});

	const isBlue = zuce(false);

	const redOrBlue = isBlue
		.div()
		.attributes({ id: "ZUCE" })
		.events(({ s }) => ({ click: s ? clickAssertTrue : clickAssertFalse }));

	start(() => div(redOrBlue));

	const redDiv = window.document.getElementById("ZUCE");
	expect(redDiv).toBeDefined();

	user.click(redDiv as Element);

	await new Promise((r) => setTimeout(r, 100));

	expect(clickAssertFalse).toBeCalled();

	user.click(redDiv as Element);

	await new Promise((r) => setTimeout(r, 100));

	expect(clickAssertTrue).toBeCalled();
});
