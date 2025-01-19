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
	onClearFilters: () => void;
};

type FilterTagProps = {
	filterKey: string;
	value: any;
};

const FilterTag = ({ filterKey, value }: FilterTagProps) => {
	const op = useRef<OverlayPanel>(null);
	const MAX_CHARS = 35; // Maximum characters before truncating

	const showFilterDetails = (e: React.MouseEvent) => {
		// Show overlay if value is truncated (array with more items or string exceeding max length)
		// or if it's a single value that might need more context
		const shouldShowOverlay = Array.isArray(value) ? 
			value.length >= 1 :  // Changed from > 1 to >= 1 to show overlay for single items too
			String(value).length > MAX_CHARS;
			
		if (shouldShowOverlay) {
			op.current?.show(e, e.currentTarget);
		}
	};

	const formatValue = (value: any) => {
		if (Array.isArray(value)) {
			const firstItem = value[0];
			if (value.length === 1) return firstItem;
			return `${firstItem} (+${value.length - 1})`;
		}
		
		const stringValue = String(value);
		if (stringValue.length <= MAX_CHARS) return stringValue;
		return `${stringValue.slice(0, MAX_CHARS)}... (+1)`;
	};

	return (
		<React.Fragment>
			<span 
				className="filter-tag whitespace-nowrap cursor-help"
				onMouseEnter={showFilterDetails}
			>
				{filterKey}: {formatValue(value)}
			</span>
			<OverlayPanel ref={op} className="w-80">
				<div className="p-2">
					<h3 className="text-sm font-semibold mb-2">{filterKey}</h3>
					<div className="flex flex-col gap-1">
						{Array.isArray(value) ? (
							value.map((item, index) => (
								<div key={index} className="text-sm text-gray-600">
									{item}
								</div>
							))
						) : (
							<div className="text-sm text-gray-600">
								{value}
							</div>
						)}
					</div>
				</div>
			</OverlayPanel>
		</React.Fragment>
	);
};

const Header = ({
	globalFilterValue,
	onGlobalFilterChange,
	onDownloadOptionSelect,
	onFilterOptionSelect,
	filterTitle,
	activeFilters,
	onClearFilters,
}: HeaderProps) => {
	const op = useRef<OverlayPanel>(null);
	const [visibleFilters, setVisibleFilters] = useState<[string, any][]>([]);
	const [remainingFilters, setRemainingFilters] = useState<[string, any][]>([]);
	const containerRef = useRef<HTMLDivElement>(null);
	const filtersContainerRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLSpanElement>(null);

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
		const calculateVisibleFilters = () => {
			const containerWidth = containerRef.current?.offsetWidth ?? 0;
			
			// Add more thorough checks
			if (containerWidth === 0 || !containerRef.current) {
				console.warn('Container not properly mounted');
				return;
			}

			// Filter out entries with empty values
			const filterEntries = Object.entries(activeFilters).filter(([_, value]) => {
				if (Array.isArray(value)) {
					return value.length > 0;
				}
				return value !== null && value !== undefined && value !== '';
			});

			if (filterEntries.length === 0) {
				setVisibleFilters([]);
				setRemainingFilters([]);
				return;
			}

			// Calculate available width accounting for padding
			const containerStyles = window.getComputedStyle(containerRef.current);
			const containerPadding = parseInt(containerStyles.paddingLeft) + parseInt(containerStyles.paddingRight);
			let availableWidth = containerWidth - containerPadding;

			// Account for title if present
			const titleWidth = titleRef.current?.offsetWidth ?? 0;
			if (titleWidth > 0) {
				availableWidth -= titleWidth + 16; // Only subtract padding when there's a title
			}

			let tempDiv: HTMLDivElement | null = null;
			try {
				// Create temporary elements to measure filter tags
				tempDiv = document.createElement('div');
				tempDiv.style.visibility = 'hidden';
				tempDiv.style.position = 'absolute';
				tempDiv.className = 'filter-tag whitespace-nowrap';

				// Copy styles from existing filter tag if available
				const firstChild = filtersContainerRef.current?.firstChild as HTMLElement;
				if (firstChild) {
					const styles = window.getComputedStyle(firstChild);
					tempDiv.style.padding = styles.padding;
					tempDiv.style.margin = styles.margin;
				}

				document.body.appendChild(tempDiv);

				let visibleCount = 0;
				let currentWidth = 0;

				for (const [key, value] of filterEntries) {
					tempDiv.textContent = `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
					const elementWidth = tempDiv.offsetWidth + 8; // 8px for margin

					if (currentWidth + elementWidth > availableWidth) {
						break;
					}

					currentWidth += elementWidth;
					visibleCount++;
				}

				setVisibleFilters(filterEntries.slice(0, visibleCount));
				setRemainingFilters(filterEntries.slice(visibleCount));
			} finally {
				// Make sure we always clean up
				if (tempDiv?.parentNode) {
					document.body.removeChild(tempDiv);
				}
			}
		};

		let timeout: NodeJS.Timeout;
		
		const debouncedCalculate = () => {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(calculateVisibleFilters, 100);
		};

		// Initial calculation
		debouncedCalculate();

		// Add resize observer
		const resizeObserver = new ResizeObserver(debouncedCalculate);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			if (timeout) clearTimeout(timeout);
			resizeObserver.disconnect();
		};
	}, [activeFilters, filterTitle]);

	return (
		<div className="flex items-center justify-between gap-4">
			{/* Child 1: Download and Filter buttons */}
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

			{/* Child 2: Active filters */}
			<div ref={containerRef} className="flex-1 flex items-center min-w-0">
				<div className="flex items-center gap-2 overflow-hidden w-full min-w-[100px]">
					{filterTitle && (
						<span ref={titleRef} className="filter-title whitespace-nowrap">
							{filterTitle}
						</span>
					)}
					<div ref={filtersContainerRef} className="flex items-center gap-2 overflow-hidden flex-wrap">
						{visibleFilters.map(([key, value]) => (
							<FilterTag key={key} filterKey={key} value={value} />
						))}
					</div>
				</div>
			</div>

			{/* Child 3: More filters button and Search */}
			<div className="flex items-center gap-4 flex-shrink-0">
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
								<div className="flex justify-between items-center mb-2">
									<h3 className="text-sm font-semibold">Active Filters</h3>
									<button
										onClick={() => {
											onClearFilters();
											op.current?.hide();
										}}
										className="text-xs text-red-600 hover:text-red-700 font-medium"
									>
										Clear All
									</button>
								</div>
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
				
				<div className="search-container flex-shrink-0">
					<i className="pi pi-search search-icon" />
					<input
						type="text"
						value={globalFilterValue}
						onChange={onGlobalFilterChange}
						placeholder="Keyword search"
						className="modern-search w-[250px]"
					/>
				</div>
			</div>
		</div>
	);
};

export default Header;
