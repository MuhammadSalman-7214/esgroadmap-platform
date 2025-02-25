"use client";

import auth from "@/api/auth";
import { changePasswordSchema } from "@/lib/schema";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ZodFormattedError } from "zod";

type FormData = {
	password: { value: string; error: string };
	confirmPassword: { value: string; error: string };
};

const initialData: FormData = {
	password: { value: "", error: "" },
	confirmPassword: { value: "", error: "" },
};

const ChangePassword: React.FC = () => {
	const [data, setData] = useState<FormData>(initialData);
	const [showPassword, setShowPassword] = useState({
		password: false,
		confirmPassword: false,
	});

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
		const values = transformValues(data);
		const result = await changePasswordSchema.safeParseAsync(values);
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

			const values = transformValues(data);

			await auth.changePassword(values);
			setData({ ...initialData });
			setLoading(false);
			toast.success(`Password changed successfully`);
		} catch (error) {
			setLoading(false);
			toast.error((error as Error)?.message);
		}
	};

	return (
		<div className="flex flex-col gap-5 w-[100%]">
			<h2 className="text-[24px] text-[#219E99] font-semibold">
				Change Password
			</h2>

			<div className="w-[100%] space-y-2">
				<p className="font-semibold text-[16px] text-[#000000]">Password</p>
				<div className="w-[100%] flex items-center gap-1">
					<div className="w-[100%] border-[1px] flex items-center border-stone-300 rounded-md px-2 py-2 ">
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
							{showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
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
					<div className="w-[100%] border-[1px] flex items-center border-stone-300 rounded-md px-2 py-2 ">
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

			<button
				className="w-fit py-2 px-5 rounded-sm text-[16px] text-white mb-5 disabled:opacity-60"
				style={{ background: "rgb(25, 56, 57)" }}
				disabled={loading}
				onClick={handleSubmit}
			>
				Save
			</button>
		</div>
	);
};

export default ChangePassword;
