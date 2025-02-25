import Colors from "@/styles/colors";
import { Frown } from "lucide-react";
import { ProgressSpinner } from "primereact/progressspinner";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Content from "./content";
import { TargetTables } from "@/types/target";
import { Grid } from "react-loader-spinner";
import Loading from "./loading";

const Target: React.FC<{
	title: string;
	targetName: TargetTables;
}> = ({ title, targetName }) => {
	return (
		<div className="flex flex-col h-screen">
			<h1 className="px-5 text-[32px] text-[#219E99] font-bold pt-3 mt-2 pb-2">{title}</h1>
			<ErrorBoundary
				fallback={
					<div className="w-[100%] min-h-[50vh] h-[100%] grid place-items-center">
						<div className="flex flex-col gap-5 items-center">
							<Frown size={100} />
							<div className="flex flex-col">
								<p className="text-[20px] text-black text-center">
									Sorry! We couldn&apos;t load the {title} data
								</p>
								<p className="text-[14px] text-black text-center">
									Please try again!
								</p>
							</div>
						</div>
					</div>
				}
			>
				<div className="flex-1 overflow-hidden">
					<Suspense fallback={<Loading />}>
						<Content targetName={targetName} />
					</Suspense>
				</div>
			</ErrorBoundary>
		</div>
	);
};

export default Target;
