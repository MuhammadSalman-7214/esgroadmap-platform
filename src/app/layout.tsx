import { Roboto } from "next/font/google";
import "./globals.css";
import MainProvider from "@/provider/main";

const roboto = Roboto({
	weight: ["500", "100", "300", "400", "700", "900"],
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<MainProvider>{children}</MainProvider>
			</body>
		</html>
	);
}
