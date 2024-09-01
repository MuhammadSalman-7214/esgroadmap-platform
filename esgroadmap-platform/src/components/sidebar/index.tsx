"use client";
import {
	Sidebar as ReactSidebar,
	Menu,
	MenuItem,
	SubMenu,
} from "react-pro-sidebar";

import Link from "next/link";

import { X as CloseIcon, Menu as MenuIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "../logo";
import Colors from "@/styles/colors";
import useMediaQuery from "@/hooks/use-media-query";
import auth from "@/api/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { freeNavigation, paidNavigation, SidebarItem } from "@/constants/nav";
import { User } from "@prisma/client";

const Sidebar: React.FC<{ user: Omit<User, "password" | "deletedAt"> }> = ({
	user,
}) => {
	const [collapsed, setCollapsed] = useState(false);
	const pathname = usePathname();
	const { isLargeDevice, isExtraLargeDevice, isMediumDevice, isSmallDevice } =
		useMediaQuery();
	const router = useRouter();

	useEffect(() => {
		router.refresh();
	}, [router]);

	const full = !collapsed && isExtraLargeDevice;

	const HeaderIcon = !full ? MenuIcon : CloseIcon;

	let navigation = [...freeNavigation];

	if (user.plan !== 1) {
		navigation = [...navigation, ...paidNavigation];
	}

	return (
		<ReactSidebar
			collapsed={collapsed || isMediumDevice || isSmallDevice || isLargeDevice}
			width={"20vw"}
			style={{ backgroundColor: Colors.white }}
			transitionDuration={800}
			rootStyles={{ position: "static", height: "100vh", maxHeight: "100vh" }}
		>
			<header className="min-h-[12vh] flex flex-row items-center justify-between px-[2vw]">
				{full && <Logo />}
				<div
					onClick={() => setCollapsed((prev) => !prev)}
					className="cursor-pointer transition-all mx-auto xl:mx-0"
				>
					<HeaderIcon size={20} color="#000000" className="cursor-pointer" />
				</div>
			</header>

			<Menu>
				{navigation
					.sort((a, b) => a.id - b.id)
					.map((nav) => {
						const isActive = pathname === nav.link;
						const Icon = nav.icon;

						const styles = {
							color: isActive ? Colors.white : Colors.black,
							backgroundColor: isActive ? Colors.secondary : "transparent",
						};

						if (!collapsed && nav.submenus && nav.submenus.length > 0) {
							return (
								<SubMenu
									active={isActive}
									icon={<Icon size={20} color={styles.color} />}
									key={nav.id}
									label={nav.name}
									style={styles}
									component={<Link href={nav.submenus?.[0].link} />}
									open={pathname.startsWith(nav.link)}
								>
									{nav.submenus.map((submenu) => {
										const isSubmenuActive = submenu.link === pathname;
										const SubMenuIcon = submenu.icon;
										const submenuStyles = {
											color: isSubmenuActive ? Colors.white : Colors.black,
											backgroundColor: isSubmenuActive
												? Colors.secondary
												: "transparent",
										};

										return (
											<MenuItem
												key={submenu.id}
												component={<Link href={submenu.link} />}
												active={isSubmenuActive}
												icon={
													<SubMenuIcon size={20} color={submenuStyles.color} />
												}
												style={submenuStyles}
											>
												{submenu.name}
											</MenuItem>
										);
									})}
								</SubMenu>
							);
						}
						return (
							<MenuItem
								key={nav.id}
								component={
									nav.name !== "Logout" ? <Link href={nav.link} /> : undefined
								}
								onClick={() => {
									if (nav.name === "Logout") {
										setTimeout(async () => {
											try {
												const message = await auth.logout();
												router.replace("/auth/login");
												toast.success(message);
											} catch (error) {}
										}, 500);
									}
								}}
								active={isActive}
								icon={<Icon size={20} color={styles.color} />}
								style={styles}
							>
								{!collapsed ? nav.name : ""}
							</MenuItem>
						);
					})}
			</Menu>
		</ReactSidebar>
	);
};

export default Sidebar;
