import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";



const RelatedNetwork = (props) => {
	const visJsRef = useRef(null);

	useEffect(() => {
		const network =
			visJsRef.current &&
			new Network(
				visJsRef.current,
				{ nodes:props.nodes, edges:props.edges },
				{
					autoResize: true,
					edges: {
						color: "#411811"
					}
				}
			);
			network?.on("selectNode", (event) => {
				if (event.nodes?.length === 1) {
					props.changeSelectedNode(event.nodes[0]);
					// window.location.href = event.nodes[0];
				};
			});
			network?.on("click", (event) => {
				if (!(event.nodes?.length === 1)) {
					props.changeSelectedNode(null);
				};
			});
			}, [visJsRef, props.nodes, props.edges]);

	return (
		<div
			ref={visJsRef}
			style={{
				height: `1024px`,
				width: `1900px`,
				maxWidth: "1024",
				minWidth: "30%",
				maxHeight: "512px"
			}}
		/>
	);
};

export default RelatedNetwork;