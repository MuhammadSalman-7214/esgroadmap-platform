"use client";
import React, { useCallback, useRef, useState } from "react";
import {
	DataTableFilterMeta,
	DataTableFilterMetaData,
	DataTable as PRDataTable,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import Header from "./header";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import SaveFilterDialog from "./save-filter";
import ApplyFilterDialog from "./apply-filter";
import { convertArrayToCSV } from "convert-array-to-csv";
import * as XLSX from "xlsx";
import convertTargetName from "@/utils/conver-target-name";

type DataTableProps<TRow extends object> = {
	tableName: string;
	data: TRow[];
	columns: React.ComponentProps<typeof Column>[];
	filters?: Record<string, FilterMatchMode>;
};

const convertToFilters = <TRow extends object>(
	filters: DataTableProps<TRow>["filters"]
) => {
	let tableFilters: DataTableFilterMeta = {
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
	};

	if (!filters) return tableFilters;

	const dynamicFilters: DataTableFilterMeta = Object.keys(filters).reduce(
		(prev, current) => {
			const matchMode = filters[current];
			return {
				...prev,
				[current]: { value: null, matchMode },
			};
		},
		{}
	);

	return {
		...tableFilters,
		...dynamicFilters,
	};
};

function DataTable<TRow extends object>(props: DataTableProps<TRow>) {
	const ref = useRef<PRDataTable<TRow[]> | null>(null);

	const [filters, setFilters] = useState(() =>
		convertToFilters<TRow>(props.filters)
	);
	// const filters = convertToFilters(props.filters);
	const [loading, setLoading] = useState(false);
	const [showDialogs, setShowDialogs] = useState({
		save: false,
		apply: false,
	});
	const [data, setData] = useState<TRow[]>(props.data);
	const [globalFilterValue, setGlobalFilterValue] = useState("");

	const setDialogValue = useCallback(
		(key: keyof typeof showDialogs, value: boolean) => {
			setShowDialogs((prev) => {
				return { ...prev, [key]: value };
			});
		},
		[]
	);

	const onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				const value = e.target.value;
				let _filters = { ...filters };

				_filters["global"] = {
					..._filters["global"],
					value,
				};
				setFilters(_filters);
				setGlobalFilterValue(value);
			},
			[filters]
		);

	const onFilterOptionSelect = useCallback(
		async (option: string) => {
			if (option === "save") {
				if (
					Object.keys(filters).filter((key) => {
						return "value" in filters[key]
							? (filters[key] as DataTableFilterMetaData)?.value
							: false;
					}).length === 0
				) {
					toast.error("Please select some filters first");
					return;
				}
				setDialogValue("save", true);
			} else if (option === "apply") {
				setDialogValue("apply", true);
			}
		},
		[filters, setDialogValue]
	);

	const saveToCSV = async () => {
		const csvData = convertArrayToCSV(data);

		const blob = new Blob([csvData], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${props.tableName}-${Date.now()}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		if (!ref.current) return;
		return ref.current.exportCSV({ selectionOnly: true });
	};

	const saveToExcel = async () => {
		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(
			workbook,
			worksheet,
			convertTargetName(props.tableName)
		);

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${props.tableName}-${Date.now()}.xlsx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow w-100 flex-1">
			<PRDataTable
				value={props.data}
				ref={ref}
				paginator
				rows={10}
				loading={loading}
				dataKey="id"
				emptyMessage="No data found."
				pageLinkSize={6}
				header={
					<Header
						globalFilterValue={globalFilterValue}
						onGlobalFilterChange={onGlobalFilterChange}
						onDownloadOptionSelect={async (option) => {
							if (option === "csv") {
								await saveToCSV();
							} else if (option === "excel") {
								await saveToExcel();
							}
						}}
						onFilterOptionSelect={onFilterOptionSelect}
					/>
				}
				filters={filters}
				globalFilterFields={props.filters ? Object.keys(props.filters) : []}
				filterDisplay="row"
				alwaysShowPaginator
				showGridlines
				stripedRows
				rowsPerPageOptions={[10, 50, 100, 150]}
				exportFilename={Date.now().toString()}
				paginatorTemplate={{
					layout:
						"FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport",
				}}
				paginatorPosition="bottom"
				className="p-datatable-sm"
				tableStyle={{ 
					width: '100%',
					minWidth: 'auto'
				}}
				resizableColumns
				columnResizeMode="expand"
				scrollable
				scrollHeight="calc(100vh - 300px)"
				breakpoint="960px"
				onValueChange={(value) => {
					setData(value);
				}}
				onFilter={(event) => setFilters(event.filters)}
				reorderableColumns
				virtualScroller={false}
			>
				{props.columns.map((col, index) => (
					<Column
						key={index}
						columnKey={index.toString()}
						{...col}
						className="py-2"
						resizeable={true}
						style={{ width: col.width }}
					/>
				))}
			</PRDataTable>
			<SaveFilterDialog
				filters={
					ref?.current?.getFilterMeta() ??
					({} as Record<string, DataTableFilterMetaData>)
				}
				onClose={() => setDialogValue("save", false)}
				show={showDialogs.save}
				tableName={props.tableName}
			/>
			<ApplyFilterDialog
				onClose={() => setDialogValue("apply", false)}
				show={showDialogs.apply}
				tableName={props.tableName}
				applyFilter={(filters) => {
					console.log(`Applying filters: `, filters);
					setFilters(filters);
					// if (!ref.current) return;
					// ref.current.setFilterMeta(filters);
				}}
			/>
		</div>
	);
}

export default DataTable;
