import React from "react";
import { CircleCheckIcon, Smile } from "lucide-react";
import SignupButton from "./signup-button";

const icons = {
	tick: CircleCheckIcon,
	smily: Smile,
};

type TierFeature = { id: number; title: string; icon: "tick" | "smily" };

type Tier = {
	id: number;
	name: string;
	price: number;
	features: Array<TierFeature>;
	level: number;
};

const tiers = [
	{
		id: 1,
		name: "Free account - Access to Carbon Goals",
		price: 0,
		features: [
			{ id: 1, title: "Company universe : Full", icon: "tick" },
			{ id: 2, title: "Carbon target tracker", icon: "tick" },
			{ id: 3, title: "Online FAQ", icon: "tick" },
			{ id: 4, title: "Personal use", icon: "tick" },
		],
		level: 1,
	},

	{
		id: 2,
		name: "Comprehensive account - Launch offer, including 1 month free trial !",
		price: 20,
		features: [
			{
				id: 1,
				title:
					"Ordinarily $25 per month. Launch offer currently in place as we build out ESG Roadmap !",
				icon: "smily",
			},
			{
				id: 2,
				title:
					"1 month free trial - so a no-risk option to try out all our tools",
				icon: "smily",
			},
			{ id: 3, title: "Company universe : Full", icon: "tick" },
			{ id: 4, title: "Carbon target tracker", icon: "tick" },
			{ id: 5, title: "Renewable energy target tracker", icon: "tick" },
			{ id: 6, title: "Gender target tracker", icon: "tick" },
			{ id: 7, title: "Water management target tracker", icon: "tick" },
			{ id: 8, title: "Waste management target tracker", icon: "tick" },
			{ id: 9, title: "Online FAQ", icon: "tick" },
			{ id: 10, title: "Customer support", icon: "tick" },
			{
				id: 10,
				title: "Personal use, Commercial use, Research use",
				icon: "tick",
			},
		],
		level: 2,
	},
] as Array<Tier>;

const Signup = () => {
	return (
		<div>
			<div className="w-[100vw] flex flex-col gap-4 px-[10%] my-10 lg:flex-row">
				{tiers.map((tier) => {
					return (
						<div key={tier.id} className="flex flex-col items-center flex-1">
							<h2 className="text-[24px] text-center text-white font-semibold bg-[#219E99] w-[100%] px-10 py-3">
								{tier.name}
							</h2>

							<div className="my-10 flex flex-col items-center">
								<div className="flex flex-row">
									<span className="text-[1.5rem] font-semibold text-[#219E99]">
										$
									</span>
									<h3 className="text-[4rem] font-bold text-[#219E99]">
										{tier.price}
									</h3>
									<span className="text-[1.5rem] font-semibold text-[#219E99]">
										00
									</span>
								</div>
								<p className="text-[#575555] text-[16px] font-normal">
									Monthly
								</p>
							</div>

							<div className="flex flex-col w-[100%] items-center px-5">
								{tier.features.map((feature) => {
									const Icon = icons[feature.icon];
									return (
										<div
											key={feature.id}
											className="flex items-center gap-1 justify-center py-4 w-[100%] [&:not(:last-child)]:border-b-2 border-slate-300"
										>
											<Icon size={20} color="#000000" />
											<p className="text-[14px] max-w-[75%] text-center font-normal">
												{feature.title}
											</p>
										</div>
									);
								})}
							</div>

							<SignupButton level={tier.level} />
						</div>  
					);
				})}
			</div>
		</div>
	);
};

export default Signup;
