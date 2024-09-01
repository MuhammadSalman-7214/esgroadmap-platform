
const calculateWidthBasedOnWordLength = (word: string, line: number) => {
	word = word.trim();
	const charWidth = 12;
	const wordLength = parseInt((word.length / line).toString());

  const width = wordLength * charWidth;

	return width;
};

export default calculateWidthBasedOnWordLength;