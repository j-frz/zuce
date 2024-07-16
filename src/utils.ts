export const kebabCase = (str: string) => {
	let result = "";
	for (let i = 0; i < str.length; i++) {
		if (str[i].match(/[A-Z]/)) {
			if (i > 0) {
				result += "-";
			}
			result += str[i].toLowerCase();
			continue;
		}
		result += str[i];
	}
	return result;
};
export const isNumber = (value: unknown): value is number => {
	return typeof value === "number";
};
export const isNull = (value: unknown): value is null => {
	return value === null;
};
export const isEmpty = (obj: object): boolean => {
	return typeof obj === "object" && !Array.isArray(obj) && Object.keys(obj).length === 0;
};

export const isString = (value: unknown): value is string => {
	return typeof value === "string";
};
export const isBoolean = (value: unknown): value is boolean => {
	return typeof value === "boolean";
};
export const isUndefined = (value: unknown): value is undefined => {
	return value === undefined;
};
export const isFunction = (value: unknown) => {
	return typeof value === "function";
};

export const throttle = (cb: (...args: unknown[]) => void, delay: number) => {
	let wait = false;
	let storedArgs: unknown[] | null = null;

	function checkStoredArgs() {
		if (storedArgs == null) {
			wait = false;
		} else {
			cb(...storedArgs);
			storedArgs = null;
			setTimeout(checkStoredArgs, delay);
		}
	}

	return (...args: unknown[]) => {
		if (wait) {
			storedArgs = args;
			return;
		}

		cb(...args);
		wait = true;
		setTimeout(checkStoredArgs, delay);
	};
};
