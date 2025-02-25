"use client";
import { TableRow } from "@/components/ui/table";
import { redirect, useRouter } from "next/navigation";
import React from "react";

const TicketRow: React.FC<{ id: number; children: React.ReactNode }> = ({
	id,
	children,
}) => {
	const router = useRouter();
	return (
		<TableRow
			key={id}
			className="cursor-pointer"
			onClick={() => {
				router.push(`/dashboard/tickets/details/${id}`);
			}}
		>
			{children}
		</TableRow>
	);
};

export default TicketRow;
