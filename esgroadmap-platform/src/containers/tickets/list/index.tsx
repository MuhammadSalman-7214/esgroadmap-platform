import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { cn } from "@/lib/utils";
import TicketRow from "./ticket-row";
import ticket from "@/api/ticket";
import { getToken } from "@/functions/user";
import NewTicketButton from "./new-ticket-button";

const TicketList: React.FC<{ user: Omit<User, "password"> }> = async ({
	user,
}) => {
	const isAdmin = user.role === "admin";
	const isUser = user.role === "user";
	const token = await getToken();
	const tickets = await ticket.list({ accessToken: token });

	return (
		<div className="px-10 pt-[5vh] w-[100%] overflow-x-hidden space-y-4">
			<div className="flex flex-col md:flex-row items-center justify-between">
				<h1 className="text-[24px] md:text-[32px] gap-3 md:gap-0 text-center md:text-left  text-[#219E99] font-bold">
					{isUser ? "Your " : ""} Support Tickets
				</h1>
				{isUser && <NewTicketButton />}
			</div>

			<Table>
				<TableHeader className="hover:bg-[#219E99]">
					<TableRow className="bg-[#219E99] hover:bg-[#219E99]">
						<TableHead className="w-[100px] text-white">S.NO</TableHead>
						<TableHead className="text-white">Title</TableHead>
						{isAdmin && <TableHead className="text-white">Posted By</TableHead>}
						<TableHead className="text-center text-white">Status</TableHead>
						<TableHead className="text-center text-white">Created At</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tickets.length === 0 && (
						<TableRow>
							<TableCell
								className="text-center align-middle"
								rowSpan={4}
								colSpan={4}
							>
								{isAdmin ? "No Tickets" : "You have't raised any tickets"}
							</TableCell>
						</TableRow>
					)}

					{tickets.length > 0 &&
						tickets.map((ticket, idx) => {
							return (
								<TicketRow key={ticket.id} id={ticket.id}>
									<TableCell className="font-medium">#{idx + 1}</TableCell>
									<TableCell>{ticket.title}</TableCell>
									{isAdmin && (
										<TableCell className="text-white">
											{ticket.postedBy.username}
										</TableCell>
									)}
									<TableCell className="text-center">
										<div
											className={cn(
												"text-[12px] font-semibold mx-auto text-white px-2 py-1 w-[80px] rounded-md",
												{
													"text-[#28A745] bg-[#28a74640]":
														ticket.status === "Resolved",
													"text-[#007BFF] bg-[#007bff40]":
														ticket.status === "Open",
													"text-[#FFA500] bg-[#FFA50040]":
														ticket.status === "In Progress",
												}
											)}
										>
											{ticket.status}
										</div>
									</TableCell>
									<TableCell className="text-center">
										{new Date(ticket.createdAt).toDateString()}
									</TableCell>
								</TicketRow>
							);
						})}
				</TableBody>
			</Table>
		</div>
	);
};

export default TicketList;
