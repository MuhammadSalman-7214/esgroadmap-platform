import Link from "next/link";
import Logo from "./logo";
import { Button } from "primereact/button";
import { Linkedin, LinkedinIcon } from "lucide-react";

const navItems = [
	{
		id: 1,
		title: "Home",
		link: "/",
		isButton: false,
	},
	{
		id: 2,
		title: "Tools",
		link: "/",
		isButton: false,
	},
	{
		id: 5,
		title: "My account",
		link: "/auth/login",
		isButton: false,
	},
	{
		id: 3,
		title: "Sign up",
		link: "/auth/sign-up",
		isButton: false,
		className: "text-[#219E99]",
	},
	{
		id: 4,
		title: "Contact Us",
		isButton: true,
		link: "/",
	},
];

const Navbar = () => {
	return (
		<div className="w-[100vw] flex flex-col items-center gap-[5px] px-[30px]">
			<div className="w-[100%] flex flex-row justify-end">
				<div className="w-6 h-6 bg-[#219E99] rounded-b-md grid place-items-center cursor-pointer">
					<Linkedin color="white" size={15} />
				</div>
			</div>
			<div className="flex flex-1 w-[100%] py-[20px] items-end justify-between">
				<Link href={"/"}>
					<Logo />
				</Link>

				<nav className="md:block hidden">
					<ul className="flex items-center gap-4">
						{navItems.map((item) => {
							return (
								<li
									key={item.id}
									className={`text-[1rem] ${item.className ?? ""}`}
								>
									{item.isButton ? (
										<Button>{item.title}</Button>
									) : (
										<Link href={item.link}>{item.title}</Link>
									)}
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default Navbar;
