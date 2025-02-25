const convertTargetName = (tableName: string) => {
	return tableName
		.split("_")
		.map((i) => i.at(0)?.toUpperCase() + i.slice(1))
		.join(" ");
};

export default convertTargetName;
