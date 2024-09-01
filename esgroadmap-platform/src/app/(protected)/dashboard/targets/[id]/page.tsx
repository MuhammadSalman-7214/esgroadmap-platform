import React from "react";
import { Metadata } from "next";
import Target from "@/containers/target";
import { validTargetsPageId } from "@/constants/target";
import { notFound } from "next/navigation";
import convertTargetName from "@/utils/conver-target-name";

type Props = {
	params: { id: string };
};
export function generateMetadata({ params }: Props): Metadata {
	let targetName = validTargetsPageId[decodeURIComponent(params.id)] as string;

	if (!targetName) {
		return { title: "" };
	}

	targetName = convertTargetName(targetName);

	return {
		title: targetName,
		description: `${targetName} Table`,
	};
}

const Page = ({ params }: { params: { id: string } }) => {
	const id = decodeURIComponent(params.id);
	if (!(id in validTargetsPageId && validTargetsPageId[id])) {
		return notFound();
	}
	const targetName = validTargetsPageId[id];
	return (
		<Target targetName={targetName} title={convertTargetName(targetName)} />
	);
};

export default Page;
