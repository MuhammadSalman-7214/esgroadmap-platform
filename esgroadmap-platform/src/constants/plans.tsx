import env from "@/config/env.config";

const plans = [
	{
		id: 1,
		title: <>Free account</>,
		price: [
			<>Free.</>,
			<>
				<strong>$0.00 </strong>now
			</>,
		],
		level: 1,
		amount: 0,
	},
	{
		id: 2,
		title: <>Comprehensive account Analysts&apos; club</>,
		price: [
			<>
				$0.00 <span className="font-normal">now and then</span> $20.00 per
				Month.{" "}
				<span className="font-normal">
					After your initial payment, your first payment is Free.
				</span>
			</>,
			<>
				<strong>$0.00</strong> <span className="font-normal">now and then</span>{" "}
				<strong>$20.00 per Month.</strong>{" "}
				<span className="font-normal">
					After your initial payment, your first payment is Free.
				</span>
			</>,
		],
		level: 2,
		amount: 20,
		paymentLink: env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK,
	},
	{
		id: 3,
		title: <>Comprehensive account &mdash; University access</>,
		price: [
			<>Free.</>,
			<>
				<strong>$0.00 </strong>now
			</>,
		],
		level: 3,
		amount: 0,
	},
];

export default plans;
