"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
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
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";

type DataTableProps<TRow extends object> = {
	tableName: string;
	data: TRow[];
	columns: React.ComponentProps<typeof Column>[];
	filters?: Record<string, FilterMatchMode>;
	filterTitle?: string;
};

type DownloadOption = 'csv-all' | 'csv-page' | 'excel-all' | 'excel-page';

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
	const [pageLinkSize, setPageLinkSize] = useState(6);
	const [paginatorTemplate, setPaginatorTemplate] = useState({
		layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
	});
	const [rowsPerPageOptions, setRowsPerPageOptions] = useState([10, 50, 100, 150]);
	const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
	const [processedData, setProcessedData] = useState<TRow[]>(props.data);
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);

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

	const getCurrentPageData = useCallback((): TRow[] => {
		if (!ref.current) return [];
		return processedData.slice(first, first + rows);
	}, [processedData, first, rows]);

	const saveToCSV = async (pageOnly: boolean = false) => {
		const dataToExport = pageOnly ? getCurrentPageData() : data;
		const csvData = convertArrayToCSV(dataToExport);

		const blob = new Blob([csvData], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${props.tableName}-${pageOnly ? 'current-page-' : ''}${Date.now()}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const saveToExcel = async (pageOnly: boolean = false) => {
		const dataToExport = pageOnly ? getCurrentPageData() : data;
		const worksheet = XLSX.utils.json_to_sheet(dataToExport);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(
			workbook,
			worksheet,
			pageOnly ? 'Current Page' : convertTargetName(props.tableName)
		);

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${props.tableName}-${pageOnly ? 'current-page-' : ''}${Date.now()}.xlsx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleDownload = async (option: DownloadOption) => {
		switch (option) {
			case 'csv-all':
				await saveToCSV(false);
				break;
			case 'csv-page':
				await saveToCSV(true);
				break;
			case 'excel-all':
				await saveToExcel(false);
				break;
			case 'excel-page':
				await saveToExcel(true);
				break;
		}
	};

	const clearFilters = useCallback(() => {
		// Reset filters to initial state
		const initialFilters = convertToFilters<TRow>(props.filters);
		setFilters(initialFilters);
		// Clear global filter value
		setGlobalFilterValue('');
		// Clear active filters
		setActiveFilters({});
		// Reset DataTable's internal filter state
		if (ref.current) {
			ref.current.reset();
		}
	}, [props.filters]);

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth;
			if (width < 640) { // sm breakpoint
				setPageLinkSize(0);
				setPaginatorTemplate({
					layout: "FirstPageLink PrevPageLink NextPageLink LastPageLink CurrentPageReport"
				});
			} else if (width < 768) { // md breakpoint
				setPageLinkSize(2);
				setPaginatorTemplate({
					layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
				});
			} else if (width < 1024) { // lg breakpoint
				setPageLinkSize(4);
				setPaginatorTemplate({
					layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
				});
			} else {
				setPageLinkSize(6);
				setPaginatorTemplate({
					layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
				});
			}
		};

		// Set initial value
		handleResize();

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow flex-1 flex flex-col min-h-0 [&_.p-datatable-header]:p-2">
			<PRDataTable
				value={props.data}
				ref={ref}
				paginator
				loading={loading}
				dataKey="id"
				emptyMessage="No data found."
				pageLinkSize={pageLinkSize}
				header={
					<Header
						globalFilterValue={globalFilterValue}
						onGlobalFilterChange={onGlobalFilterChange}
						onDownloadOptionSelect={handleDownload}
						onFilterOptionSelect={onFilterOptionSelect}
						filterTitle={props.filterTitle}
						activeFilters={activeFilters}
						onClearFilters={clearFilters}
					/>
				}
				filters={filters}
				globalFilterFields={props.filters ? Object.keys(props.filters) : []}
				filterDisplay="menu"
				filterIcon="pi pi-sliders-h"
				alwaysShowPaginator
				showGridlines
				stripedRows
				rowsPerPageOptions={rowsPerPageOptions}
				scrollable
				scrollHeight="flex"
				exportFilename={Date.now().toString()}
				paginatorTemplate={paginatorTemplate.layout}
				paginatorPosition="bottom"
				tableStyle={{ minWidth: "50rem" }}
				onValueChange={(value) => {
					setData(value);
					setProcessedData(value);
				}}
				onFilter={(event) => {
					setFilters(event.filters);
					const newActiveFilters: Record<string, any> = {};
					Object.entries(event.filters).forEach(([key, filter]) => {
						if (filter && 'value' in filter && filter.value !== null && filter.value !== '') {
							if (key !== 'global') {
								newActiveFilters[key] = filter.value;
							}
						}
					});
					setActiveFilters(newActiveFilters);
				}}
				onPage={(e) => {
					setFirst(e.first);
					setRows(e.rows);
				}}
				first={first}
				rows={rows}
				className="
					flex-1
					flex
					flex-col
					[&_.p-datatable-wrapper]:flex-1
					[&_.p-datatable-wrapper]:flex
					[&_.p-datatable-wrapper]:flex-col
					[&_.p-datatable-table]:flex-1
					[&_.p-datatable-scrollable-wrapper]:flex-1
					[&_.p-datatable-scrollable-view]:flex-1
					[&_.p-paginator]:flex-wrap 
					[&_.p-paginator]:gap-1 
					[&_.p-paginator]:justify-center 
					[&_.p-paginator-current]:text-sm
					[&_.p-paginator-current]:text-center
					[&_.p-paginator-current]:order-last 
					[&_.p-paginator-current]:w-full 
					sm:[&_.p-paginator-current]:w-auto
					[&_.p-sortable-column]:hover:bg-gray-50
					[&_.p-column-header]:border-b
					[&_.p-column-header]:border-gray-200
				"
				paginatorLeft={null}
				paginatorRight={null}
				sortIcon={(options) => (
					<span className="text-500">
						{options.sorted ? options.sortOrder === 1 ? '▼' : '▲' : ''}
					</span>
				)}
			>
				{props.columns.map((col, index) => (
					<Column
						key={index}
						columnKey={index.toString()}
						{...col}
						className="py-1"
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