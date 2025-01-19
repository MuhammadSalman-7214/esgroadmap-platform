"use client";
import React from "react";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";

type HeaderProps = {
	globalFilterValue: string;
	onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onDownloadOptionSelect: (option: "csv" | "excel") => void;
	onFilterOptionSelect: (option: "save" | "apply") => void;
};

function Header({
	globalFilterValue,
	onGlobalFilterChange,
	onDownloadOptionSelect,
	onFilterOptionSelect,
}: HeaderProps) {
	const downloadItems = [
		{
			label: 'CSV',
			icon: 'pi pi-file',
			command: () => onDownloadOptionSelect("csv")
		},
		{
			label: 'Excel',
			icon: 'pi pi-file-excel',
			command: () => onDownloadOptionSelect("excel")
		}
	];

	const filterItems = [
		{
			label: 'Apply Saved Filter',
			icon: 'pi pi-filter-fill',
			command: () => onFilterOptionSelect("apply")
		},
		{
			label: 'Save Filter',
			icon: 'pi pi-save',
			command: () => onFilterOptionSelect("save")
		}
	];

	return (
		<div className="flex flex-col sm:flex-row sm:justify-between gap-2">
			<div className="flex items-center gap-2">
				<SplitButton
					icon="pi pi-download"
					model={downloadItems}
					className="p-button-outlined p-button-secondary p-button-icon-only"
					size="small"
					onClick={() => onDownloadOptionSelect("csv")}
				/>

				<SplitButton
					icon="pi pi-filter"
					model={filterItems}
					className="p-button-outlined p-button-secondary p-button-icon-only"
					size="small"
					onClick={() => onFilterOptionSelect("apply")}
				/>
			</div>

			<div className="search-container w-full sm:w-auto">
				<i className="pi pi-search search-icon" />
				<input
					type="text"
					value={globalFilterValue}
					onChange={onGlobalFilterChange}
					placeholder="Keyword search"
					className="modern-search w-full sm:w-[250px]"
				/>
			</div>
		</div>
	);
}

export default Header;
