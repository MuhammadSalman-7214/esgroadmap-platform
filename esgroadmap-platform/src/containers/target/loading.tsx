import React from "react";
import "./loader.css";

const loading = () => {
	return (
		<div className="w-[100%] min-h-[50vh] h-[100%] grid place-items-center">
			<span className="loader"></span>
		</div>
	);
};

export default loading;
