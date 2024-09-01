"use client";

import Link from "next/link";

const SelectButton = ({ level }: { level: number }) => {
	return (
		<div className="w-[100%] cursor-pointer bg-[#EFEFEF] text-center py-2 px-3 font-semibold border-[1px] border-[#D6D6D6] rounded-md">
			<Link
				href={`/auth/membership-account/membership-checkout?level=${level}`}
				className="text-black"
			>
				Select
			</Link>
		</div>
	);
};

export default SelectButton;
