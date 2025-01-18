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
			label: 'Save Filter',
			icon: 'pi pi-save',
			command: () => onFilterOptionSelect("save")
		},
		{
			label: 'Apply Saved Filter',
			icon: 'pi pi-filter-fill',
			command: () => onFilterOptionSelect("apply")
		}
	];

	return (
		<div className="flex justify-between items-center gap-2">
			<div className="flex items-center gap-2">
				<SplitButton
					icon="pi pi-download"
					model={downloadItems}
					className="p-button-outlined p-button-secondary p-button-icon-only"
					size="small"
				/>

				<SplitButton
					icon="pi pi-filter"
					model={filterItems}
					className="p-button-outlined p-button-secondary p-button-icon-only"
					size="small"
				/>
			</div>

			<div className="search-container">
				<i className="pi pi-search search-icon" />
				<input
					type="text"
					value={globalFilterValue}
					onChange={onGlobalFilterChange}
					placeholder="Keyword search"
					className="modern-search"
				/>
			</div>
		</div>
	);
}

export default Header;
