"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";

const AuthHeader = () => {
	const pathname = usePathname();

	return (
		<>
			<Navbar />
			<div className="w-100 h-[12rem] bg-[#E5ECED] flex items-center justify-center">
				<h2 className="text-[#219E99] text-[32px] font-semibold">
					{pathname
						.split("/")
						.at(-1)
						?.split("-")
						.map((i) => i.charAt(0).toUpperCase() + i.slice(1))
						.join(" ")}
				</h2>
			</div>
		</>
	);
};

export default AuthHeader;