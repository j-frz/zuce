# ZUCE 🌩️

A library designed for composing reactive user-interfaces

## Installation

```
npm i zuce
```

## Documentation
### Use

This is a simple App

```ts
import { div, start } from "zuce";

const App = div('ZUCE');

start(App);
```

### Compose

This is how you compose

```ts
div("ZUCE", 7777, div());
```

### Charge

This is how you charge a div element with styles, events and attributes

```ts
div('ZUCE')
    .styles({
        backgroundColor: "lightyellow",
    })
    .events({ click: () => alert("ZUCE") })
    .attributes({ id: "ZUCE" });
```


This is how you access a DOM element

```ts
const element = div(({ n }) => n.offsetWidth);

const { node } = element;

element.node
```

### Overload

This is how you load state

```ts
import { zuce } from "zuce";

const state = zuce('ZUCE');
```
This is how you generate nodes charged with state

```ts
const state = zuce('ZUCE');

const overloadedDiv = state.div(({ s }) => s);
```
This is how you update the state

```ts
const state = zuce('ZUCE');

setInterval(() => (state.value = '⚡' + state.value + '⚡'), 250);

const overloadedDiv = state.div(({ s }) => s);
```

## Examples

### Counter

```ts
import { start, div, zuce, button, type Zuce, type FlowContent, type Hera } from "zuce";

const Container = (...children: Hera<FlowContent>[]) =>
	div(...children).styles({
		backgroundColor: "#080821",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
		display: "flex",
		height: "100vh",
		color: "white",
		width: "100vw",
	});

const Button = (label: string, click: () => void) =>
	button(label).events({ click }).styles({
		backgroundColor: "lightyellow",
		cursor: "pointer",
		borderRadius: 20,
		padding: 10,
		height: 40,
		width: 40,
	});

const Counter = (counter: Zuce<number>) =>
	counter
		.div(({ s }) => s)
		.styles({
			border: "2px solid white",
			justifyContent: "center",
			alignItems: "center",
			borderRadius: 20,
			display: "flex",
			padding: 10,
			height: 40,
			width: 40,
		});

const App = () => {
	const counter = zuce(0);
    
	return Container(
		Counter(counter),
		Button("⚡", () => counter.value++),
	);
};

start(App, {
	normalize: {
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
		fontFamily: "'Futura', sans-serif",
		button: {
			border: "none",
			borderRadius: 0,
			background: "none",
		},
	},
});
```


