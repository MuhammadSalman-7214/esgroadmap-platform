import { SupportTicket } from "@/api/ticket";
import { cn } from "@/lib/utils";
import convertBytes from "@/utils/convert-bytes";
import {
	DownloadIcon,
	User2Icon,
	UserCircleIcon,
	UserIcon,
} from "lucide-react";
import React from "react";
import DownloadAttachment from "./download-attachment";
import Image from "next/image";
import AddComment from "./add-comment";
import { currentUser } from "@/functions/user";
import CommentList from "./comment-list";

const TicketDetails: React.FC<{ ticket: SupportTicket }> = async ({
	ticket,
}) => {
	const userData = await currentUser();
	return (
		<div className="px-10 pt-[5vh] w-[100%] overflow-x-hidden space-y-5 pb-5">
			<h1 className="text-[32px] text-[#219E99] font-bold">
				Support Ticket #{ticket.id}
			</h1>

			<div className="w-[100%] bg-stone-100 shadow-2xl py-6 px-5 rounded-md space-y-3">
				<div className="flex flex-row items-start gap-2 px-3">
					<h3 className="text-[18px] text-black font-semibold">
						{ticket.title.at(0)?.toUpperCase() + ticket.title.slice(1)}
					</h3>
					<div
						className={cn(
							"text-[12px] font-semibold text-center px-2 py-1 w-[80px] rounded-md",
							{
								"text-[#28A745] bg-[#28a74640]": ticket.status === "Resolved",
								"text-[#007BFF] bg-[#007bff40]": ticket.status === "Open",
								"text-[#FFA500] bg-[#FFA50040]":
									ticket.status === "In Progress",
							}
						)}
					>
						{ticket.status}
					</div>
				</div>

				<hr className="bg-stone-400 w-[100%] h-[2px]" />

				<div className="py-3 px-2">
					<div className="flex flex-row gap-2 items-center">
						<UserCircleIcon size={35} color="#2c2c2c" />
						<div className="flex flex-col">
							<p className="text-[16px] text-black">
								{ticket.postedBy.username}
							</p>
							<p className="text-[12px] text-black">
								{new Date(ticket.createdAt).toDateString()}
							</p>
						</div>
					</div>
					<div className="pl-10">
						<p className="my-5 whitespace-pre-wrap">{ticket.description}</p>

						<div className="flex flex-col gap-3">
							<span className="text-stone-600 text-[14px]">
								{ticket.documents.length} Attachments
							</span>

							{ticket.documents.map((doc) => {
								return (
									<div
										className="bg-[#f4f9ff] border-[#d1e3ff] border-2 p-3 rounded-md border-solid max-w-[300px] flex flex-row items-center py-3"
										key={doc.id}
									>
										<Image
											src={doc.url}
											alt={doc.name}
											width={60}
											height={60}
										/>

										<div className="flex-1 ml-4 space-y-1">
											<p className="text-[13px]">{doc.name}</p>
											<p className="text-[13px] text-stone-600">
												{convertBytes(doc.size)}
											</p>
										</div>

										<DownloadAttachment doc={doc} />
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<hr className="bg-stone-400 w-[100%] h-[2px]" />

				<AddComment id={ticket.id} currentUser={userData.user} />

				<hr className="bg-stone-400 w-[100%] h-[2px]" />

				<CommentList id={ticket.id} />
			</div>
		</div>
	);
};

export default TicketDetails;
