/* eslint-disable @next/next/no-img-element */
import { currentUser } from "@/functions/user";
import { UserIcon } from "lucide-react";
import Image from "next/image";

const dashboardItems = [
	{
		id: 1,
		title: "Basic Account Tools",
		items: [
			{
				id: 1,
				title: "Carbon Reduction Targets",
				buttonText: "Use Tool",
				link: "",
				image:
					"https://esgroadmap.com/wp-content/uploads/2021/12/co2-carbon-dioxide-carbon-3139230.jpg",
			},
		],
	},
	{
		id: 2,
		title: "Comprehensive Account Tools",
		items: [
			{
				id: 1,
				title: "All company targets",
				buttonText: "Use Tool",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2023/03/office.jpg",
			},
			{
				id: 2,
				title: "Waste & Recycling targets",
				buttonText: "Use Tool",
				link: "",
				image:
					"https://esgroadmap.com/wp-content/uploads/2023/07/recycling.jpg",
			},
			{
				id: 3,
				title: "Water management targets",
				buttonText: "Use Tool",
				link: "",
				image:
					"https://esgroadmap.com/wp-content/uploads/2022/09/watermanagement.png",
			},
			{
				id: 4,
				title: "Supply Chain targets",
				buttonText: "Use Tool",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2022/09/supplychain.jpg"
			},
			{
				id: 5,
				title: "Gender diversity targets",
				buttonText: "Use Tool",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2023/03/genderequality.jpg"
			},
			{
				id: 6,
				title: "Renewables targets",
				buttonText: "Use Tool",
				link : "",
				image: "https://esgroadmap.com/wp-content/uploads/2023/03/renewables.jpg"
			},
		],
	},
	{
		id: 3,
		title: "Member Information",
		items: [
			{
				id: 1,
				title: "Faqs",
				buttonText: "View",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2022/04/reporter-journalist-news-6819472.jpg",
			},
			{
				id: 2,
				title: "Feedback Form",
				buttonText: "View",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2023/08/Feedback_Icon.png"
			}
		]
	},
	{
		id: 4,
		title: "My Account Details",
		items: [
			{
				id: 1,
				title: "My Account",
				buttonText: "My Account",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2022/12/501-5010656_my-account-comments-my-account-icon-vector.jpg",
			},
			{
				id: 2,
				title: "Your support tickets",
				buttonText: "All Tickets",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2022/12/download-1.png"
			},
			{
				id: 3,
				title: "Submit Support ticket",
				buttonText: "Submit Ticket",
				link: "",
				image: "https://esgroadmap.com/wp-content/uploads/2022/12/download-1.png"
			}
		]
	}
];

const Page = async () => {
	const { user } = await currentUser();

	const hasComprehensiveAccount = user.plan === 2;

	return (
		<div>
			<header className="flex w-[100%] items-center py-[30px]">
				<p className="text-center self-center flex-[1] md:flex-[0.85] text-[28px] md:text-[32px]">
					Welcome to{" "}
					<span className="text-[#219e98] font-semibold">
						Esgroadmap User Portal
					</span>
				</p>
				<div className="flex-[0.15] md:flex hidden gap-2 items-center">
					<UserIcon />
					<p className="text-center align-bottom text-[17px]">
						{user.username}
					</p>
				</div>
			</header>

			<main className="px-6 mb-5">
				{dashboardItems.map((section) => {
					return (
						<div key={section.id}>
							<h3 className="font-semibold text-[18px] pb-3">
								{section.title}
							</h3>
							<div className="flex flex-row flex-wrap gap-4 items-center justify-start">
								{section.items.map((tool) => {
									return (
										<div
											key={`${section.title}-${tool.id}`}
											className="rounded-md aspect-video min-w-[200px] w-[100%] max-w-[250px] mb-4 py-2 relative cursor-pointer"
										>
											<div className="bg-stone-700/70 rounded-md z-10 w-[100%] h-[100%] absolute top-0 left-0" />
											<img
												className="rounded-md absolute top-0 left-0 h-[100%] w-[100%]"
												src={tool.image}
												alt={tool.title}
											/>
											<div className="absolute top-0 z-30 left-0 w-[100%] h-[100%]">
												<div className="py-4 w-[100%] h-[100%] flex flex-col items-center justify-between">
													<p className="text-white font-semibold text-[16px] w-[80%] text-center">
														{tool.title}
													</p>
													<button className="bg-[#000000] px-5 font-semibold py-2 hover:bg-stone-700/85 rounded-md text-white text-[12px]">
														{tool.buttonText}
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</main>
		</div>
	);
};

export default Page;
