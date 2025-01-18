import calculateWidthBasedOnWordLength from "@/utils/calculate-width";
import { useCallback, useMemo, useState } from "react";
import dbColumns from "@/constants/columns";
import { Column } from "primereact/column";
import Link from "next/link";
import { FilterMatchMode, FilterOperator } from "primereact/api";
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
		// Special handling for sector code column to prevent excessive width
		if (key.includes("sector code")) {
			return { 
				limit: 10000, 
				width: 150  // Fixed width for sector code columns
			};
		}

		const hasEnoughSpaces = key.split(" ").length > 4;
		let width =
			calculateWidthBasedOnWordLength(key, hasEnoughSpaces ? 2 : 1) + 40;

		let limit = 10000;

		if (key === dbColumns.TargetSentenceView.Target_sentence) {
			limit = 80;
			width += 100;
		}

		return { limit, width };
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
					// <Link
					// 	href={value}
					// 	target="_blank"
					// 	className="text-blue-600 text-[15px]"
					// >
					// 	Click Here
					// </Link>
					<Link
  						href={value}
  						target="_blank"
  						rel="noopener noreferrer"
  						aria-label="Open document"
  						className="inline-flex items-center text-blue-600"
						>
  						<i className="pi pi-external-link mr-1"></i> View
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
			const { width } = getWordLimitAndWidth(key);

			const options = {
				header: renderHeader(key),
				field: key,
				body: renderBody(key),
				headerStyle: { paddingLeft: 0, paddingRight: 0 },
				bodyStyle: { padding: '0.5rem 1rem' },
				headerClassName:
					"text-[14px] text-center items-center py-2 font-semibold [&_.p-sortable-column-icon]:mr-2",
				bodyClassName: "text-[14px] py-2 text-center px-2 sm:px-3 md:px-4 lg:px-6",
				sortable: true,
				filter: key in filters,
				showFilterMenuOptions: true,
				showFilterMenu: true,
				filterMenuStyle: { width: '250px' },
			} as React.ComponentProps<typeof Column>;

			if (key in filters) {
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
						options.showFilterOperator = false;
						options.filterMatchModeOptions = [{ value: 'in', label: 'In' }];
						options.showFilterMatchModes = false;
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
