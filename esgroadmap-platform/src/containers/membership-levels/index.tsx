import React from "react";
import SelectButton from "./select-button";
import plans from "@/constants/plans";

const MembershipLevels = () => {
	return (
		<div className="w-100 py-5 grid place-items-center">
			<div className="max-w-[1120px] w-[100%] grid grid-cols-3 grid-rows-4 items-center">
				<p className="font-semibold">Level</p>
				<p className="font-semibold">Price</p>
				<div />

				{plans.map((plan) => {
					return (
						<>
							<p className="font-semibold">{plan.title}</p>
							<p className="font-semibold">{plan.price[0]}</p>
							<SelectButton level={plan.level} />
						</>
					);
				})}
			</div>
		</div>
	);
};

export default MembershipLevels;
