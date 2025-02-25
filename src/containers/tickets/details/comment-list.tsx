import ticket from "@/api/ticket";
import { getToken } from "@/functions/user";
import { UserCircleIcon } from "lucide-react";
import React from "react";

const CommentList: React.FC<{ id: number }> = async ({ id }) => {
	const accessToken = await getToken();
	const comments = await ticket.listComments(id, { accessToken });
	return (
		<div className="flex flex-col gap-2 pb-2">
			{comments
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				)
				.map((c) => (
					<div key={c.id} className="py-3 px-2 border-b-2 border-stone-400">
						<div className="flex flex-row gap-2 items-center">
							<UserCircleIcon size={35} color="#2c2c2c" />
							<div className="flex flex-col">
								<p className="text-[16px] text-black">{c.postedBy.username}</p>
								<p className="text-[12px] text-black">
									{new Date(c.createdAt).toDateString()}
								</p>
							</div>
						</div>
						<p className="my-2 whitespace-pre-wrap">{c.text}</p>
					</div>
				))}
		</div>
	);
};

export default CommentList;
