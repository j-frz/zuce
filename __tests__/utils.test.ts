import { expect, test } from "@jest/globals";
import {
	kebabCase,
	isNumber,
	isNull,
	isEmpty,
	isString,
	isBoolean,
	isUndefined,
	isFunction,
	throttle,
} from "../src/utils";

test("kebab case", () => {
	expect(kebabCase("strokeWidth")).toMatch("stroke-width");
	expect(kebabCase("flexDirection")).toMatch("flex-direction");
	expect(kebabCase("lineHeight")).toMatch("line-height");
	expect(kebabCase("alignItems")).toMatch("align-items");
	expect(kebabCase("justifyContent")).toMatch("justify-content");
});

test("is number", () => {
	expect(isNumber(12)).toEqual(true);
	expect(isNumber(true)).toEqual(false);
	expect(isNumber(undefined)).toEqual(false);
	expect(isNumber(null)).toEqual(false);
	expect(isNumber("flexDirection")).toEqual(false);
	expect(isNumber(() => {})).toEqual(false);
	expect(isNumber({})).toEqual(false);
	expect(isNumber([])).toEqual(false);
});

test("is null", () => {
	expect(isNull(12)).toEqual(false);
	expect(isNull(true)).toEqual(false);
	expect(isNull(undefined)).toEqual(false);
	expect(isNull(null)).toEqual(true);
	expect(isNull("flexDirection")).toEqual(false);
	expect(isNull(() => {})).toEqual(false);
	expect(isNull({})).toEqual(false);
	expect(isNull([])).toEqual(false);
});

test("is empty", () => {
	expect(isEmpty({ key: "value" })).toEqual(false);
	expect(isEmpty(() => {})).toEqual(false);
	expect(isEmpty({})).toEqual(true);
	expect(isEmpty([])).toEqual(false);
});

test("is string", () => {
	expect(isString(12)).toEqual(false);
	expect(isString(true)).toEqual(false);
	expect(isString(undefined)).toEqual(false);
	expect(isString(null)).toEqual(false);
	expect(isString("flexDirection")).toEqual(true);
	expect(isString(() => {})).toEqual(false);
	expect(isString({})).toEqual(false);
	expect(isString([])).toEqual(false);
});

test("is boolean", () => {
	expect(isBoolean(12)).toEqual(false);
	expect(isBoolean(true)).toEqual(true);
	expect(isBoolean(false)).toEqual(true);
	expect(isBoolean(undefined)).toEqual(false);
	expect(isBoolean(null)).toEqual(false);
	expect(isBoolean("flexDirection")).toEqual(false);
	expect(isBoolean(() => {})).toEqual(false);
	expect(isBoolean({})).toEqual(false);
	expect(isBoolean([])).toEqual(false);
});

test("is undefined", () => {
	expect(isUndefined(12)).toEqual(false);
	expect(isUndefined(true)).toEqual(false);
	expect(isUndefined(undefined)).toEqual(true);
	expect(isUndefined(null)).toEqual(false);
	expect(isUndefined("flexDirection")).toEqual(false);
	expect(isUndefined(() => {})).toEqual(false);
	expect(isUndefined({})).toEqual(false);
	expect(isUndefined([])).toEqual(false);
});

test("is function", () => {
	expect(isFunction(12)).toEqual(false);
	expect(isFunction(true)).toEqual(false);
	expect(isFunction(undefined)).toEqual(false);
	expect(isFunction(null)).toEqual(false);
	expect(isFunction("flexDirection")).toEqual(false);
	expect(isFunction(() => {})).toEqual(true);
	expect(isFunction({})).toEqual(false);
	expect(isFunction([])).toEqual(false);
});

describe("throttle", () => {
	test("should run once if called one time", async () => {
		const callback = jest.fn(() => {});

		const throttledCallback = jest.fn(throttle(callback, 100));

		throttledCallback();
		expect(throttledCallback).toBeCalledTimes(1);
		expect(callback).toBeCalledTimes(1);
		await new Promise((r) => setTimeout(r, 100));
		expect(callback).toBeCalledTimes(1);
	});
	test("should run twice if called two times", async () => {
		const callback = jest.fn(() => {});

		const throttledCallback = jest.fn(throttle(callback, 100));

		throttledCallback();
		throttledCallback();
		expect(throttledCallback).toBeCalledTimes(2);
		expect(callback).toBeCalledTimes(1);
		await new Promise((r) => setTimeout(r, 100));
		expect(callback).toBeCalledTimes(2);
	});
	test("should run twice if called many times", async () => {
		const callback = jest.fn(() => {});

		const throttledCallback = jest.fn(throttle(callback, 100));

		throttledCallback();
		throttledCallback();
		throttledCallback();
		throttledCallback();
		throttledCallback();
		expect(throttledCallback).toBeCalledTimes(5);
		expect(callback).toBeCalledTimes(1);
		throttledCallback();
		throttledCallback();
		await new Promise((r) => setTimeout(r, 100));
		expect(throttledCallback).toBeCalledTimes(7);
		expect(callback).toBeCalledTimes(2);
	});
});
