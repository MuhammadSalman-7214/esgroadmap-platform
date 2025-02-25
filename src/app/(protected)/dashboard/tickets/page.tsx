import TicketList from "@/containers/tickets/list";
import { currentUser } from "@/functions/user";

const Page = async () => {
	const { user } = await currentUser();

	return <TicketList user={user} />;
};

export default Page;
