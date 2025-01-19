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

// Update country code mapping with more countries
const countryCodeMap: Record<string, string> = {
	'United States': 'US',
	'Australia': 'AU',
	'United Kingdom': 'UK',
	'Canada': 'CA',
	'China': 'CN',
	'Japan': 'JP',
	'Germany': 'DE',
	'France': 'FR',
	'India': 'IN',
	'Brazil': 'BR',
	'South Korea': 'KR',
	'Singapore': 'SG',
	'Netherlands': 'NL',
	'Switzerland': 'CH',
	'Sweden': 'SE',
	'Norway': 'NO',
	'Denmark': 'DK',
	'Finland': 'FI',
	'Italy': 'IT',
	'Spain': 'ES',
	'Belgium': 'BE',
	'Ireland': 'IE',
	'New Zealand': 'NZ',
	'Austria': 'AT',
	'Portugal': 'PT',
	'Luxembourg': 'LU',
	'Taiwan': 'TW',
	'Russia': 'RU',
	'Colombia': 'CO',
	'Thailand': 'TH',
	'Mexico': 'MX',
	'Poland': 'PL',
	'Greece': 'GR',
	'Malaysia': 'MY',
	'Indonesia': 'ID',
	'Philippines': 'PH',
	'Vietnam': 'VN',
	'Turkey': 'TR',
	'Saudi Arabia': 'SA',
	'United Arab Emirates': 'AE',
	'Israel': 'IL',
	'South Africa': 'ZA',
	'Argentina': 'AR',
	'Chile': 'CL',
	'Peru': 'PE'
};

// Add reverse mapping for filters
const reverseCountryMap = Object.entries(countryCodeMap).reduce((acc, [full, code]) => {
	acc[code] = full;
	return acc;
}, {} as Record<string, string>);

const getFilterData = <T extends object>(data: Array<T>) => {
	let filterKeysData: Partial<
		Record<keyof typeof filters, Array<{ name: string }>>
	> = {};

	Object.keys(data[0]).forEach((key) => {
		if (key in filters) {
			let filterKey = key as keyof typeof filters;
			if (filters[filterKey] === FilterMatchMode.IN) {
				const filterData = [...new Set(data.map((i) => i[key as keyof T]) as string[])];
				filterKeysData[filterKey] = filterData.map(name => ({ name }));
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
						: options.value.map((i: string) => ({ name: i }))
				}
				options={templateOptions.data}
				itemTemplate={representativesItemTemplate}
				onChange={(e) => {
					options.filterApplyCallback(e.value.map((i: any) => i.name));
				}}
				optionLabel="name"
				filter
				placeholder={`Select ${templateOptions.key.split(" ").slice(0, 2).join(" ")}`}
				className="p-column-filter"
			/>
		);
	};

	return renderComponent;
};

export default function useTargetTable<T extends object>(data: Array<T>) {
	const [showModal, setShowModal] = useState(false);
	const [selectedTargetSentence, setSelectedTargetSentence] = useState("");

	const filterKeysData = useMemo(() => {
		return getFilterData(data);
	}, [data]);

	const getWordLimitAndWidth = (key: string) => {
		// Calculate minimum width needed for two lines based on character count
		const charWidth = 8; // Approximate width per character in pixels
		const minWidth = Math.ceil((key.length * charWidth) / 2); // Width needed for 2 lines
		
		// Base widths for different column types
		let baseWidth = 140;
		if (key.includes("sector code")) {
			baseWidth = 120;
		} else if (key === "Target Sentence") {
			baseWidth = 250;
		} else if (key === "ID") {
			baseWidth = 95;
		} else if (key === "Country") {
			baseWidth = 125;
		} else if (key === "Upload Date") {
			baseWidth = 110;
		} else if (key.includes("sector name")) {
			baseWidth = 160;

		} else if (key === "Target Year(s)") {
			baseWidth = 150;
		}
		
		else if (key === "DocURL") {
			baseWidth = 95;
		}
		
		// Use the larger of minWidth or baseWidth
		const width = Math.max(minWidth, baseWidth);
		
		return {
			width,
			limit: key === "Target Sentence" ? 80 : 100
		};
	};

	const renderHeader = useCallback((key: string) => {
		return (
			<div className="w-full whitespace-normal break-words max-h-[3rem] line-clamp-2">
				{key}
			</div>
		);
	}, []);

	const renderBody = useCallback((key: string) => {
		const { width, limit } = getWordLimitAndWidth(key);
		return (row: any) => {
			let value = row[key];

			if (value === null) {
				return "N/A";
			}

			// Country code mapping with hover tooltip
			if (key === dbColumns.TargetSentenceView.Country) {
				return (
					<div
						className="relative group overflow-hidden whitespace-nowrap text-ellipsis"
						style={{ width: width }}
					>
						<span title={value}>
							{countryCodeMap[value] || value}
						</span>
					</div>
				);
			}

			// Document URL - simplified
			if (key === dbColumns.TargetSentenceView.DocURL) {
				return (
					<Link
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open document"
						className="inline-flex items-center text-blue-600"
					>
						<i className="pi pi-external-link" />
					</Link>
				);
			}

			// Target Sentence -> open modal on click. No tooltip truncation.
			if (key === dbColumns.TargetSentenceView.Target_sentence) {
				return (
					<span
						onClick={() => {
							setShowModal(true);
							setSelectedTargetSentence(value);
						}}
						className="cursor-pointer"
						style={{
							width: width,
							display: "inline-block",
							overflow: "hidden",
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
						}}
					>
						{value.length > limit ? value.slice(0, limit) + "..." : value}
					</span>
				);
			}

			// Generic date check
			if (value instanceof Date) {
				return (
					<span style={{ width: width }}>
						{value.toLocaleDateString()}
					</span>
				);
			}

			// For other columns, truncate + hover full text
			return (
				<span
					style={{
						// width: (key === dbColumns.TargetSentenceView.Company || key === dbColumns.TargetSentenceView.sector_code__1__NAICS_ || key === dbColumns.TargetSentenceView.SentenceTargetYear) ? 'auto' : width,
						width: 'auto',
						display: "inline-block",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "ellipsis"
					}}
					title={value}
				>
					{value.length > limit ? value.slice(0, limit) + "..." : value}
				</span>
			);
		};
	}, []);

	const columns = useMemo(() => {
		if (data.length === 0) return [];
		return Object.keys(data[0]).map((key) => {
			const { width } = getWordLimitAndWidth(key);

			// Define which columns should be center-aligned
			const centerAlignedColumns = [
				dbColumns.TargetSentenceView.DocURL,
				dbColumns.TargetSentenceView.Country,
				'Target Year(s)',
				'Company',
				'sector code #1 (NAICS)'
			];
			
			const isCentered = centerAlignedColumns.includes(key);

			const options = {
				header: renderHeader(key),
				field: key,
				body: renderBody(key),
				headerStyle: {
					width: `${width}px`,
					minWidth: `${width}px`,
					maxWidth: `${width}px`,
					overflow: 'visible',
					height: 'auto',
				},
				bodyStyle: {
					width: `${width}px`,
					minWidth: `${width}px`,
					maxWidth: `${width}px`,
					overflow: 'hidden',
					...(isCentered && {
						textAlign: 'center',
						placeItems: 'center'
					})
				},
				headerClassName: `
					overflow-visible
					py-2
					${isCentered ? 'text-center items-center' : ''}
				`,
				bodyClassName: `
					text-[14px]
					${isCentered ? 'text-center items-center  py-2 justify-center' : 'text-left py-2 px-2'}
				`,
				sortable: true,
				filter: key in filters,
				showFilterMenuOptions: true,
				showFilterMenu: true,
				filterMenuStyle: { width: '250px' },
			} as React.ComponentProps<typeof Column>;

			// Hook up prime filters
			if (key in filters) {
				const filterKey = key as keyof typeof filters;
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
