"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupButton = ({ level }: { level: number }) => {
	const router = useRouter();
	return (
		<div className="bg-[#219E98] text-white px-8 py-2 rounded-md my-4 cursor-pointer">
			<Link
				href={`/auth/membership-account/membership-checkout?level=${level}`}
				target="_blank"
				className="text-white"
			>
				Signup
			</Link>
		</div>
	);
};

export default SignupButton;
