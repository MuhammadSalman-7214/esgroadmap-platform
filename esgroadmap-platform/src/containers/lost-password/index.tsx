"use client";

import auth from "@/api/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const LostPassword = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams?.get('token') || null;
	
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleForgotPassword = async () => {
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		try {
			setLoading(true);
			await auth.forgotPassword(email);
			toast.success("Password reset link has been sent to your email");
			setEmail("");
		} catch (error) {
			toast.error((error as Error)?.message || "Failed to send reset link");
		} finally {
			setLoading(false);
		}
	};

	const handleResetPassword = async () => {
		if (!password) {
			toast.error("Please enter a new password");
			return;
		}

		try {
			setLoading(true);
			const res= await fetch('/api/auth/password/reset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token, password }),
			});
			const response = await res.json();
			if (response.success) {
				toast.success(response.message);
				router.push(response.redirectTo);
			} else {
				console.log("response", response);
				toast.error(response.error); // has to be parsed correctly, currently says "jwt token malformed", needs to be more user friendly
			}
		} catch (error) {
			toast.error((error as Error)?.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="w-100 py-5 bg-white grid place-items-center">
			<div className="max-w-[500px] w-[100%] flex flex-col">
				{!token ? (
					<>
						<p className="text-[16px] mb-10">
							Please enter your username or email address. You will receive a link
							to create a new password via email.
						</p>

						<div className="w-100 space-y-2 mb-5">
							<p className="font-semibold text-[16px] text-[#000000]">
								Username or Email Address
							</p>
							<div className="w-100 flex items-center gap-1">
								<input
									type="text"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="w-[90%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
								/>
							</div>
						</div>

						<button
							className="w-fit py-2 px-5 rounded-sm text-[18px] text-white mb-5"
							style={{ background: "rgb(25, 56, 57)" }}
							onClick={handleForgotPassword}
							disabled={loading}
						>
							{loading ? "Sending..." : "Get New Password"}
						</button>
					</>
				) : (
					<>
						<p className="text-[16px] mb-10">
							Enter your new password below.
						</p>

						<div className="w-100 space-y-2 mb-5">
							<p className="font-semibold text-[16px] text-[#000000]">
								New Password
							</p>
							<div className="w-100 flex items-center gap-1">
								<input
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-[90%] border-[1px] border-stone-300 autofill:bg-[#e8f0fe] rounded-md px-2 py-2 outline-none"
								/>
							</div>
						</div>

						<button
							className="w-fit py-2 px-5 rounded-sm text-[18px] text-white mb-5"
							style={{ background: "rgb(25, 56, 57)" }}
							onClick={handleResetPassword}
							disabled={loading}
						>
							{loading ? "Resetting..." : "Reset Password"}
						</button>
					</>
				)}

				<div
					className="w-100 h-[2px] mt-4"
					style={{ backgroundColor: "rgb(203, 213, 224)" }}
				/>

				<p className="text-red-700 font-normal py-1 hover:text-[#219E99] focus:text-[#219E99]">
					<Link href="/auth/login" replace>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LostPassword;
