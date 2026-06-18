import React, { useState } from "react";

type Placement = "top" | "bottom" | "left" | "right";

interface TooltipProps {
	content?: React.ReactNode;
	children: React.ReactNode;
	placement?: Placement;
}

export default function Tooltip({ content, children, placement = "top" }: TooltipProps) {
	const [isVisible, setIsVisible] = useState(false);

	if (!content) return <>{children}</>;

	const bgColor = "rgba(17, 24, 39, 0.95)";
	const borderColor = "#374151";

	const getTooltipStyle = (): React.CSSProperties => {
		switch (placement) {
			case "bottom":
				return { top: "100%", left: "50%", transform: "translate(-50%, 8px)" };
			case "left":
				return { top: "50%", right: "100%", transform: "translate(-8px, -50%)" };
			case "right":
				return { top: "50%", left: "100%", transform: "translate(8px, -50%)" };
			case "top":
			default:
				return { bottom: "100%", left: "50%", transform: "translate(-50%, -8px)" };
		}
	};

	const getArrowStyle = (): React.CSSProperties => {
		const baseStyle: React.CSSProperties = {
			position: "absolute",
			width: "10px",
			height: "10px",
			backgroundColor: bgColor,
			transform: "rotate(45deg)",
		};

		switch (placement) {
			case "bottom":
				return {
					...baseStyle,
					top: "-5px",
					left: "50%",
					marginLeft: "-5px",
					borderTop: `1px solid ${borderColor}`,
					borderLeft: `1px solid ${borderColor}`,
				};
			case "left":
				return {
					...baseStyle,
					top: "50%",
					right: "-5px",
					marginTop: "-5px",
					borderTop: `1px solid ${borderColor}`,
					borderRight: `1px solid ${borderColor}`,
				};
			case "right":
				return {
					...baseStyle,
					top: "50%",
					left: "-5px",
					marginTop: "-5px",
					borderBottom: `1px solid ${borderColor}`,
					borderLeft: `1px solid ${borderColor}`,
				};
			case "top":
			default:
				return {
					...baseStyle,
					bottom: "-5px",
					left: "50%",
					marginLeft: "-5px",
					borderBottom: `1px solid ${borderColor}`,
					borderRight: `1px solid ${borderColor}`,
				};
		}
	};

	return (
		<div
			style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
		>
			{/* 툴팁 트리거 */}
			{children}

			{/* 툴팁 박스 */}
			{isVisible && (
				<div
					style={{
						position: "absolute",
						backgroundColor: bgColor,
						border: `1px solid ${borderColor}`,
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
						...getTooltipStyle(),
					}}
				>
					{content}

					{/* 화살표(꼬리) */}
					<div style={getArrowStyle()} />
				</div>
			)}
		</div>
	);
}
