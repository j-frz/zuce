const nanoid = jest.mock("nanoid", () => {
	let index = 0;
	return {
		nanoid: () => {
			index++;
			return String(index).padStart(3, "0");
		},
	};
});
