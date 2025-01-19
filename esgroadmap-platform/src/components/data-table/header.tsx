"use client";
import React, { useRef, useEffect, useState } from "react";
import { SplitButton } from "primereact/splitbutton";
import { OverlayPanel } from 'primereact/overlaypanel';

type HeaderProps = {
	globalFilterValue: string;
	onGlobalFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onDownloadOptionSelect: (option: string) => void;
	onFilterOptionSelect: (option: string) => void;
	filterTitle?: string;
	activeFilters: Record<string, any>;
};

const Header = ({
	globalFilterValue,
	onGlobalFilterChange,
	onDownloadOptionSelect,
	onFilterOptionSelect,
	filterTitle,
	activeFilters,
}: HeaderProps) => {
	const op = useRef<OverlayPanel>(null);
	const [visibleFilters, setVisibleFilters] = useState<[string, any][]>([]);
	const [remainingFilters, setRemainingFilters] = useState<[string, any][]>([]);
	const MAX_VISIBLE_WIDTH = 600; // Increased from 400
	const CHAR_WIDTH = 7; // Slightly reduced character width estimate for more accurate calculations
	const PADDING = 24; // Adjusted padding
	
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

	useEffect(() => {
		const filterEntries = Object.entries(activeFilters);
		let currentWidth = 0;
		let visibleCount = 0;

		// More precise width calculation
		for (let i = 0; i < filterEntries.length; i++) {
			const [key, value] = filterEntries[i];
			const valueStr = Array.isArray(value) ? value.join(', ') : String(value);
			// Add colon and space to the calculation
			const textLength = key.length + 2 + valueStr.length;
			currentWidth += textLength * CHAR_WIDTH + PADDING;

			if (currentWidth > MAX_VISIBLE_WIDTH) {
				break;
			}
			visibleCount++;
		}

		setVisibleFilters(filterEntries.slice(0, visibleCount));
		setRemainingFilters(filterEntries.slice(visibleCount));
	}, [activeFilters]);

	return (
		<div className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-start sm:items-center justify-between p-2">
			<div className="flex items-center gap-4 flex-1 min-w-0">
				<div className="flex items-center gap-2 flex-shrink-0">
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

				{(filterTitle || Object.keys(activeFilters).length > 0) && (
					<div className="flex items-center gap-2 overflow-hidden">
						{filterTitle && (
							<span className="filter-title">
								{filterTitle}
							</span>
						)}
						<div className="flex items-center gap-2 overflow-hidden">
							{visibleFilters.map(([key, value]) => (
								<span key={key} className="filter-tag">
									{key}: {Array.isArray(value) ? value.join(', ') : value}
								</span>
							))}
							{remainingFilters.length > 0 && (
								<>
									<button
										onClick={(e) => op.current?.toggle(e)}
										className="text-[#0B6E5D] hover:text-[#085446] text-xs font-medium whitespace-nowrap"
									>
										+{remainingFilters.length} more
									</button>
									<OverlayPanel ref={op} className="w-80">
										<div className="p-2">
											<h3 className="text-sm font-semibold mb-2">Active Filters</h3>
											<div className="flex flex-col gap-1">
												{[...visibleFilters, ...remainingFilters].map(([key, value]) => (
													<div key={key} className="text-sm">
														<span className="font-medium">{key}:</span>{' '}
														<span className="text-gray-600">
															{Array.isArray(value) ? value.join(', ') : value}
														</span>
													</div>
												))}
											</div>
										</div>
									</OverlayPanel>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="search-container w-full sm:w-auto flex-shrink-0">
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
};

export default Header;
