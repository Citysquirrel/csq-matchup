import React, { useEffect, useRef } from "react";

interface Cell {
	col: number;
	row: number;
	opacity: number;
	phase: "in" | "out";
}

interface AnimatedGridProps {
	targetFps?: number;
	gridSize?: number;
	blinkColor?: string;
	lineColor?: string;
	maxOpacity?: number;
	blinkProbability?: number;
	wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
	canvasProps?: React.CanvasHTMLAttributes<HTMLCanvasElement>;
}

/**
 * @description 무작위로 점멸하는 모눈종이 캔버스 배경 컴포넌트입니다.
 * @property {number} [targetFps=15] - 애니메이션의 초당 프레임 수 (낮을수록 레트로한 느낌)
 * @property {number} [gridSize=24] - 모눈 1칸의 픽셀 크기
 * @property {string} [blinkColor='59, 130, 246'] - 점멸 불빛 색상 (RGB 숫자만 입력, 예: '255, 0, 0')
 * @property {string} [lineColor='rgba(15, 23, 42, 0.04)'] - 모눈종이 선 색상 (CSS 색상 문자열)
 * @property {number} [maxOpacity=0.15] - 불빛이 가장 밝아졌을 때의 최대 투명도 (0.0 ~ 1.0)
 * @property {number} [blinkProbability=0.8] - 프레임당 새로운 불이 켜질 확률 (0.0 ~ 1.0)
 * @property {React.HTMLAttributes<HTMLDivElement>} [wrapperProps] - 최상단 wrapper(div)에 전달할 추가 HTML 속성
 * @property {React.CanvasHTMLAttributes<HTMLCanvasElement>} [canvasProps] - canvas 태그에 전달할 추가 HTML 속성
 */
export default function AnimatedGridBackground({
	targetFps = 15,
	gridSize = 24,
	blinkColor = "59, 130, 246",
	lineColor = "rgba(15, 23, 42, 0.04)",
	maxOpacity = 0.15,
	blinkProbability = 0.8,
	wrapperProps,
	canvasProps,
}: AnimatedGridProps) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const wrapper = wrapperRef.current;
		const canvas = canvasRef.current;

		if (!wrapper || !canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let cells: Cell[] = [];

		const fpsInterval = 1000 / targetFps;
		let then = Date.now();

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				canvas.width = entry.contentRect.width;
				canvas.height = entry.contentRect.height;
			}
		});

		resizeObserver.observe(wrapper);

		const draw = () => {
			animationFrameId = requestAnimationFrame(draw);

			const now = Date.now();
			const elapsed = now - then;

			if (elapsed < fpsInterval) return;
			then = now - (elapsed % fpsInterval);

			// 캔버스 초기화 및 선 그리기
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.strokeStyle = lineColor;
			ctx.lineWidth = 1;

			for (let x = 0; x <= canvas.width; x += gridSize) {
				ctx.moveTo(x, 0);
				ctx.lineTo(x, canvas.height);
			}
			for (let y = 0; y <= canvas.height; y += gridSize) {
				ctx.moveTo(0, y);
				ctx.lineTo(canvas.width, y);
			}
			ctx.stroke();

			// 점멸 로직
			if (Math.random() < blinkProbability) {
				const col = Math.floor(Math.random() * (canvas.width / gridSize));
				const row = Math.floor(Math.random() * (canvas.height / gridSize));

				if (!cells.some((c) => c.col === col && c.row === row)) {
					cells.push({ col, row, opacity: 0, phase: "in" });
				}
			}

			cells.forEach((cell) => {
				if (cell.phase === "in") {
					cell.opacity += 0.05;
					if (cell.opacity >= maxOpacity) cell.phase = "out";
				} else {
					cell.opacity -= 0.02;
				}
				ctx.fillStyle = `rgba(${blinkColor}, ${cell.opacity})`;
				ctx.fillRect(cell.col * gridSize, cell.row * gridSize, gridSize, gridSize);
			});

			cells = cells.filter((c) => c.opacity > 0);
		};

		draw();

		return () => {
			resizeObserver.disconnect();
			cancelAnimationFrame(animationFrameId);
		};
	}, [targetFps, gridSize, blinkColor, lineColor, maxOpacity, blinkProbability]);

	return (
		<div
			ref={wrapperRef}
			{...wrapperProps}
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				overflow: "hidden",
				pointerEvents: "none",
				zIndex: 0,
				...wrapperProps?.style,
			}}
		>
			<canvas
				ref={canvasRef}
				{...canvasProps}
				style={{
					display: "block",
					...canvasProps?.style,
				}}
			/>
		</div>
	);
}
