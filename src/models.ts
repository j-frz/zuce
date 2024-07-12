import type * as CSS from "csstype";

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
