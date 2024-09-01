
import {
	LayoutDashboardIcon,
	Percent,
	Building2,
	X as CloseIcon,
	Menu as MenuIcon,
	ScrollText,
	TargetIcon,
	CableCarIcon,
	CombineIcon,
	PenToolIcon,
	AlarmSmokeIcon,
	Building2Icon,
	BiohazardIcon,
	RecycleIcon,
	ContainerIcon,
	RibbonIcon,
	AtomIcon,
	UserCircle,
	MessageSquareText,
	LogOutIcon,
	Headset,
} from "lucide-react";

type SidebarItemWithoutSubMenu = {
	id: number;
	name: string;
	icon: any;
	link: string;
};

export type SidebarItem = SidebarItemWithoutSubMenu & {
	submenus?: SidebarItemWithoutSubMenu[];
};

const paidNavigation: SidebarItem[] = [
	{
		id: 3,
		name: "All Company",
		link: "/dashboard/targets/all-company",
		icon: Building2Icon,
	},
	{
		id: 4,
		name: "Waste & Recycling",
		link: "/dashboard/targets/waste-&-recycling",
		icon: RecycleIcon,
	},
	{
		id: 5,
		name: "Water Management",
		link: "/dashboard/targets/water-management",
		icon: CableCarIcon,
	},
	{
		id: 6,
		name: "Supply Chain",
		link: "/dashboard/targets/supply-chain",
		icon: ContainerIcon,
	},
	{
		id: 7,
		name: "Gender Diversity",
		link: "/dashboard/targets/gender-diversity",
		icon: RibbonIcon,
	},
	{
		id: 8,
		name: "Renewables",
		link: "/dashboard/targets/renewables",
		icon: AtomIcon,
	},
];

const freeNavigation: SidebarItem[] = [
	{
		id: 1,
		name: "Dashboard",
		icon: LayoutDashboardIcon,
		link: "/dashboard",
	},
	{
		id: 2,
		name: "Carbon Reduction",
		link: "/dashboard/targets/carbon-reduction",
		icon: BiohazardIcon,
	},
	{
		id: 10,
		name: "Support Tickets",
		link: "/dashboard/tickets",
		icon: Headset,
	},
	{
		id: 9,
		name: "Account",
		link: "/dashboard/account",
		icon: UserCircle,
	},
	{
		id: 11,
		name: "FAQs",
		link: "/dashboard/faqs",
		icon: MessageSquareText,
	},
	{
		id: 12,
		name: "Logout",
		link: "/auth/login",
		icon: LogOutIcon,
	},
];

export { freeNavigation, paidNavigation }