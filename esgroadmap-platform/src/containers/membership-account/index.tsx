"use client";
import auth from "@/api/auth";
import plans from "@/constants/plans";
import { signupSchema } from "@/lib/schema";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ZodFormattedError } from "zod";

type FormData = {
	email: { value: string; error: string };
	confirmEmail: { value: string; error: string };
	password: { value: string; error: string };
	confirmPassword: { value: string; error: string };
	username: { value: string; error: string };
};

const initialData: FormData = {
	email: { value: "", error: "" },
	confirmEmail: { value: "", error: "" },
	username: { value: "", error: "" },
	password: { value: "", error: "" },
	confirmPassword: { value: "", error: "" },
};

const MembershipAccount = () => {
	const params = useSearchParams();
	const router = useRouter();

	const [showPassword, setShowPassword] = useState({
		password: false,
		confirmPassword: false,
	});

	const level = params?.get("level") ? Number(params.get("level")) : 1;

	const plan = plans.find((plan) => plan.level === level);
	if (!plan) throw new Error("Invalid level");

	const [data, setData] = useState<FormData>(initialData);

	const [loading, setLoading] = useState(false);

	const handleChange = (key: keyof FormData) => async (e: any) => {
		setData((prev) => {
			return {
				...prev,
				[key]: {
					value: e.target.value,
					error: "",
				},
			};
		});
	};

	const togglePassword = (key: keyof typeof showPassword) => {
		return () => {
			setShowPassword((prev) => {
				return {
					...prev,
					[key]: !prev[key],
				};
			});
		};
	};

	const transformValues = <
		T extends Record<string, { value: string; error?: string }>,
		R extends { [K in keyof T]: string }
	>(
		data: T
	) => {
		const values = Object.fromEntries(
			Object.keys(data).map((key) => {
				const typedKey = key as keyof T;
				return [typedKey, data[typedKey].value];
			})
		);

		return values as R;
	};

	const validateData = async () => {
		const signupData = transformValues(data);
		const result = await signupSchema.safeParseAsync(signupData);
		let errors:
			| undefined
			| ZodFormattedError<{ [K in keyof FormData]: string }> = undefined;
		if (!result.success) {
			errors = result.error.format();
		}

		return errors;
	};

	const setErrors = (
		errors: ZodFormattedError<{ [K in keyof FormData]: string }>
	) => {
		setData((prev) => {
			const newData = Object.fromEntries(
				Object.keys(errors)
					.filter((key) => key !== "_errors")
					.map((key) => {
						const errorKey = key as keyof FormData;
						console.log(key);
						return [
							errorKey,
							{
								value: prev[errorKey].value,
								error: errors[errorKey]?._errors[0] ?? "",
							},
						];
					})
			);

			return { ...prev, ...newData };
		});
	};

	const handleSubmit = async () => {
		try {
			setLoading(true);
			const errors = await validateData();

			if (errors) {
				setLoading(false);
				return setErrors(errors);
			}

			const signupData = transformValues(data);

			const user = await auth.signup({
				...signupData,
				plan: level === 2 ? 1 : level,
			});
			if ("paymentLink" in plan && plan.paymentLink) {
				toast.success(
					`Your information has been saved! We are redirecting you to checkout shortly....`
				);

				setTimeout(() => {
					window.location.href =
						plan.paymentLink + `?prefilled_email=${user.email}`;
				}, 1000);

				window.location.href =
					plan.paymentLink + `?prefilled_email=${user.email}`;
			} else {
				toast.success(
					`Congratualtions ${user.username}, your account has been created!`
				);
				router.replace("/auth/login");
			}

			setData({ ...initialData });
			setLoading(false);
		} catch (error) {
			setLoading(false);
			toast.error((error as Error)?.message);
		}
	};

	return (
		<div className="w-[100vw] bg-white grid place-items-center">
			<div className="max-w-[600px] w-[100%] flex flex-col py-10 px-2">
				<section className="flex flex-col gap-5 mb-8">
					<div className="w-100 flex items-center gap-4">
						<h3 className="text-[25px] text-[#219e98] font-semibold">
							Membership Level
						</h3>
						<p
							onClick={() => {
								router.replace("/auth/membership-account/membership-levels");
							}}
							className="italic text-[12px] text-[#219e98] font-normal pt-2 cursor-pointer"
						>
							change
						</p>
					</div>
					<p className="text-[16px] text-black">
						You have selected the <strong>{plan.title}</strong> membership
						level.
					</p>
					<p className="text-[16px] text-black">{plan.title} PLAN</p>
					<p className="text-[16px] text-black">
						The price for membership {plan.price[1]}
					</p>

					{/* <p className="text-[12px] text-black font-normal">
						Do you have a discount code?{" "}
						<span className="underline cursor-pointer">
							Click here to enter your discount code
						</span>
					</p> */}
				</section>

				<div
					className="w-100 h-[2px] mb-8"
					style={{ backgroundColor: "rgb(203, 213, 224)" }}
				/>

				<section className="flex flex-col gap-5 mb-8">
					<div className="w-100 flex items-center gap-4">
						<h3 className="text-[25px] text-[#219e98] font-semibold">
							Account Information
						</h3>
						<p className="italic text-[12px] text-[#219e98] font-normal pt-2 cursor-pointer">
							Already have an account? Log in here
						</p>
					</div>

					<div className="w-100 space-y-2">
						<p className="font-semibold text-[16px] text-[#000000]">Username</p>
						<div className="w-100 flex items-center gap-1">
							<input
								type="text"
								value={data.username.value}
								onChange={handleChange("username")}
								className="w-[60%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
							/>
							<p className="text-[18px] text-[#000000]">*</p>
						</div>
						{data.username.error && (
							<p className="text-red-500 text-[12px]">{data.username.error}</p>
						)}
					</div>

					<div className="w-100 space-y-2">
						<p className="font-semibold text-[16px] text-[#000000]">Password</p>
						<div className="w-100 flex items-center gap-1">
							<div className="w-[80%] border-[1px] flex items-center border-stone-300 rounded-md px-2 py-2 ">
								<input
									type={showPassword.password ? "text" : "password"}
									value={data.password.value}
									onChange={handleChange("password")}
									className="outline-none autofill:bg-[#e8f0fe] w-[100%] text-[#000000]"
								/>
								<div
									onClick={togglePassword("password")}
									className="text-[18px] text-[#000000] cursor-pointer focus:outline-none"
								>
									{showPassword.password ? (
										<EyeOff size={18} />
									) : (
										<Eye size={18} />
									)}
								</div>
							</div>
							<p className="text-[18px] text-[#000000]">*</p>
						</div>
						{data.password.error && (
							<p className="text-red-500 text-[12px]">{data.password.error}</p>
						)}
					</div>

					<div className="w-100 space-y-2">
						<p className="font-semibold text-[16px] text-[#000000]">
							Confirm Password
						</p>
						<div className="w-100 flex items-center gap-1">
							<div className="w-[80%] border-[1px] flex items-center border-stone-300 rounded-md px-2 py-2 ">
								<input
									type={showPassword.confirmPassword ? "text" : "password"}
									value={data.confirmPassword.value}
									onChange={handleChange("confirmPassword")}
									className="outline-none autofill:bg-[#e8f0fe] w-[100%] text-[#000000]"
								/>
								<div
									onClick={togglePassword("confirmPassword")}
									className="text-[18px] text-[#000000] cursor-pointer focus:outline-none"
								>
									{showPassword.confirmPassword ? (
										<EyeOff size={18} />
									) : (
										<Eye size={18} />
									)}
								</div>
							</div>
							<p className="text-[18px] text-[#000000]">*</p>
						</div>
						{data.confirmPassword.error && (
							<p className="text-red-500 text-[12px]">
								{data.confirmPassword.error}
							</p>
						)}
					</div>

					<div className="w-100 space-y-2">
						<p className="font-semibold text-[16px] text-[#000000]">
							Email Address
						</p>
						<div className="w-100 flex items-center gap-1">
							<input
								type="text"
								value={data.email.value}
								onChange={handleChange("email")}
								className="w-[80%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
							/>
							<p className="text-[18px] text-[#000000]">*</p>
						</div>
						{data.email.error && (
							<p className="text-red-500 text-[12px]">{data.email.error}</p>
						)}
					</div>

					<div className="w-100 space-y-2">
						<p className="font-semibold text-[16px] text-[#000000]">
							Confirm Email Address
						</p>
						<div className="w-100 flex items-center gap-1">
							<input
								type="text"
								value={data.confirmEmail.value}
								onChange={handleChange("confirmEmail")}
								className="w-[80%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
							/>
							<p className="text-[18px] text-[#000000]">*</p>
						</div>
						{data.confirmEmail.error && (
							<p className="text-red-500 text-[12px]">
								{data.confirmEmail.error}
							</p>
						)}
					</div>
				</section>

				<div
					className="w-100 h-[2px] mb-8"
					style={{ backgroundColor: "rgb(203, 213, 224)" }}
				/>

				<section className="flex flex-col gap-4 mb-8">
					<div className="w-100 flex items-center gap-4">
						<h3 className="text-[25px] text-[#219e98] font-semibold">
							Join our mailing list.
						</h3>
					</div>

					<div className="flex items-center gap-2">
						<input type="checkbox" />
						<p className="text-[#000000] text-[16px] font-semibold">
							ESGRoadmap Members (All)
						</p>
					</div>
				</section>

				<div
					className="w-100 h-[2px] mb-3"
					style={{ backgroundColor: "rgb(203, 213, 224)" }}
				/>

				<button
					className="w-fit py-2 px-5 rounded-md text-[18px] text-white"
					style={{ background: "rgb(25, 56, 57)" }}
					onClick={handleSubmit}
					disabled={loading}
				>
					{"paymentLink" in plan ? "Pay with Stripe" : "Sign up"}
				</button>
			</div>
		</div>
	);
};

export default MembershipAccount;
