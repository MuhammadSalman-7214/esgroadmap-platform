import { TargetTables } from "@/types/target";

export const validTargetsPageId: Record<string, TargetTables> =
	Object.fromEntries(
		Object.entries({
			"waste_&_recycling": "waste-&-recycling",
			all_company: "all-company",
			carbon_reduction: "carbon-reduction",
			gender_diversity: "gender-diversity",
			renewables: "renewables",
			supply_chain: "supply-chain",
			water_management: "water-management",
		}).map(([key, value]) => [value, key])
	) as Record<string, TargetTables>;
