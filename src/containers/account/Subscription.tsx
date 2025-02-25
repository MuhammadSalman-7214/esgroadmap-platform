"use client";
import plans from "@/constants/plans";
import React, { useCallback, useMemo, useState } from "react";
import subscription from "@/api/subscription";
import auth from "@/api/auth";
import { toast } from "react-toastify";
import env from "@/config/env.config";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";

const Subscription: React.FC<{
	user: Omit<User, "deletedAt" | "password">;
	accessToken: string;
}> = ({ user, accessToken }) => {
	const [plan, setPlan] = useState(() => {
		return plans.find((p) => p.level === user.plan);
	});

	const router = useRouter();

	const onUpgrade = useCallback(async () => {
		if (!plan) throw new Error("Plan not found");
		const { user } = await auth.me(accessToken);

		window.location.href =
			env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK + `?prefilled_email=${user.email}`;
	}, [accessToken, plan]);

	const onCancel = useCallback(async () => {
		try {
			const message = await subscription.cancel();
			const { user } = await auth.me(accessToken);
			const planData = plans.find((p) => p.level === user.plan);
			setPlan(planData);
			toast.success(message);
			router.refresh();
		} catch (error) {
			toast.error((error as Error).message);
		}
	}, [accessToken, router]);

	const levelNextActions = useMemo(
		() =>
			({
				1: { text: "Upgrade", onClick: onUpgrade },
				2: { text: "Cancel", onClick: onCancel },
			} as const),
		[onCancel, onUpgrade]
	);

	const action = useMemo(() => {
		return plan && plan.level in levelNextActions
			? levelNextActions[plan.level as keyof typeof levelNextActions]
			: ({ text: "", onClick: async () => {} } as const);
	}, [plan, levelNextActions]);

	if (!plan) {
		return <p>Invalid Plan!</p>;
	}

	return (
		<div className="flex flex-col gap-5 w-[100%]">
			<h2 className="text-[24px] text-[#219E99] font-semibold">
				User Subscription
			</h2>

			<div className="flex flex-col w-[100%] gap-5">
				<p className="text-[15px] text-[#000000] font-normal">
					Your current plan is:{" "}
					<span className="text-[20px] text-[#219E99] font-normal">
						{plan.title}
					</span>
				</p>
				{plan.level !== 3 && (
					<button
						className="w-fit py-2 px-5 rounded-sm text-[16px] text-white mb-5"
						style={{ background: "rgb(25, 56, 57)" }}
						onClick={action.onClick}
					>
						{action.text}
					</button>
				)}
			</div>
		</div>
	);
};

export default Subscription;
