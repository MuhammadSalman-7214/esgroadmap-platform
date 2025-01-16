import calculateWidthBasedOnWordLength from "@/utils/calculate-width";
import { useCallback, useMemo, useState } from "react";
import dbColumns from "@/constants/columns";
import { Column } from "primereact/column";
import Link from "next/link";
import { FilterMatchMode } from "primereact/api";
import { MultiSelect } from "primereact/multiselect";

const filters = {
	ID: FilterMatchMode.CONTAINS,
	Company: FilterMatchMode.IN,
	"Target Sentence": FilterMatchMode.CONTAINS,
	"Target Year(s)": FilterMatchMode.CONTAINS,
	Country: FilterMatchMode.IN,
	"sector code #1 (NAICS)": FilterMatchMode.IN,
	"sector name #1 (NAICS)": FilterMatchMode.IN,
	"Upload Date": FilterMatchMode.CONTAINS,
};

const representativesItemTemplate = (option: any) => {
	return (
		<div className="flex align-items-center gap-2">
			<span>{option.name}</span>
		</div>
	);
};

const getFilterData = <T extends object>(data: Array<T>) => {
	let filterKeysData: Partial<
		Record<keyof typeof filters, Array<{ name: string }>>
	> = {};

	Object.keys(data[0]).forEach((key) => {
		if (key in filters) {
			let filterKey = key as keyof typeof filters;
			// If filter match mode is IN
			if (filters[filterKey] === FilterMatchMode.IN) {
				let filterData = [
					...new Set(data.map((i) => i[key as keyof T]) as string[]),
				].map((name) => ({ name }));

				filterKeysData[filterKey] = filterData;
			}
		}
	});

	return filterKeysData;
};

const getMultiSelectFilterTemplate = (templateOptions: {
	data: Array<{ name: string }>;
	key: string;
}) => {
	const renderComponent: React.ComponentProps<
		typeof Column
	>["filterElement"] = (options) => {

		return (
			<MultiSelect
				value={
					options.value === null
						? []
						: options.value.map((i: any) => ({ name: i }))
				}
				options={templateOptions.data}
				itemTemplate={representativesItemTemplate}
				onChange={(e) => {
					options.filterApplyCallback(e.value.map((i: any) => i.name));
				}}
				optionLabel="name"
				filter
				placeholder={`Select ${templateOptions.key
					.split(" ")
					.slice(0, 2)
					.join(" ")}`}
				className="p-column-filter"
			/>
		);
	};

	return renderComponent;
};

const useTargetTable = <T extends object>(data: Array<T>) => {
	const [showModal, setShowModal] = useState(false);
	const [selectedTargetSentence, setSelectedTargetSentence] = useState("");

	const filterKeysData = useMemo(() => {
		return getFilterData(data);
	}, [data]);

	const getWordLimitAndWidth = (key: string) => {
		// Optimized column widths
		switch(key) {
			case 'ID':
				return {
					limit: 10000,
					width: '100px',
					style: {
						width: '100px',
						minWidth: '100px',
						maxWidth: '150px',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}
				};
			case dbColumns.TargetSentenceView.Target_sentence:
				return {
					limit: 100,
					width: '400px',
					style: { width: '400px' }
				};
			case dbColumns.TargetSentenceView.DocURL:
				return {
					limit: 10000,
					width: '100px',
					style: { width: '100px' }
				};
			case dbColumns.TargetSentenceView.Company:
				return {
					limit: 10000,
					width: '150px',
					style: { width: '150px' }
				};
			case dbColumns.TargetSentenceView.Target_Years:
				return {
					limit: 10000,
					width: '120px',
					style: { width: '120px' }
				};
			case dbColumns.TargetSentenceView.Country:
				return {
					limit: 10000,
					width: '120px',
					style: { width: '120px' }
				};
			case dbColumns.TargetSentenceView.Upload_Date:
				return {
					limit: 10000,
					width: '120px',
					style: { width: '120px' }
				};
			default:
				return {
					limit: 10000,
					width: '130px',
					style: { width: '130px' }
				};
		}
	};

	const renderHeader = useCallback((key: string) => {
		const { width } = getWordLimitAndWidth(key);

		const header = () => {
			return (
				<div
					style={{
						width: width,
						textAlign: "center",
					}}
				>
					{key}
				</div>
			);
		};

		return header;
	}, []);

	const renderBody = useCallback((key: string) => {
		const { width, limit } = getWordLimitAndWidth(key);

		const body = (row: any) => {
			let value = row[key];

			if (value === null) {
				return "N/A";
			}

			if (key === dbColumns.TargetSentenceView.DocURL) {
				return (
					<Link
						href={value}
						target="_blank"
						className="text-blue-600 text-[15px]"
					>
						Click Here
					</Link>
				);
			}

			if (key === dbColumns.TargetSentenceView.Target_sentence) {
				return (
					<span
						onClick={() => {
							setShowModal(true);
							setSelectedTargetSentence(value);
						}}
						className="cursor-pointer"
					>
						{value.length > limit ? value.slice(0, limit) + "..." : value}
					</span>
				);
			}

			if (value instanceof Date) {
				return <span>{value.toLocaleDateString()}</span>;
			}

			// value = value?.trim();

			return (
				<span>
					{value.length > limit ? value.slice(0, limit) + "..." : value}
				</span>
			);
		};

		return body;
	}, []);

	const columns = useMemo(() => {
		if (data.length === 0) return [];
		return Object.keys(data[0]).map((key) => {
			const { width, style } = getWordLimitAndWidth(key);

			const options = {
				header: renderHeader(key),
				field: key,
				body: renderBody(key),
				headerStyle: { 
					paddingLeft: '0.75rem', 
					paddingRight: '1.5rem',
					whiteSpace: 'normal',
					minHeight: '3rem',
					position: 'relative'
				},
				bodyStyle: { 
					paddingLeft: '0.75rem', 
					paddingRight: '0.75rem',
					whiteSpace: 'normal'
				},
				headerClassName: "text-[14px] text-center items-center py-3 font-semibold",
				bodyClassName: "text-[14px] px-4 py-3 text-center",
				sortable: true,
				filter: key in filters,
				showFilterMenuOptions: false,
				showFilterMenu: false,
				sortIconClassName: "ml-2",
				style: {
					...style,
					textAlign: 'center'
				},
			} as React.ComponentProps<typeof Column>;

			if (key in filters) {
				options.filterHeaderStyle = { 
					minWidth: width + 100,
					textAlign: 'center'
				};
				let filterKey = key as keyof typeof filters;
				const matchMode = filters[filterKey];
				options.filterMatchMode = matchMode;
				if (matchMode === FilterMatchMode.IN) {
					const filterData = filterKeysData[filterKey];
					if (filterData) {
						options.filterElement = getMultiSelectFilterTemplate({
							data: filterData,
							key,
						});
					}
				}
			}

			return options;
		});
	}, [data, filterKeysData, renderHeader, renderBody]);

	return {
		columns,
		showTargetModel: showModal,
		setShowTargetModal: setShowModal,
		selectedTargetSentence,
		filters,
	};
};

export default useTargetTable;
