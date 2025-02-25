"use client";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import {
	DataTableFilterMeta,
	DataTableFilterMetaData,
	DataTable as PRDataTable,
} from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { toast } from "react-toastify";
import portfolio from "@/api/portfolio";

type Props = {
	tableName: string;
	show: boolean;
	onClose: () => void;
	filters: DataTableFilterMeta;
};

const SaveFilterDialog: React.FC<Props> = ({
	tableName,
	onClose,
	filters,
	show,
}) => {
	const [data, setData] = useState({
		name: { value: "", error: "" },
	});
	const [loading, setLoading] = useState(false);

	const setError = () => {
		setData((prev) => {
			return {
				...prev,
				name: { value: prev.name.value, error: "Name cannot be empty" },
			};
		});
	};

	const onSave = async () => {
		setLoading(true);
		if (data.name.value.trim() === "") {
			setLoading(false);
			return setError();
		}

		try {
			const message = await portfolio.save({
				name: data.name.value,
				filters,
				tableName,
			});
			toast.success(message);
			setLoading(false);
			onClose();
		} catch (error) {
			setLoading(false);
			toast.error((error as Error).message);
		}
	};

	return (
		<Dialog
			header={
				<>
					Save Filters For Target :{" "}
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
			<div className="w-100 space-y-2 mb-5">
				<p className="font-semibold text-[16px] text-[#000000]">Filter Name</p>
				<div className="w-100 flex items-center gap-1">
					<input
						type="text"
						value={data.name.value}
						onChange={(e) =>
							setData({ name: { value: e.target.value, error: "" } })
						}
						className="w-[60%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
					/>
				</div>
				{data.name.error && (
					<p className="text-red-500 text-[12px]">{data.name.error}</p>
				)}
			</div>

			<PRDataTable
				value={Object.keys(filters)
					.filter((key) =>
						"value" in filters[key]
							? (filters[key] as DataTableFilterMetaData)?.value
							: false
					)
					.map((filterName, index) => {
						const data = (filters[filterName] as DataTableFilterMetaData).value;
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
					label="Save"
					loading={loading}
					disabled={loading}
					onClick={() => onSave()}
				/>
			</div>
		</Dialog>
	);
};

export default SaveFilterDialog;
