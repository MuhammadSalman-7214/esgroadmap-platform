const transformTableData = <TablePayload extends object>(
	data: TablePayload[],
  columns: Record<string, string>
) => {
	return data.map((row) => {
		const newRow = Object.fromEntries(
			Object.entries(row).map(([key, value]) => {
				const columnName = columns[key];
				return [columnName, value];
			})
		) ;

		return newRow;
	});
};

export default transformTableData;