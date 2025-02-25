import AuthHeader from "@/components/auth-header";
import Footer from "@/components/footer";
import React from "react";


const PublicLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="overflow-x-hidden">
			<AuthHeader />
			{children}
			<Footer />
		</div>
	);
};

export default PublicLayout;
