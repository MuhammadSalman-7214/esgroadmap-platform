"use client";
import { SupportTicketDocument } from "@/api/ticket";
import { DownloadIcon } from "lucide-react";
import React from "react";

const DownloadAttachment: React.FC<{ doc: SupportTicketDocument & { id: number } }> = ({
	doc
}) => {
	return (
		<DownloadIcon
			color="#007bff"
			size={24}
			onClick={() => {
				const link = document.createElement("a");
				link.href = doc.url;
				link.download = doc.name;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}}
		/>
	);
};

export default DownloadAttachment;
