import MembershipAccount from "@/containers/membership-account";
import React, { Suspense } from "react";

const page = () => (
	<Suspense>
		<MembershipAccount />
	</Suspense>
);

export default page;
