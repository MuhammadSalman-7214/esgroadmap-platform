"use client";

import auth from "@/api/auth";
import { editProfileSchema } from "@/lib/schema";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ZodFormattedError } from "zod";

type FormData = {
	username: { value: string; error: string };
	email: { value: string; error: string };
};

const EditProfile: React.FC<{
	user: { email: string; username: string };
}> = (props) => {
	const [data, setData] = useState<FormData>(() => {
		return Object.fromEntries(
			Object.keys(props.user).map((key) => {
				let userKey = key as keyof typeof props.user;
				return [userKey, { value: props.user[userKey], error: "" }];
			})
		) as FormData;
	});

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
		const result = await editProfileSchema.safeParseAsync(values);
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

			await auth.editProfile(values);
			setLoading(false);
			toast.success(`Profile updated successfully!`);
		} catch (error) {
			setLoading(false);
			toast.error((error as Error)?.message);
		}
	};

	return (
		<div className="flex flex-col gap-5 w-[100%]">
			<h2 className="text-[24px] text-[#219E99] font-semibold">Edit Profile</h2>

			<div className="w-100 space-y-2">
				<p className="font-semibold text-[16px] text-[#000000]">Username</p>
				<div className="w-100 flex items-center gap-1">
					<input
						type="text"
						value={data.username.value}
						onChange={handleChange("username")}
						className="w-[100%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
					/>
					<p className="text-[18px] text-[#000000]">*</p>
				</div>
				{data.username.error && (
					<p className="text-red-500 text-[12px]">{data.username.error}</p>
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
						className="w-[100%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
					/>
					<p className="text-[18px] text-[#000000]">*</p>
				</div>
				{data.email.error && (
					<p className="text-red-500 text-[12px]">{data.email.error}</p>
				)}
			</div>

			<button
				className="w-fit py-2 px-5 rounded-sm text-[16px] text-white mb-5 disabled:opacity-60"
				style={{ background: "rgb(25, 56, 57)" }}
				disabled={loading}
				onClick={handleSubmit}
			>
				Submit
			</button>
		</div>
	);
};

export default EditProfile;
