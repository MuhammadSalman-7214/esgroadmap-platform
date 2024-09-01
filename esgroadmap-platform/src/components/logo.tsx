import Image from "next/image";

/* eslint-disable @next/next/no-img-element */
const Logo = () => {
	return (
		<Image
			fetchPriority="high"
			width="200"
			height="120"
			src="https://esgroadmap.com/wp-content/uploads/2021/09/ESG_roadmap-side-by-side-scaled.jpg"
			className="custom-logo entered lazyloaded"
			alt="ESG Roadmap"
			style={{ maxHeight: "100%" }}
		/>
	);
};

export default Logo;
