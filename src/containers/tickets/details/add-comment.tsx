"use client";
import ticket from "@/api/ticket";
import QuillEditor from "@/utils/_Quill";
import { User } from "@prisma/client";
import { UserCircleIcon } from "lucide-react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const modules = {
	toolbar: [
		[{ header: [1, 2, 3, false] }],
		["bold", "italic", "underline"],
		[{ list: "ordered" }, { list: "bullet" }],
		["clean"],
	],
};
const AddComment: React.FC<{
	currentUser: Omit<User, "password">;
	id: number;
}> = (props) => {
	const [comment, setComment] = useState({ value: "", error: "" });
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const handleSubmit = async () => {
		try {
			setLoading(true);
			const text = (comment.value =
				(comment.value as any)?.ops && (comment.value as any)?.ops?.length > 0
					? (comment.value as any)?.ops[0].insert
					: "");
			if (text === "") {
				setComment((prev) => ({ ...prev, error: "Comment cannot be empty" }));
				setLoading(false);
				return;
			}
			await ticket.addComment(props.id, text);
			router.refresh();
			setComment({ value: "", error: "" });
			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error((error as Error)?.message);
		}
	};

	return (
		<div className="w-100 space-y-4 px-3">
			<div className="flex flex-row gap-2 items-center">
				<UserCircleIcon size={35} color="#2c2c2c" />
				<div className="flex flex-col">
					<p className="text-[16px] text-black">{props.currentUser.username}</p>
				</div>
			</div>
			<p className="font-semibold text-[16px] text-[#000000]">
				Add Your Comment
			</p>
			<div className="w-100 flex items-center gap-1">
				<QuillEditor
					placeholder="Please describe your issue in detail..."
					modules={modules}
					value={comment.value as any}
					style={{ width: "100%" }}
					onChange={(a, delta, source, editor) => {
						const contents = editor.getContents();
						if (contents) {
							console.log(contents);
							setComment({ value: contents as any, error: "" });
						}
					}}
				/>
				<p className="text-[18px] text-[#000000]">*</p>
			</div>
			{comment.error && (
				<p className="text-red-500 text-[12px]">{comment.error}</p>
			)}

			<button
				className="w-fit py-2 px-5 rounded-sm text-[16px] text-white mb-5 disabled:opacity-60"
				style={{ background: "rgb(25, 56, 57)" }}
				disabled={loading}
				onClick={handleSubmit}
			>
				Reply
			</button>
		</div>
	);
};

export default AddComment;
