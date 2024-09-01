import TargetTable from "@/containers/target/table";
import target from "@/functions/target";
import { TargetTables } from "@/types/target";

const Content: React.FC<{ targetName: TargetTables }> = async ({
	targetName,
}) => {
	const data = await target.get(targetName);
	return <TargetTable tableName={targetName} data={data} />;
};

export default Content;
