import React, { useCallback, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import {
	DataTableFilterMetaData,
	DataTable as PRDataTable,
} from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { toast } from "react-toastify";
import portfolio, { Portfolio } from "@/api/portfolio";
import { ProgressSpinner } from "primereact/progressspinner";
import { ThreeDots } from "react-loader-spinner";
import Colors from "@/styles/colors";

type Props = {
	tableName: string;
	show: boolean;
	onClose: () => void;
	applyFilter: (filters: Record<string, DataTableFilterMetaData>) => void;
};

type Option = {
	label: string;
	value: number;
};

const ApplyFilterDialog: React.FC<Props> = ({
	onClose,
	show,
	tableName,
	applyFilter,
}) => {
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, DataTableFilterMetaData>
	>({});
	const [filters, setFilters] = useState<Portfolio[]>([]);
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState<Array<Option>>([]);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);

	const onApply = async () => {
		applyFilter(selectedFilters);
		setSelectedOption(null);
		setSelectedFilters({});
		onClose();
	};

	const init = useCallback(async () => {
		try {
			setLoading(true);
			const data = await portfolio.list({ tableName });
			setFilters(data);
			setOptions(data.map((i) => ({ label: i.name, value: i.id })));
			setLoading(false);
		} catch (error) {
			toast.error((error as Error).message);
			setLoading(false);
		}
	}, [tableName]);

	useEffect(() => {
		init();
	}, [init, show]);

	return (
		<Dialog
			header={
				<>
					Apply Filters For Target :{" "}
					<span className="text-[#219E99]">
						{tableName
							.split("_")
							.map((i) => i.at(0)?.toUpperCase() + i.slice(1))
							.join(" ")}
					</span>
				</>
			}
			breakpoints={{ "960px": "75vw", "641px": "90vw" }}
			visible={show}
			style={{ width: "50vw" }}
			onHide={() => {
				if (!show) return;
				onClose();
			}}
		>
			{loading && (
				<div className="w-[100%] h-[100%] flex items-center justify-center">
					<ThreeDots
						visible={true}
						height="50"
						width="50"
						color={Colors.secondary}
						radius="9"
						ariaLabel="three-dots-loading"
						wrapperStyle={{}}
						wrapperClass=""
					/>
				</div>
			)}
			{!loading && (
				<>
					{" "}
					<div className="mb-5 space-y-2">
						<p>Select the filter from the dropdown</p>
						<Dropdown
							value={selectedOption}
							options={options}
							className="w-[100%] flex-1 md:flex-0"
							placeholder="Select Filter"
							onChange={async (e) => {
								console.log("Selected Filter option:", e.value);
								const filterFound = filters.find((f) => f.id === e.value);
								if (!filterFound) return;
								setSelectedFilters(filterFound.filters as any);
								setSelectedOption(e.value);
							}}
						/>
					</div>
					<PRDataTable
						value={Object.keys(selectedFilters)
							.filter(
								(key) =>
									selectedFilters[key as keyof typeof selectedFilters].value
							)
							.map((filterName, index) => {
								const data = selectedFilters[
									filterName as keyof typeof selectedFilters
								].value as any;
								let value = "";

								if (Array.isArray(data)) {
									value = data.join(", ");
								} else if (typeof data === "string") {
									value = data;
								}
								return { filterName, value };
							})}
						showGridlines
					>
						<Column
							field="filterName"
							header={"Filter Columns"}
							style={{ width: "50%" }}
						/>
						<Column field="value" header={"Value"} style={{ width: "50%" }} />
					</PRDataTable>
					<div className="mt-4 flex flex-row items-center gap-3 ml-auto w-fit">
						<Button label="Close" outlined onClick={() => onClose()} />
						<Button
							label="Apply"
							loading={loading}
							disabled={loading}
							onClick={() => onApply()}
						/>
					</div>
				</>
			)}
		</Dialog>
	);
};

export default ApplyFilterDialog;
