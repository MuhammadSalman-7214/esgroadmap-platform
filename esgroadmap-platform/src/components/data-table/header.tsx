"use client";
import React from "react";
import { Dropdown } from "primereact/dropdown";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";

const Header: React.FC<{
	globalFilterValue: string;
	onGlobalFilterChange: React.ChangeEventHandler<HTMLInputElement>;
	onDownloadOptionSelect: (option: string) => Promise<void>;
	onFilterOptionSelect: (option: string) => Promise<void>;
}> = ({
	globalFilterValue,
	onGlobalFilterChange,
	onDownloadOptionSelect,
	onFilterOptionSelect,
}) => {
	const downloadOptions = [
		{ label: "CSV", value: "csv" },
		{ label: "Excel", value: "excel" },
	];

	const filtersOptions = [
		{ label: "Save", value: "save" },
		{ label: "Apply", value: "apply" },
	];

	return (
		<div className="flex flex-col md:flex-row md:gap-0 gap-4 justify-between items-center">
			<div className="flex flex-col sm:flex-row items-center gap-4 w-[100%] md:w-[40%]">
				{/* Download dropdown */}
				<Dropdown
					value={null}
					options={downloadOptions}
					className="w-[100%] flex-1 md:flex-0"
					placeholder="Download"
					onChange={async (e) => {
						console.log("Selected Download option:", e.value);
						await onDownloadOptionSelect(e.value);
					}}
				/>

				{/* Filters dropdown */}
				<Dropdown
					value={null}
					options={filtersOptions}
					placeholder="Filters"
					className="w-[100%] flex-1 md:flex-0"
					onChange={async (e) => {
						console.log("Selected Filters option:", e.value);
						// Add logic to handle filter action
						await onFilterOptionSelect(e.value);
					}}
				/>
			</div>

			<IconField
				iconPosition="left"
				style={{ minWidth: 120 }}
				className="md:max-w-[250px] max-w-[1000px] w-[100%]"
			>
				<InputIcon className="pi pi-search" />
				<InputText
					value={globalFilterValue}
					onChange={onGlobalFilterChange}
					placeholder="Keyword Search"
					className="w-[100%] flex-1 md:flex-0"
				/>
			</IconField>
		</div>
	);
};

export default Header;
