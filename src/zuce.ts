import { nanoid } from "nanoid";
import type * as CSS from "csstype";
import {
	isNumber,
	throttle,
	isEmpty,
	kebabCase,
	isString,
	isBoolean,
	isUndefined,
	isNull,
	isFunction,
} from "./utils";

export type TagName = HTMLTagName | SVGTagName | "text";

export type HTMLTagName = keyof HTMLElementTagNameMap;

export type SVGTagName = keyof SVGElementTagNameMap;

export type Node = (HTMLElement & Partial<SVGElement>) | (Partial<HTMLElement> & SVGElement);

// ~~~~~~~~~~~~~

export type CSSProperties = CSS.Properties<number | (string & {})>;

type ExtraCSSProperties = {
	/**
	 * The **`text-wrap`** CSS property controls how text inside an element is wrapped. The different values provide:
	 *
	 * **Syntax**: `wrap | nowrap | balance | pretty | stable`
	 *
	 * **Initial value**: `wrap`
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
	 */
	textWrap?: CSS.Globals | "wrap" | "nowrap" | "balance" | "pretty" | "stable" | undefined;
};

type CSSPseudos = { [Key in CSS.Pseudos]?: CSSProperties & ExtraCSSProperties };

type Target = {
	[Key in `${"." | "#" | "&:" | ">" | HTMLTagName | SVGTagName}${string}`]?:
		| (CSSProperties & ExtraCSSProperties & CSSPseudos)
		| CSSProperties;
};

export type CSSStyleDeclaration =
	| (CSSProperties & ExtraCSSProperties & CSSPseudos & Target)
	| CSSProperties;

export type NoContent = "";

export type FlowContent =
	| Extract<
			HTMLTagName,
			| "a"
			| "abbr"
			| "address"
			| "audio"
			| "b"
			| "bdo"
			| "bdi"
			| "blockquote"
			| "br"
			| "button"
			| "canvas"
			| "cite"
			| "code"
			| "data"
			| "datalist"
			| "del"
			| "details"
			| "dfn"
			| "div"
			| "dl"
			| "em"
			| "embed"
			| "fieldset"
			| "figure"
			| "footer"
			| "form"
			| "header"
			| "hgroup"
			| "hr"
			| "i"
			| "iframe"
			| "img"
			| "input"
			| "ins"
			| "kbd"
			| "label"
			| "main"
			| "map"
			| "mark"
			| "menu"
			| "meter"
			| "noscript"
			| "object"
			| "ol"
			| "output"
			| "p"
			| "picture"
			| "pre"
			| "progress"
			| "q"
			| "ruby"
			| "s"
			| "samp"
			| "script"
			| "select"
			| "small"
			| "span"
			| "strong"
			| "sub"
			| "sup"
			| "svg"
			| "table"
			| "template"
			| "textarea"
			| "time"
			| "u"
			| "ul"
			| "var"
			| "video"
			| "wbr"
			| HeadingContent
			| SectioningContent
			| InteractiveContent
			| PhrasingContent
			| EmbeddedContent
			| FormAssociatedContent
	  >
	| Extract<SVGTagName, "svg">;

export type HeadingContent = Extract<
	HTMLTagName,
	"h1" | "h2" | "h3" | "h4" | "h5" | "h6  " | "hgroup"
>;

export type SectioningContent = Extract<HTMLTagName, "article" | "aside" | "nav" | "section">;

export type InteractiveContent = Extract<
	HTMLTagName,
	"a" | "button" | "details" | "embed" | "iframe" | "label" | "select" | "textarea"
>;

export type PhrasingContent = Extract<
	HTMLTagName,
	| "abbr"
	| "audio"
	| "b"
	| "bdo"
	| "br"
	| "button"
	| "canvas"
	| "cite"
	| "code"
	| "data"
	| "datalist"
	| "dfn"
	| "em"
	| "embed"
	| "i"
	| "iframe"
	| "img"
	| "input"
	| "kbd"
	| "label"
	| "mark"
	| "meter"
	| "noscript"
	| "object"
	| "output"
	| "picture"
	| "progress"
	| "q"
	| "ruby"
	| "s"
	| "samp"
	| "script"
	| "select"
	| "slot"
	| "small"
	| "span"
	| "strong"
	| "sub"
	| "sup"
	| "svg"
	| "template"
	| "textarea"
	| "time"
	| "u"
	| "var"
	| "video"
	| "wbr"
>;

export type EmbeddedContent = Extract<
	HTMLTagName,
	"audio" | "canvas" | "embed" | "iframe" | "img" | "object" | "picture" | "svg" | "video"
>;

export type FormAssociatedContent = Extract<
	HTMLTagName,
	| "button"
	| "fieldset"
	| "input"
	| "label"
	| "meter"
	| "object"
	| "output"
	| "progress"
	| "select"
	| "textarea"
>;

export type Animation = Extract<
	SVGTagName,
	"animate" | "animateMotion" | "animateTransform" | "mpath" | "set"
>;
export type Basic = Extract<
	SVGTagName,
	"circle" | "ellipse" | "line" | "polygon" | "polyline" | "rect"
>;
export type Container = Extract<
	SVGTagName,
	| "a"
	| "defs"
	| "g"
	| "marker"
	| "mask"
	| "missing-glyph"
	| "pattern"
	| "svg"
	| "switch"
	| "symbol"
>;
export type Descriptive = Extract<SVGTagName, "desc" | "metadata" | "title">;
export type FilterPrimitive = Extract<
	SVGTagName,
	| "feBlend"
	| "feColorMatrix"
	| "feComponentTransfer"
	| "feComposite"
	| "feConvolveMatrix"
	| "feDiffuseLighting"
	| "feDisplacementMap"
	| "feDropShadow"
	| "feFlood"
	| "feFuncA"
	| "feFuncB"
	| "feFuncG"
	| "feFuncR"
	| "feGaussianBlur"
	| "feImage"
	| "feMerge"
	| "feMergeNode"
	| "feMorphology"
	| "feOffset"
	| "feSpecularLighting"
	| "feTile"
	| "feTurbulence"
>;
export type Font = Extract<
	SVGTagName,
	| "font"
	| "font-face"
	| "font-face-format"
	| "font-face-name"
	| "font-face-src"
	| "font-face-uri"
	| "hkern"
	| "vkern"
>;
export type Gradient = Extract<SVGTagName, "linearGradient" | "radialGradient" | "stop">;
export type Graphics = Extract<
	SVGTagName,
	| "circle"
	| "ellipse"
	| "image"
	| "line"
	| "path"
	| "polygon"
	| "polyline"
	| "rect"
	| "text"
	| "use"
>;
export type GraphicsReferencing = Extract<SVGTagName, "use">;
export type LightSource = Extract<SVGTagName, "feDistantLight" | "fePointLight" | "feSpotLight">;
export type NeverRendered = Extract<
	SVGTagName,
	| "clipPath"
	| "defs"
	| "hatch"
	| "linearGradient"
	| "marker"
	| "mask"
	| "metadata"
	| "pattern"
	| "radialGradient"
	| "script"
	| "style"
	| "symbol"
	| "title"
>;
export type PaintServer = Extract<
	SVGTagName,
	"hatch" | "linearGradient" | "pattern" | "radialGradient" | "solidcolor"
>;

export type Renderable = Extract<
	SVGTagName,
	| "a"
	| "circle"
	| "ellipse"
	| "foreignObject"
	| "g"
	| "image"
	| "line"
	| "path"
	| "polygon"
	| "polyline"
	| "rect"
	| "svg"
	| "switch"
	| "symbol"
	| "text"
	| "textPath"
	| "tspan"
	| "use"
>;

export type Shape = Extract<
	SVGTagName,
	"circle" | "ellipse" | "line" | "path" | "polygon" | "polyline" | "rect"
>;
export type Structural = Extract<SVGTagName, "defs" | "g" | "svg" | "symbol" | "use">;
export type TextContent = Extract<
	SVGTagName,
	"glyph" | "glyphRef" | "textPath" | "text" | "tref" | "tspan"
>;
export type TextContentChild = Extract<SVGTagName, "textPath" | "tref" | "tspan">;
export type Uncategorized = Extract<
	SVGTagName,
	"clipPath" | "cursor" | "filter" | "foreignObject" | "hatchpath" | "script" | "style" | "view"
>;

type Child<T extends TagName, StateType = null> =
	| Hera<T, TagName, StateType, Node>
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

export class Hera<
	TagType extends TagName = TagName,
	ChildType extends TagName = TagName,
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
		  ) => Hera<ChildType, TagName, StateType> | string | number | null | undefined)
		| Hera<ChildType, TagName, StateType>
		| string
		| number
		| null
		| undefined
	>;
	private S: Zuce<StateType> | null;
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
		s: Zuce<StateType> | null,
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<NodeType>
						: StateHook<StateType, NodeType>,
			  ) => Hera<ChildType, TagName, StateType> | string | number | null | undefined)
			| Hera<ChildType, TagName, StateType>
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

		// TODO: HAVE TO UNSIBSCRIBE BUT WHEN???
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
	}) => Hera<TagName, TagName, StateType, NodeType> | string | number | null | undefined {
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
			return fn(new NodeHook<NodeType>(this._.node, typeCallback) as any);
		}
		return fn(
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			new StateHook<StateType, NodeType>(this._.node, this.S.value, typeCallback) as any,
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
	): Hera<TagType, ChildType, StateType, NodeType> {
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
	): Hera<TagType, ChildType, StateType, NodeType> {
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
	): Hera<TagType, ChildType, StateType, NodeType> {
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
		}) => Hera<ChildType, TagName, StateType, NodeType> | string | number | null | undefined,
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
		} else if (newNode instanceof Hera) {
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

export class Zuce<StateType = null> {
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
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLAnchorElement>
						: StateHook<StateType, HTMLAnchorElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<PhrasingContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<PhrasingContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"a", PhrasingContent, StateType, HTMLAnchorElement> {
		return new Hera("a", this, ...(children as []));
	}

	button(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLButtonElement>
						: StateHook<StateType, HTMLButtonElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<PhrasingContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<PhrasingContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"button", PhrasingContent, StateType, HTMLButtonElement> {
		return new Hera("button", this, ...(children as []));
	}

	div(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLDivElement>
						: StateHook<StateType, HTMLDivElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<FlowContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<FlowContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"div", FlowContent, StateType, HTMLDivElement> {
		return new Hera("div", this, ...(children as []));
	}

	form(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLFormElement>
						: StateHook<StateType, HTMLFormElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<FlowContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<FlowContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"form", FlowContent, StateType, HTMLFormElement> {
		return new Hera("form", this, ...(children as []));
	}

	h1(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<TagName, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<TagName, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h1", "span", StateType, HTMLHeadingElement> {
		return new Hera("h1", this, ...(children as []));
	}

	h2(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h2", "span", StateType, HTMLHeadingElement> {
		return new Hera("h2", this, ...(children as []));
	}

	h3(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h3", "span", StateType, HTMLHeadingElement> {
		return new Hera("h3", this, ...(children as []));
	}

	h4(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h4", "span", StateType, HTMLHeadingElement> {
		return new Hera("h4", this, ...(children as []));
	}

	h5(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h5", "span", StateType, HTMLHeadingElement> {
		return new Hera("h5", this, ...(children as []));
	}

	h6(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLHeadingElement>
						: StateHook<StateType, HTMLHeadingElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"h6", "span", StateType, HTMLHeadingElement> {
		return new Hera("h6", this, ...(children as []));
	}

	img(): Hera<"img", "img", StateType, HTMLImageElement> {
		return new Hera("img", this);
	}

	input(): Hera<"input", "input", StateType, HTMLInputElement> {
		return new Hera("input", this);
	}

	label(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLLabelElement>
						: StateHook<StateType, HTMLLabelElement>,
			  ) => // biome-ignore lint/suspicious/noExplicitAny: <explanation>
					| Hera<"span" | "p" | "input" | "textarea", TagName, any, any>
					| string
					| number
					| null
					| undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span" | "p" | "input" | "textarea", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"label", "span" | "p" | "input" | "textarea", StateType, HTMLLabelElement> {
		return new Hera("label", this, ...(children as []));
	}

	nav(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLElement>
						: StateHook<StateType, HTMLElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<TagName, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<TagName, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"nav", FlowContent, StateType, HTMLElement> {
		return new Hera("nav", this, ...(children as []));
	}

	p(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLParagraphElement>
						: StateHook<StateType, HTMLParagraphElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<PhrasingContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<PhrasingContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"p", PhrasingContent, StateType, HTMLParagraphElement> {
		return new Hera("p", this, ...(children as []));
	}

	span(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLSpanElement>
						: StateHook<StateType, HTMLSpanElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"span", "span", StateType, HTMLSpanElement> {
		return new Hera("span", this, ...(children as []));
	}

	table(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableElement>
						: StateHook<StateType, HTMLTableElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"span", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"span", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"table", "span", StateType, HTMLTableElement> {
		return new Hera("table", this, ...(children as []));
	}

	thead(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableSectionElement>
						: StateHook<StateType, HTMLTableSectionElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"tr", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"tr", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"thead", "tr", StateType, HTMLTableSectionElement> {
		return new Hera("thead", this, ...(children as []));
	}

	tbody(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableSectionElement>
						: StateHook<StateType, HTMLTableSectionElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"tr", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"tr", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"tbody", "tr", StateType, HTMLTableSectionElement> {
		return new Hera("tbody", this, ...(children as []));
	}

	tfoot(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableSectionElement>
						: StateHook<StateType, HTMLTableSectionElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<"tr", TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<"tr", TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"tfoot", "tr", StateType, HTMLTableSectionElement> {
		return new Hera("tfoot", this, ...(children as []));
	}

	th(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableCellElement>
						: StateHook<StateType, HTMLTableCellElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<FlowContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<FlowContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"th", FlowContent, StateType, HTMLTableCellElement> {
		return new Hera("th", this, ...(children as []));
	}

	td(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableCellElement>
						: StateHook<StateType, HTMLTableCellElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<FlowContent, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<FlowContent, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"td", FlowContent, StateType, HTMLTableCellElement> {
		return new Hera("td", this, ...(children as []));
	}

	tr(
		...children: Array<
			| ((
					source: StateType extends null
						? NodeHook<HTMLTableRowElement>
						: StateHook<StateType, HTMLTableRowElement>,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			  ) => Hera<TagName, TagName, any, any> | string | number | null | undefined)
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			| Hera<TagName, TagName, any, any>
			| string
			| number
			| null
			| undefined
		>
	): Hera<"tr", "td" | "th", StateType, HTMLTableRowElement> {
		return new Hera("tr", this, ...(children as []));
	}
}

class s<T> {
	private effect: (state: T) => void;
	private source: Zuce<T>;

	constructor(source: Zuce<T>, effect: (state: T) => void) {
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

export const zuce = <T>(current: T) => {
	return new Zuce(current);
};

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
} = zuce(null);

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

class NodeHook<NodeType extends Node> {
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

class StateHook<StateType, NodeType extends Node> {
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

export const start = <T, Y extends Node>(
	app: () => { _: Hera<TagName, TagName, T, Y> },
	config?: {
		normalize?: CSSStyleDeclaration;
	},
) => {
	config?.normalize && insertStyles("*", formatStyles(config.normalize));
	const result = app()._.render();
	window.document.body.appendChild(result as globalThis.Node);
};
