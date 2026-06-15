import React, { useState, useEffect, useCallback } from "react";

export interface GuideStep {
	targetId?: string;
	text: string;
	onNext?: () => void;
	onPrev?: () => void;
	hideNextButton?: boolean;
}

interface SpotlightProps {
	isActive: boolean;
	steps: GuideStep[];
	currentStep: number;
	onStepChange: (step: number) => void;
	onClose: () => void;
}

export default function Spotlight({ isActive, steps, currentStep, onStepChange, onClose }: SpotlightProps) {
	const [rect, setRect] = useState<DOMRect | null>(null);
	const [tooltipHeight, setTooltipHeight] = useState(150);

	const tooltipRef = useCallback((node: HTMLDivElement | null) => {
		if (node) setTooltipHeight(node.getBoundingClientRect().height);
	}, []);

	useEffect(() => {
		if (!isActive || steps.length === 0 || !steps[currentStep]) {
			return;
		}

		const targetId = steps[currentStep].targetId;
		if (!targetId) {
			return;
		}

		let frameId: number;
		let fallbackTimer: number;

		const updatePosition = () => {
			frameId = requestAnimationFrame(() => {
				const el = document.getElementById(targetId);
				if (el) setRect(el.getBoundingClientRect());
			});
		};

		let attempts = 0;
		const findTarget = () => {
			const el = document.getElementById(targetId);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "center" });
				updatePosition();
			} else if (attempts < 10) {
				attempts++;
				fallbackTimer = setTimeout(findTarget, 50);
			}
		};
		findTarget();

		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, { passive: true, capture: true });

		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, { capture: true });
			cancelAnimationFrame(frameId);
			clearTimeout(fallbackTimer);
		};
	}, [isActive, currentStep, steps]);

	if (!isActive || !steps[currentStep]) return null;

	const step = steps[currentStep];
	const hasTarget = Boolean(step.targetId);

	if (hasTarget && !rect) return null;

	const baseTooltipStyle: React.CSSProperties = {
		width: "260px",
		backgroundColor: "#1f2937",
		border: "1px solid #4b5563",
		borderRadius: "8px",
		padding: "16px",
		color: "#f3f4f6",
		boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
		display: "flex",
		flexDirection: "column",
		gap: "12px",
		zIndex: 10000,
		pointerEvents: "auto",
		transition: "all 0.25s ease-out",
	};

	let tooltipStyle: React.CSSProperties;
	if (hasTarget && rect) {
		const isBottomTight = window.innerHeight - rect.bottom < tooltipHeight + 20;
		tooltipStyle = {
			...baseTooltipStyle,
			position: "absolute",
			left: Math.max(16, Math.min(window.innerWidth - 280, rect.left + rect.width / 2 - 130)),
			...(isBottomTight ? { bottom: window.innerHeight - rect.top + 12 } : { top: rect.bottom + 12 }),
		};
	} else {
		tooltipStyle = {
			...baseTooltipStyle,
			position: "fixed",
			top: "50%",
			left: "50%",
			transform: "translate(-50%, -50%)",
		};
	}

	const btnStyle: React.CSSProperties = {
		background: "#374151",
		color: "white",
		border: "none",
		borderRadius: "4px",
		padding: "6px 12px",
		fontSize: "11px",
		cursor: "pointer",
		fontWeight: "bold",
	};

	const handleNext = () => {
		if (step.onNext) step.onNext();
		if (currentStep < steps.length - 1) onStepChange(currentStep + 1);
		else {
			onStepChange(0);
			onClose();
		}
	};

	const handlePrev = () => {
		if (step.onPrev) step.onPrev();
		if (currentStep > 0) onStepChange(currentStep - 1);
	};

	return (
		<div style={{ position: "fixed", inset: 0, zIndex: 9999, overflow: "hidden", pointerEvents: "none" }}>
			{hasTarget && rect ? (
				<>
					<div
						style={{
							position: "absolute",
							top: rect.top,
							left: rect.left,
							width: rect.width,
							height: rect.height,
							borderRadius: "8px",
							boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
							transition: "all 0.25s ease-out",
							pointerEvents: "none",
						}}
					/>
					<div
						style={{ position: "absolute", top: 0, left: 0, right: 0, height: rect.top, pointerEvents: "auto" }}
						onClick={(e) => e.stopPropagation()}
					/>
					<div
						style={{ position: "absolute", top: rect.bottom, left: 0, right: 0, bottom: 0, pointerEvents: "auto" }}
						onClick={(e) => e.stopPropagation()}
					/>
					<div
						style={{
							position: "absolute",
							top: rect.top,
							left: 0,
							width: rect.left,
							height: rect.height,
							pointerEvents: "auto",
						}}
						onClick={(e) => e.stopPropagation()}
					/>
					<div
						style={{
							position: "absolute",
							top: rect.top,
							left: rect.right,
							right: 0,
							height: rect.height,
							pointerEvents: "auto",
						}}
						onClick={(e) => e.stopPropagation()}
					/>
				</>
			) : (
				<div
					style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.75)", pointerEvents: "auto" }}
					onClick={(e) => e.stopPropagation()}
				/>
			)}

			<div ref={tooltipRef} style={tooltipStyle}>
				<button
					onClick={() => {
						onStepChange(0);
						onClose();
					}}
					style={{
						position: "absolute",
						top: "12px",
						right: "12px",
						background: "none",
						border: "none",
						color: "#9ca3af",
						cursor: "pointer",
						fontSize: "14px",
						padding: "4px",
					}}
					title="건너뛰기"
				>
					✖
				</button>
				<div
					style={{ fontSize: "10px", color: "#9ca3af", fontWeight: "900", letterSpacing: "1px", paddingRight: "20px" }}
				>
					STEP {currentStep + 1} <span style={{ fontWeight: "normal" }}>/ {steps.length}</span>
				</div>
				<div style={{ fontSize: "13px", lineHeight: "1.5", wordBreak: "keep-all" }}>{step.text}</div>

				<div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
					{currentStep > 0 ? (
						<button onClick={handlePrev} style={btnStyle}>
							이전
						</button>
					) : (
						<div />
					)}
					{!step.hideNextButton && (
						<button onClick={handleNext} style={{ ...btnStyle, background: "#2563eb" }}>
							{currentStep === steps.length - 1 ? "완료" : "다음"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
