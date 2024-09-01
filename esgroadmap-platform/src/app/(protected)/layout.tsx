"use server";
import React from "react";
import dynamic from "next/dynamic";
import { currentUser } from "@/functions/user";
import NextTopLoader from "nextjs-toploader";

const Sidebar = dynamic(() => import("@/components/sidebar"), { ssr: false });

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
	const { user } = await currentUser();
	return (
		<div className="flex flex-row overflow-hidden relative">
			<div className="w-[100%] max-w-[100vw] max-h-[100dvh] flex flex-row overflow-hidden">
				<div className="min-h-[100dvh] h-[100%] bg-[#f5f5f5]">
					<Sidebar user={user} />
				</div>
				<div className="overflow-x-hidden w-[100%]">{children}</div>
			</div>{" "}
			<NextTopLoader color="#219e98" showSpinner={false} />
		</div>
	);
};

export default ProtectedLayout;
