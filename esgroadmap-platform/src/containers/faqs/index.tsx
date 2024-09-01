import React from "react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";

const faqs = [
	{
		id: 1,
		title: "Which companies are covered?",
		description: (
			<>
				The list of companies currently covered by ESGRoadmap tools can be
				accessed{" "}
				<a target="_blank" href="">
					here
				</a>
			</>
		),
	},
	// How do I export data?
	// You can export data to csv and excel using the top right button in the data table.
	// [screenshot]
	{
		id: 2,
		title: "How do I export data?",
		description: (
			<>
				You can export data to csv and excel using the top right button in the
				data table.
				<Image
					src={"/images/footer/logo.png"}
					alt="CSV download"
					objectFit="contain"
					width={200}
					height={100}
				/>
			</>
		),
	},
	{
		id: 3,
		title: "How can I contact you?",
		description: (
			<>
				<p className="mb-2">
					If you have a specific user query, you can raise a ticket{" "}
					<Link
						className="text-blue-600"
						href={"/dashboard/tickets/new"}
						target="_blank"
					>
						here
					</Link>
				</p>
				<p>
					For general feedback and suggestions, you can contact use [this
					contact form].
				</p>
			</>
		),
	},
	{
		id: 4,
		title: "How do you source your data?",
		description: (
			<>
				<p className="mb-2">
					All data is from primary sources, the companies themselves. We assess
					their reports (such as annual and sustainability reports) as well as
					press releases.
				</p>{" "}
				<p>
					To access the specific source of an ESG target you are interested in,
					go to the field [source] in the data table.
				</p>
			</>
		),
	},
];

const Faqs = () => {
	return (
		<div className="px-10 pt-[5vh] w-[100%] overflow-x-hidden">
			<h1 className="text-[32px] text-[#219E99] font-bold">
				Frequently Asked Questions
			</h1>
			<div className="flex flex-row gap-10 pt-10 w-[100%]">
				<Accordion type="multiple" className="flex-1 space-y-3">
					{faqs.slice(0, faqs.length / 2).map((faq) => {
						return (
							<AccordionItem value={faq.id.toString()} key={faq.id}>
								<AccordionTrigger>{faq.title}</AccordionTrigger>
								<AccordionContent>{faq.description} </AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
				<Accordion type="multiple" className="flex-1 space-y-3">
					{faqs.slice(faqs.length / 2).map((faq) => {
						return (
							<AccordionItem value={faq.id.toString()} key={faq.id}>
								<AccordionTrigger>{faq.title}</AccordionTrigger>
								<AccordionContent>{faq.description} </AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>
			</div>
		</div>
	);
};

export default Faqs;
