"use client";
// import DataTable from "@/components/data-table";
import React from "react";
import useTargetTable from "@/hooks/use-target-table";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("@/components/data-table"), {
	ssr: false,
});

type Props<TRow extends object> = {
	tableName: string;
	data: TRow[];
	filterTitle?: string;
};

function TargetTable<TRow extends object>({ tableName, data, filterTitle }: Props<TRow>) {
	const {
		columns,
		selectedTargetSentence: targetSentence,
		setShowTargetModal,
		showTargetModel,
		filters,
	} = useTargetTable(data);
	return (
		<div className="w-full h-full flex flex-col px-3 py-1">
			<DataTable
				tableName={tableName}
				data={data}
				columns={columns}
				filters={filters}
				filterTitle={filterTitle}
			/>
			<Dialog
				header="Target Sentence"
				visible={showTargetModel}
				style={{ width: "50vw" }}
				onHide={() => {
					if (!showTargetModel) return;
					setShowTargetModal(false);
				}}
			>
				<p className="m-0">{targetSentence}</p>
			</Dialog>
		</div>
	);
}

export default TargetTable;
