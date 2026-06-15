import React, { useState } from "react";

interface TooltipProps {
	content?: React.ReactNode;
	children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	if (!content) return children;
	return (
		<div
			style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{/* 툴팁 트리거 (마우스를 올릴 요소) */}
			{children}

			{/* 툴팁 박스 (말풍선) */}
			{isVisible && (
				<div
					style={{
						position: "absolute",
						bottom: "100%",
						left: "50%",
						transform: "translate(-50%, -6px)",
						backgroundColor: "rgba(17, 24, 39, 0.95)",
						border: "1px solid #374151",
						color: "#f3f4f6",
						padding: "8px 10px",
						borderRadius: "6px",
						fontSize: "11px",
						fontWeight: "normal",
						whiteSpace: "nowrap",
						zIndex: 100,
						pointerEvents: "none",
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
						animation: "fadeIn 0.15s ease-in-out",
					}}
				>
					{content}

					{/* 말풍선 아래쪽 꼬리(화살표) */}
					<div
						style={{
							position: "absolute",
							top: "100%",
							left: "50%",
							transform: "translateX(-50%)",
							borderWidth: "5px",
							borderStyle: "solid",
							borderColor: "rgba(17, 24, 39, 0.95) transparent transparent transparent",
						}}
					/>
				</div>
			)}
		</div>
	);
}
