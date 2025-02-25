import dynamic from "next/dynamic";

const QuillDynamic = dynamic(() => import("./_Quill"), {
	ssr: false,
	loading: () => <div>Loading editor...</div>,
});

export default QuillDynamic;
