import JSDOMEnvironment from "jest-environment-jsdom";
// import JSDOM from 'jsdom';

class CustomEnvironment extends JSDOMEnvironment {
	constructor(config, context) {
		super(config, context);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(this.global.CSSStyleSheet as any) = function () {
			this.cssRules = [];
			this.index = 0;
			this.insertRule = function (styleRule: string, index: number) {
				this.cssRules[index] = styleRule;
			};

			return this;
		};
		this.global.document.adoptedStyleSheets = [];
	}

	async setup() {
		await super.setup();
	}

	async teardown() {
		await super.teardown();
	}

	getVmContext() {
		return super.getVmContext();
	}
}

export default CustomEnvironment;
