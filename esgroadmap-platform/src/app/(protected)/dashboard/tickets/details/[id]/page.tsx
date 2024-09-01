import ticket from "@/api/ticket";
import TicketDetails from "@/containers/tickets/details";
import { getToken } from "@/functions/user";
import React from "react";

const page: React.FC<{ params: { id: string } }> = async ({ params }) => {
	const token = await getToken();
	const ticketData = await ticket.getById(params.id, { accessToken: token });
	return <TicketDetails ticket={ticketData} />;
};

export default page;
