import footerConfig from "@/config/footer.config";
import { LinkedinIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
	return (
		<div className="bg-[#000000]">
			<div className="flex flex-col lg:flex-row py-10 px-4 lg:px-0 lg:gap-x-4">
				<div className="w-100 flex items-center justify-center lg:flex-1">
					<Image
						src={"/images/footer/logo.png"}
						alt="ESG Roadmap Logo"
						width={320}
						height={380}
					/>
				</div>

				<div className="w-100 lg:flex-1">
					<h4 className="text-[20px] text-[#219e98] font-semibold">
						QUICK LINKS
					</h4>
					<ul className="flex flex-col">
						{footerConfig.QuickLinks.map((link) => {
							return (
								<li className="w-100" key={link.id}>
									<div className="py-3">
										<Link href={link.link} className="text-[#219e98]">
											{link.title}
										</Link>
									</div>
									<hr />
								</li>
							);
						})}
					</ul>
				</div>

				<div className="my-10 lg:my-0 lg:flex-1">
					<h4 className="text-[20px] text-[#219e98] font-semibold">
						CONNECT WITH US
					</h4>
					<Link href={"https://www.linkedin.com/"} target="_blank">
						<div className="w-5 h-5 bg-[#219e98] flex rounded-md m-5 items-center justify-center">
							<LinkedinIcon size={14} color="#000000" />
						</div>
					</Link>
				</div>

				<div className="flex flex-col gap-4 lg:px-10 lg:flex-1">
					<input
						className="max-w-100 lg:max-w-60 px-2 py-2 rounded-md placeholder:text-stone-400 outline-none"
						placeholder="Name"
					/>
					<input
						className="max-w-100 lg:max-w-80 w-100 px-2 py-2 rounded-md placeholder:text-stone-400 outline-none"
						placeholder="Your Email Address"
					/>
					<button
						className="w-fit py-2 px-5 rounded-md text-[18px] text-white"
						style={{ background: "rgb(25, 56, 57)" }}
					>
						Sign up
					</button>
				</div>
			</div>
			<p className="text-[#219e98] text-[12px] text-center w-100 py-5">
				© 2024 ESGRoadmap
			</p>
		</div>
	);
};

export default Footer;
