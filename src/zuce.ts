import type { FlowContent, PhrasingContent, TagName, Node, CSSStyleDeclaration } from "./models.js";
import {
	isBoolean,
	isEmpty,
	isFunction,
	isNull,
	isNumber,
	isString,
	isUndefined,
	kebabCase,
	throttle,
} from "lodash";
import { nanoid } from "nanoid";

type Child<T extends TagName, StateType = null> =
	| Zuce<T, TagName, StateType, Node>
	| string
	| number;

type NodeSubscription<T, N> = (x: {
	n: N;
}) => T;

type StatefulNodeSubscription<T, S = null, N = Node> = (source: {
	n: N;
	s: S;
}) => T;

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets.push(sheet);

const db = new Map();
const _DB = new Map();

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type Children<StateType, NType extends Zuce<TagName, TagName, any, Node>> = Array<
	| ((
			source: StateType extends null
				? NodeHook<HTMLSpanElement>
				: StateHook<StateType, HTMLSpanElement>,
	  ) => NType["_children"][number] | string | number | null | undefined)
	| NType["_children"][number]
	| string
	| number
	| null
	| undefined
>;

const getClassName = (styles: Partial<CSSStyleDeclaration>) => {
	const key = JSON.stringify(styles);
	if (!_DB.has(key)) {
		const className = `_${nanoid(4)}`;
		_DB.set(key, className);
		return className;
	}
	return _DB.get(key);
};

const insertStyles = (selector: string, styles: string) => {
	const hasRule = db.has(selector);
	if (hasRule) {
		return;
	}
	const index = sheet.cssRules.length;
	sheet.insertRule(`${selector}{${styles}}`, index);
	db.set(selector, index);
};

type NodeEvents = Partial<{
	[P in keyof HTMLElementEventMap]: EventListenerOrEventListenerObject;
}>;
type NodeCSSProperties = Partial<CSSStyleDeclaration>;
type NodeAttributes = Partial<Record<string, string | number | object>>;

type MapKey = "styles" | "events" | "attributes" | number;

export class Zuce<
	TagType extends TagName,
	ChildType extends TagName,
	StateType = null,
	NodeType extends Node = Node,
> {
	readonly _: this;
	readonly node: NodeType;
	readonly childType: ChildType;
	readonly tag: TagType;
	readonly _children: Array<
		| ((
				source: StateType extends null
					? NodeHook<NodeType>
					: StateHook<StateType, NodeType>,
		  ) => Zuce<ChildType, TagName, StateType> | string | number | null | undefined)
		| Zuce<ChildType, TagName, StateType>
		| string
		| number
		| null
		| undefined
	>;
	private S: S<StateType> | null;
	// private s: s<StateType> | null;
	private resizeObserver: ResizeObserver;

	private NodeFuture = new Map<
		MapKey,
		NodeSubscription<
			Child<ChildType> | { [key: string]: string } | NodeEvents | NodeCSSProperties,
			NodeType
		>
	>();

	private StateFuture = new Map<
		MapKey,
		StatefulNodeSubscription<
			Child<ChildType> | { [key: string]: string } | NodeEvents | NodeCSSProperties,
			StateType,
			NodeType
		>
	>();

	private _prevEvents: Partial<{
		[P in keyof HTMLElementEventMap]: EventListenerOrEventListenerObject;
	}> | null;

	private styleClass: string | null;

	constructor(
		tag: TagType,
		s: S<StateType> | null,
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<NodeType>
						: StateHook<StateType, NodeType>,
			  ) => Zuce<ChildType, TagName, StateType> | string | number | null | undefined)
			| Zuce<ChildType, TagName, StateType>
			| string
			| number
			| null
			| undefined
		>
	) {
		this._ = this;
		this.S = s || null;
		this.tag = tag;
		this.node = document.createElement(this.tag) as NodeType;

		/* this.s = */ s?.subscribe(() => this.update("StateFuture")) || null;
		this.styleClass = null;

		this._children = children.map((child, index) => {
			if (child instanceof Function) {
				return this.connectSocket(child, index);
			}
			return child;
		});

		this.resizeObserver = null;
	}

	private update(stateKey: "StateFuture" | "NodeFuture") {
		console.log("s", s);

		for (const [key, value] of this[stateKey].entries()) {
			if (this.isStylesUpdate(value, key)) {
				this.styles(value);
			} else if (this.isAttributesUpdate(value, key)) {
				this.attributes(value);
			} else if (this.isEventsUpdate(value, key)) {
				this.events(value);
			} else if (this.isRenderUpdate(value, key) && isNumber(key)) {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				this.updateRender(key, value as any);
			}
		}
	}

	private isRenderUpdate(
		value,
		key: MapKey,
	): value is (source: {
		n: NodeType;
		s: StateType;
	}) => Zuce<TagName, TagName, StateType, NodeType> | string | number | null | undefined {
		return typeof key === "number";
	}

	private isStylesUpdate(
		value,
		key: MapKey,
	): value is (
		source: StateType extends null ? NodeHook<NodeType> : StateHook<StateType, NodeType>,
	) => NodeCSSProperties {
		return key === "styles";
	}

	private isAttributesUpdate(
		value,
		key: MapKey,
	): value is (
		source: StateType extends null ? NodeHook<NodeType> : StateHook<StateType, NodeType>,
	) => NodeAttributes {
		return key === "attributes";
	}

	private isEventsUpdate(
		value,
		key: MapKey,
	): value is (
		source: StateType extends null ? NodeHook<NodeType> : StateHook<StateType, NodeType>,
	) => NodeEvents {
		return key === "events";
	}

	private resize() {
		return throttle(
			() => {
				if (this) {
					this.update("NodeFuture");
				} else {
					this.resizeObserver.disconnect();
					this.resizeObserver = null;
				}
			},
			Math.round(1000 / 12),
		);
	}

	private connectSocket<T>(
		fn: (
			source: StateType extends null ? NodeHook<NodeType> : StateHook<StateType, NodeType>,
		) => T,
		key: "styles" | "events" | "attributes" | number,
	): T {
		const typeCallback = (type: "s" | "n") => {
			if (type === "s") {
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				this.StateFuture.set(key, fn as any);
			} else if (type === "n") {
				this.NodeFuture.set(key, fn);
				this.connectResizeObserver();
			}
		};

		if (this.S === null) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			return fn(new NodeHook<NodeType>(this.node, typeCallback) as any);
		}
		return fn(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			new StateHook<StateType, NodeType>(this.node, this.S.value, typeCallback) as any,
		);
	}

	private connectResizeObserver() {
		if (this.resizeObserver) {
			return;
		}
		this.resizeObserver = new ResizeObserver(this.resize());
		this.resizeObserver.observe(this.node);
	}

	attributes(
		attributes:
			| ((
					source: StateType extends null
						? NodeHook<NodeType>
						: StateHook<StateType, NodeType>,
			  ) => NodeAttributes)
			| NodeAttributes,
	): Zuce<TagType, ChildType, StateType, NodeType> {
		const derivedAttributes = derive(() => {
			if (attributes instanceof Function) {
				return this.connectSocket(attributes, "attributes");
			}
			return attributes;
		});

		if (isEmpty(derivedAttributes)) return this;

		for (const [attribute, value] of Object.entries(derivedAttributes)) {
			this.node.setAttribute(kebabCase(attribute), String(value));

			if (attribute === "class" && this.styleClass) {
				this.node.classList.add(this.styleClass);
			}
		}
		return this;
	}

	events(
		events:
			| ((
					source: StateType extends null
						? NodeHook<NodeType>
						: StateHook<StateType, NodeType>,
			  ) => NodeEvents)
			| NodeEvents,
	): Zuce<TagType, ChildType, StateType, NodeType> {
		const derivedEvents = derive(() => {
			if (events instanceof Function) {
				return this.connectSocket(events, "events");
			}
			return events;
		});

		if (isEmpty(derivedEvents)) {
			return this;
		}

		if (this._prevEvents) {
			for (const [eventName, eventListener] of Object.entries(this._prevEvents)) {
				this.node.removeEventListener(
					eventName as keyof HTMLElementEventMap,
					eventListener,
				);
			}
		}

		for (const [eventName, eventListener] of Object.entries(derivedEvents)) {
			this.node.addEventListener(
				eventName as keyof HTMLElementEventMap,
				eventListener as (
					this: HTMLElement,
					ev: HTMLElementEventMap[keyof HTMLElementEventMap],
				) => void,
			);
		}

		this._prevEvents = derivedEvents;

		return this;
	}

	styles(
		styles:
			| ((
					source: StateType extends null
						? NodeHook<NodeType>
						: StateHook<StateType, NodeType>,
			  ) => NodeCSSProperties)
			| NodeCSSProperties,
	): Zuce<TagType, ChildType, StateType, NodeType> {
		const derivedStyles = derive(() => {
			if (styles instanceof Function) {
				return this.connectSocket(styles, "styles");
			}
			return styles;
		});

		if (isEmpty(derivedStyles)) {
			return this;
		}

		const className = getClassName(derivedStyles);

		if (this.node.classList.contains(this.styleClass)) {
			this.node.classList.replace(this.styleClass, className);
		} else {
			this.node.classList.add(className);
		}
		this.styleClass = className;

		const newStyles = formatStyles(derivedStyles);

		insertStyles(`.${className}`, newStyles);

		return this;
	}

	private updateRender(
		index: number,
		subscription: (source: {
			n: NodeType;
			s: StateType;
		}) => Zuce<ChildType, TagName, StateType, NodeType> | string | number | null | undefined,
	) {
		const newNode = subscription({
			s: this.S?.value ?? null,
			n: this.node,
		});

		if (newNode === this._children[index]) {
			return;
		}

		this._children[index] = newNode;

		if (
			isString(newNode) ||
			isNumber(newNode) ||
			isBoolean(newNode) ||
			isUndefined(newNode) ||
			isNull(newNode)
		) {
			if (this.node.childNodes[index]) {
				this.node.childNodes[index]?.replaceWith(
					document.createTextNode(String(newNode ?? "")),
				);
			} else {
				this.node.append(document.createTextNode(String(newNode ?? "")));
			}
		} else if (newNode instanceof Zuce) {
			const target = newNode._.render();

			if (this.node.childNodes[index]) {
				this.node.childNodes[index]?.replaceWith(target);
			} else {
				this.node.append(target);
			}
		}
	}

	render() {
		if (!this._children) {
			return;
		}

		const parent = this.node;
		parent.innerText = "";

		const fragment = document.createDocumentFragment();

		for (const child of this._children) {
			const result = derive(() => {
				if (isBoolean(child)) {
					return;
				}

				if (isString(child) || isNumber(child) || isNull(child)) {
					return String(child ?? "");
				}

				if (isFunction(child)) {
				} else if (child._._children?.length) {
					return child._.render();
				} else {
					return child.node;
				}
			});

			parent.append(result);
		}

		fragment.append(parent);

		return fragment;
	}
}

export class S<StateType = null> {
	private current: StateType;
	subscribers: s<StateType>[];
	constructor(first: StateType) {
		this.current = first;
		this.subscribers = [];
	}

	get value(): StateType {
		return this.current;
	}

	set value(v: StateType | ((previous: StateType) => StateType)) {
		this.current = v instanceof Function ? (v(this.current) as StateType) : v;
		this.notify();
	}

	subscribe(effect: (current: StateType) => void) {
		const subscription = new s(this, effect);
		subscription.update(this.current);
		this.subscribers = [...this.subscribers, subscription];
		return subscription;
	}

	unsubscribe(subscription: s<StateType>) {
		this.subscribers = this.subscribers.filter(
			(_subscription: s<StateType>) => _subscription !== subscription,
		);
	}

	private notify() {
		for (const subscriber of this.subscribers) {
			subscriber.update(this.current);
		}
	}

	a(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, A<any>>
	): A<StateType> {
		return new A<StateType>(this, ...(children as A<StateType>["_children"]));
	}

	button(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, BUTTON<any>>
	): BUTTON<StateType> {
		return new BUTTON<StateType>(this, ...(children as BUTTON<StateType>["_children"]));
	}

	div(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, DIV<any>>
	): DIV<StateType> {
		return new DIV<StateType>(this, ...(children as DIV<StateType>["_children"]));
	}

	form(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, FORM<any>>
	): FORM<StateType> {
		return new FORM<StateType>(this, ...(children as FORM<StateType>["_children"]));
	}

	h1(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H1<any>>
	): H1<StateType> {
		return new H1<StateType>(this, ...(children as H1<StateType>["_children"]));
	}

	h2(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H2<any>>
	): H2<StateType> {
		return new H2<StateType>(this, ...(children as H2<StateType>["_children"]));
	}

	h3(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H3<any>>
	): H3<StateType> {
		return new H3<StateType>(this, ...(children as H3<StateType>["_children"]));
	}

	h4(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H4<any>>
	): H4<StateType> {
		return new H4<StateType>(this, ...(children as H4<StateType>["_children"]));
	}

	h5(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H5<any>>
	): H5<StateType> {
		return new H5<StateType>(this, ...(children as H5<StateType>["_children"]));
	}

	h6(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, H6<any>>
	): H6<StateType> {
		return new H6<StateType>(this, ...(children as H6<StateType>["_children"]));
	}

	img(): IMG {
		return new IMG();
	}

	input(): INPUT {
		return new INPUT();
	}

	label(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, LABEL<any>>
	): LABEL<StateType> {
		return new LABEL<StateType>(this, ...(children as LABEL<StateType>["_children"]));
	}

	nav(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, NAV<any>>
	): NAV<StateType> {
		return new NAV<StateType>(this, ...(children as NAV<StateType>["_children"]));
	}
	p(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, P<any>>
	): P<StateType> {
		return new P<StateType>(this, ...(children as P<StateType>["_children"]));
	}

	span(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, SPAN<any>>
	): SPAN<StateType> {
		return new SPAN<StateType>(this, ...(children as SPAN<StateType>["_children"]));
	}

	table(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TABLE<any>>
	): TABLE<StateType> {
		return new TABLE<StateType>(this, ...(children as TABLE<StateType>["_children"]));
	}

	thead(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, THEAD<any>>
	): THEAD<StateType> {
		return new THEAD<StateType>(this, ...(children as THEAD<StateType>["_children"]));
	}

	tbody(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TBODY<any>>
	): TBODY<StateType> {
		return new TBODY<StateType>(this, ...(children as TBODY<StateType>["_children"]));
	}

	tfoot(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TFOOT<any>>
	): TFOOT<StateType> {
		return new TFOOT<StateType>(this, ...(children as TFOOT<StateType>["_children"]));
	}

	th(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TH<any>>
	): TH<StateType> {
		return new TH<StateType>(this, ...(children as TH<StateType>["_children"]));
	}

	td(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TD<any>>
	): TD<StateType> {
		return new TD<StateType>(this, ...(children as TD<StateType>["_children"]));
	}

	tr(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		...children: Children<StateType, TR<any>>
	): TR<StateType> {
		return new TR<StateType>(this, ...(children as TR<StateType>["_children"]));
	}
}

class s<T> {
	private effect: (state: T) => void;
	private source: S<T>;

	constructor(source: S<T>, effect: (state: T) => void) {
		this.source = source;
		this.effect = effect;
	}

	update(current: T) {
		this.effect(current);
	}

	subscribe(effect: (current: T) => void) {
		this.source.subscribe(effect);
		return this;
	}

	unsubscribe() {
		this.source.unsubscribe(this);
	}
}

export const $ = <T>(current: T) => {
	return new S(current);
};

export class A<StateType = unknown> extends Zuce<
	"a",
	PhrasingContent,
	StateType,
	HTMLAnchorElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"a", PhrasingContent, StateType, HTMLAnchorElement>["_children"]
	) {
		super("a", s, ...(children as []));
	}
}

export class BUTTON<StateType = unknown> extends Zuce<
	"button",
	PhrasingContent,
	StateType,
	HTMLButtonElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"button", PhrasingContent, StateType, HTMLButtonElement>["_children"]
	) {
		super("button", s, ...(children as []));
	}
}

export class DIV<StateType = unknown> extends Zuce<"div", FlowContent, StateType, HTMLDivElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"div", FlowContent, StateType, HTMLDivElement>["_children"]
	) {
		super("div", s, ...(children as []));
	}
}

export class FORM<StateType = unknown> extends Zuce<
	"form",
	FlowContent,
	StateType,
	HTMLFormElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"form", FlowContent, StateType, HTMLFormElement>["_children"]
	) {
		super("form", s, ...(children as []));
	}
}

export class H1<StateType = unknown> extends Zuce<"h1", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h1", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h1", s, ...(children as []));
	}
}

export class H2<StateType = unknown> extends Zuce<"h2", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h2", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h2", s, ...(children as []));
	}
}

export class H3<StateType = unknown> extends Zuce<"h3", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h3", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h3", s, ...(children as []));
	}
}

export class H4<StateType = unknown> extends Zuce<"h4", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h4", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h4", s, ...(children as []));
	}
}

export class H5<StateType = unknown> extends Zuce<"h5", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h5", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h5", s, ...(children as []));
	}
}

export class H6<StateType = unknown> extends Zuce<"h6", "span", StateType, HTMLHeadingElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"h6", "span", StateType, HTMLHeadingElement>["_children"]
	) {
		super("h6", s, ...(children as []));
	}
}

export class IMG extends Zuce<"img", "img", HTMLImageElement> {
	constructor() {
		super("img", null);
	}
}
export class INPUT extends Zuce<"input", "input", HTMLInputElement> {
	constructor() {
		super("input", null);
	}
}

export class P<StateType = unknown> extends Zuce<
	"p",
	PhrasingContent,
	StateType,
	HTMLParagraphElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"p", PhrasingContent, StateType, HTMLParagraphElement>["_children"]
	) {
		super("p", s, ...(children as []));
	}
}

export class SPAN<StateType = unknown> extends Zuce<"span", "span", StateType, HTMLSpanElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"span", "span", StateType, HTMLSpanElement>["_children"]
	) {
		super("span", s, ...(children as []));
	}
}

export class LABEL<StateType = unknown> extends Zuce<
	"label",
	"span" | "p" | "input" | "textarea",
	StateType,
	HTMLLabelElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<
			"label",
			"span" | "p" | "input" | "textarea",
			StateType,
			HTMLLabelElement
		>["_children"]
	) {
		super("label", s, ...(children as []));
	}
}

export class NAV<StateType = unknown> extends Zuce<"nav", FlowContent, StateType, HTMLElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"nav", FlowContent, StateType, HTMLElement>["_children"]
	) {
		super("nav", s, ...(children as []));
	}
}

export class TABLE<StateType = unknown> extends Zuce<"table", "span", StateType, HTMLTableElement> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"table", "span", StateType, HTMLTableElement>["_children"]
	) {
		super("table", s, ...(children as []));
	}
}

export class THEAD<StateType = unknown> extends Zuce<
	"thead",
	"tr",
	StateType,
	HTMLTableSectionElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"thead", "tr", StateType, HTMLTableSectionElement>["_children"]
	) {
		super("thead", s, ...(children as []));
	}
}

export class TBODY<StateType = unknown> extends Zuce<
	"tbody",
	"tr",
	StateType,
	HTMLTableSectionElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"tbody", "tr", StateType, HTMLTableSectionElement>["_children"]
	) {
		super("tbody", s, ...(children as []));
	}
}

export class TFOOT<StateType = unknown> extends Zuce<
	"tfoot",
	"tr",
	StateType,
	HTMLTableSectionElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"tfoot", "tr", StateType, HTMLTableSectionElement>["_children"]
	) {
		super("tfoot", s, ...(children as []));
	}
}

export class TH<StateType = unknown> extends Zuce<
	"th",
	FlowContent,
	StateType,
	HTMLTableCellElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"th", FlowContent, StateType, HTMLTableCellElement>["_children"]
	) {
		super("th", s, ...(children as []));
	}
}

export class TD<StateType = unknown> extends Zuce<
	"td",
	FlowContent,
	StateType,
	HTMLTableCellElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"td", FlowContent, StateType, HTMLTableCellElement>["_children"]
	) {
		super("td", s, ...(children as []));
	}
}

export class TR<StateType = unknown> extends Zuce<
	"tr",
	"td" | "th",
	StateType,
	HTMLTableRowElement
> {
	constructor(
		s: S<StateType>,
		...children: Zuce<"tr", "td" | "th", StateType, HTMLTableRowElement>["_children"]
	) {
		super("tr", s, ...(children as []));
	}
}

const {
	a,
	button,
	div,
	form,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	img,
	input,
	label,
	nav,
	p,
	span,
	table,
	thead,
	tbody,
	tfoot,
	th,
	td,
	tr,
} = $(null);

export {
	a,
	button,
	div,
	form,
	h1,
	h2,
	h3,
	h4,
	h5,
	h6,
	img,
	input,
	label,
	nav,
	p,
	span,
	table,
	thead,
	tbody,
	tfoot,
	th,
	td,
	tr,
};

export const keyframes = ({
	animationName,
	to,
	from,
}: {
	animationName: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	from: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	to: any;
}): string => {
	insertStyles(
		`@keyframes ${animationName}`,
		`
			from {
				${Object.entries(from)
					.map(([key, value]) => cssProperty(key, String(value)))
					.join("")}
			}
			to {
				${Object.entries(to)
					.map(([key, value]) => cssProperty(key, String(value)))
					.join("")}
			}
		`,
	);
	return animationName;
};

// keyframes({
// 	animationName: 'fade-in',
// 	from: { opacity: '0', transform: 'scaleX(0)' },
// 	to: { opacity: '1', transform: 'scaleX(1)' },
// });

export const formatStyles = (styles?: CSSStyleDeclaration) => {
	if (!styles) {
		return "";
	}

	const selectorEntries = Object.entries(styles);

	let result = "";
	for (const [key, value] of selectorEntries) {
		if (typeof value === "object") {
			result += cssSelector(key, value);
		} else {
			result += cssProperty(key, value);
		}
	}

	return result;
};

const cssSelector = (selector: string, styles: CSSStyleDeclaration) => {
	return `${selector}{${formatStyles(styles)}}`;
};
const cssProperty = (key: string, value: string | number) => {
	return `${kebabCase(key)}:${propertyToUnit(key, value)};`;
};

const propertyToUnit = (key: string, value: string | number) => {
	switch (key) {
		case "transition":
			return formatValue(value, "s");
		default:
			return formatValue(value, "px");
	}
};

const formatValue = (value: string | number, unit: string) => {
	switch (typeof value) {
		case "number":
			return `${value}${unit}`;
		default:
			return value;
	}
};

type NodeCallback = (type: "n") => void;

class NodeHook<NodeType> {
	private _node: NodeType;
	private _cb: NodeCallback;
	constructor(node: NodeType, callback: NodeCallback) {
		this._node = node;
		this._cb = callback;
	}

	get n() {
		this._cb("n");
		return this._node;
	}
}

type StateCallback = (type: "n" | "s") => void;

class StateHook<StateType, NodeType> {
	private _node: NodeType;
	private _s: StateType;
	private _cb: StateCallback;
	constructor(node: NodeType, state: StateType, callback: StateCallback) {
		this._node = node;
		this._s = state;
		this._cb = callback;
	}

	get n() {
		this._cb("n");
		return this._node;
	}
	get s() {
		this._cb("s");
		return this._s;
	}
}

const derive = <T>(cb: () => T) => cb();

export const start = (
	app: () => InstanceType<typeof Zuce>,
	config?: {
		normalize?: CSSStyleDeclaration;
	},
) => {
	config?.normalize && insertStyles("*", formatStyles(config.normalize));
	const result = app()._.render();
	window.document.body.appendChild(result as globalThis.Node);
};
