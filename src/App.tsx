import React, { useState, useEffect } from "react";
import "./App.css";
import POKEMON_DATA from "./data/pokemon_data.json";
import MOVES_DATA from "./data/moves_data.json";
import { Pokemon, AllyPokemon, Move, PartyPreset } from "./types/pokemon";
import {
	TYPE_INFO,
	getMultiplier,
	getEnemyWeaknesses,
	DANGER_ABILITIES,
	BANNED_POKEMON,
	BANNED_ENG_POKEMON,
} from "./utils";
import Tooltip from "./components/Tooltip";
import Spotlight, { GuideStep } from "./components/Spotlight";
import AnimatedGridBackground from "./components/AnimatedGridBackground";

const dbPokemons = POKEMON_DATA as Pokemon[];
const dbMoves = MOVES_DATA as Move[];

export default function App() {
	const ITEMS_PER_PAGE = 50;

	const [view, setView] = useState<"battle" | "party">("battle");

	const [allies, setAllies] = useState<(AllyPokemon | null)[]>(() => {
		const saved = localStorage.getItem("csq-matchup_allies");
		return saved ? JSON.parse(saved) : Array(6).fill(null);
	});
	const [enemies, setEnemies] = useState<(Pokemon | null)[]>(() => {
		const saved = localStorage.getItem("csq-matchup_enemies");
		return saved ? JSON.parse(saved) : [null];
	});
	const [presets, setPresets] = useState<PartyPreset[]>(() => {
		const saved = localStorage.getItem("csq-matchup_presets");
		return saved ? JSON.parse(saved) : [];
	});

	const [allyIdx, setAllyIdx] = useState(() => {
		const saved = localStorage.getItem("csq-matchup_allyIdx");
		return saved ? JSON.parse(saved) : 0;
	});
	const [enemyIdx, setEnemyIdx] = useState(() => {
		const saved = localStorage.getItem("csq-matchup_enemyIdx");
		return saved ? JSON.parse(saved) : 0;
	});

	const [searchConfig, setSearchConfig] = useState<{
		open: boolean;
		target: "ally" | "enemy" | "move";
		moveSlotIdx?: number;
	}>({ open: false, target: "ally" });
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);

	const [isGuideActive, setIsGuideActive] = useState<boolean>(() => {
		const saved = localStorage.getItem("csq-matchup_guide");
		return saved ? JSON.parse(saved) : true;
	});
	const [guideStep, setGuideStep] = useState(0);

	// 실시간 로컬스토리지 갱신 작업
	useEffect(() => {
		localStorage.setItem("csq-matchup_allies", JSON.stringify(allies));
	}, [allies]);
	useEffect(() => {
		localStorage.setItem("csq-matchup_enemies", JSON.stringify(enemies));
	}, [enemies]);
	useEffect(() => {
		localStorage.setItem("csq-matchup_presets", JSON.stringify(presets));
	}, [presets]);
	useEffect(() => {
		localStorage.setItem("csq-matchup_guide", JSON.stringify(isGuideActive));
	}, [isGuideActive]);
	useEffect(() => {
		localStorage.setItem("csq-matchup_allyIdx", JSON.stringify(allyIdx));
	}, [allyIdx]);
	useEffect(() => {
		localStorage.setItem("csq-matchup_enemyIdx", JSON.stringify(enemyIdx));
	}, [enemyIdx]);

	const activeAlly = allies[allyIdx];
	const activeEnemy = enemies[enemyIdx];

	// 가이드 스템 객체
	const guideSteps: GuideStep[] = [
		{
			text: "포켓몬 상성 돋보기의 간단한 튜토리얼을 시작합니다. 설명이 필요없을 경우 우상단의 'X' 버튼을, '다음' 버튼을 눌러 다음 스텝으로 넘어갑니다.",
		},
		{
			targetId: "plate-ally",
			text: "아군 포켓몬 편성부터 시작합니다. '+' 플레이트를 눌러 새 포켓몬을 추가해봅시다.",
			onNext() {
				setAllyIdx(0);
				setSearchConfig({ open: true, target: "ally" });
			},
		},
		{
			targetId: "search-input",
			text: "예시로, '피카츄'를 검색합니다.",
			onPrev() {
				closeSearch();
			},
			onNext() {
				setPage(1);
				setSearchQuery("피카츄");
			},
		},
		{
			targetId: "pikachu",
			text: "피카츄를 아군 파티에 추가해봅시다.",
			onPrev() {
				setPage(1);
				setSearchQuery("");
			},
			onNext() {
				const found = currentItems.find((item) => item.name === "피카츄");
				if (found) handleSelect(found);
			},
		},
		{
			targetId: "ally-info",
			text: "추가와 동시에 선택되며, 선택한 포켓몬(피카츄)의 간단한 정보가 표시됩니다.",
			onPrev() {
				setPage(1);
				setSearchQuery("피카츄");
				setAllyIdx(0);
				setSearchConfig({ open: true, target: "ally" });
			},
		},
		{
			targetId: "move-container",
			text: "이제 피카츄에게 기술을 추가해볼게요. '기술 선택' 플레이트를 눌러봅시다.",
			onNext() {
				setSearchConfig({ open: true, target: "move", moveSlotIdx: 0 });
			},
		},
		{
			targetId: "search-input",
			text: "'10만 볼트'를 검색합니다.",
			onPrev() {
				closeSearch();
			},
			onNext() {
				setPage(1);
				setSearchQuery("10만 볼트");
			},
		},
		{
			targetId: "thunderbolt",
			text: "10만 볼트를 피카츄에게 추가해봅시다.",
			onNext() {
				const found = currentItems.find((item) => item.name === "10만볼트");
				if (found) handleSelect(found);
			},
		},
		{
			targetId: "move-available_thunderbolt",
			text: "피카츄에게 10만 볼트가 지정되었네요. 이제 적군 포켓몬을 추가해 상성 정보를 확인해볼까요?",
			onPrev() {
				setPage(1);
				setSearchQuery("10만 볼트");
				setSearchConfig({ open: true, target: "move", moveSlotIdx: 0 });
			},
		},
		{
			targetId: "plate-enemy",
			text: "'+' 플레이트를 눌러 새 적군 포켓몬을 추가해봅시다.",
			onNext() {
				setPage(1);
				setSearchQuery("갸라도스");
				setAllyIdx(0);
				setSearchConfig({ open: true, target: "enemy" });
			},
		},
		{
			targetId: "gyarados",
			text: "상대 포켓몬은 '갸라도스'를 추가해볼까요?",
			onPrev() {
				closeSearch();
			},
			onNext() {
				const found = currentItems.find((item) => item.name === "갸라도스");
				if (found) handleSelect(found);
			},
		},
		{
			targetId: "enemy-info",
			text: "추가/선택한 포켓몬(갸라도스)의 스피드와 상성에 따른 받는 피해가 표시됩니다.",
			onPrev() {
				setPage(1);
				setSearchQuery("갸라도스");
				setAllyIdx(0);
				setSearchConfig({ open: true, target: "enemy" });
			},
		},
		{
			targetId: "move-available-multi_thunderbolt",
			text: "선택한 적 포켓몬(갸라도스)에 대한 기술의 데미지 배율이 기술 우상단에 표시됩니다.",
		},
		{
			targetId: "goto-ally-setup-button",
			text: "아군 편성 페이지에서 여러가지 파티를 저장하고 불러올 수 있습니다.",
			onNext() {
				setView("party");
			},
		},
		{
			text: "🎉이제, 대략적인 튜토리얼은 완료되었습니다. 상성 돋보기가 당신의 포켓몬 배틀에 도움이 되길 바랍니다.",
			onPrev() {
				setView("battle");
			},
		},
	];

	const getAllyAttackAdvantage = (ally: AllyPokemon | null): AllyOverviewBadge[] => {
		if (!ally || !activeEnemy) return [];

		const multipliers = new Set<number>();

		ally.moves.forEach((move) => {
			if (move && move.type) {
				multipliers.add(getMultiplier(move.type, activeEnemy.types));
			}
		});

		const badges: AllyOverviewBadge[] = [];
		if (multipliers.has(4)) badges.push({ text: "x4", color: "#dc2626" });
		if (multipliers.has(2)) badges.push({ text: "x2", color: "#ea580c" });
		if (multipliers.has(0)) badges.push({ text: "x0", color: "#9ca3af" });

		return badges;
	};

	const getAllyDangerLevel = (ally: AllyPokemon | null, disabled?: boolean): AllyOverviewBadge[] => {
		if (disabled) return [];
		if (!ally || !activeEnemy) return [];

		// 적의 타입들로 때렸을 때 나오는 배율들을 Set에 담아 중복을 제거합니다.
		const multipliers = new Set<number>();
		activeEnemy.types.forEach((enemyType) => {
			multipliers.add(getMultiplier(enemyType, ally.types));
		});

		const badges: AllyOverviewBadge[] = [];
		if (multipliers.has(4)) badges.push({ text: "피격x4", color: "#dc2626" });
		if (multipliers.has(2)) badges.push({ text: "피격x2", color: "#ea580c" });
		if (multipliers.has(0)) badges.push({ text: "무효", color: "#9ca3af" });

		return badges;
	};

	const handleRemove = (e: React.MouseEvent, type: "ally" | "enemy", idx: number) => {
		e.stopPropagation();
		if (type === "ally") {
			const newAllies = [...allies];
			newAllies[idx] = null;
			setAllies(newAllies);
		} else {
			const newEnemies = [...enemies];
			newEnemies.splice(idx, 1);
			if (newEnemies.length === 0 || newEnemies[newEnemies.length - 1] !== null) newEnemies.push(null);
			setEnemies(newEnemies);
			if (enemyIdx >= newEnemies.length - 1) setEnemyIdx(0);
		}
	};

	const normalizedQuery = searchQuery.replace(/\s+/g, "");
	const indexOfLastItem = page * ITEMS_PER_PAGE;
	const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

	const filteredData = (
		searchConfig.target === "move"
			? dbMoves
					.filter((m) => m.name.replace(/\s+/g, "").includes(normalizedQuery))
					.sort((a, b) => a.name.localeCompare(b.name, "ko"))
			: dbPokemons.filter(
					(p) =>
						!BANNED_POKEMON.includes(p.name) &&
						!BANNED_ENG_POKEMON.includes(p.eng_name || "") &&
						p.name.replace(/\s+/g, "").includes(normalizedQuery),
				)
	) as (Pokemon | Move)[];
	const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

	const handleSelect = (item: Pokemon | Move) => {
		if (searchConfig.target === "ally") {
			const newAllies = [...allies];
			newAllies[allyIdx] = { ...(item as Pokemon), moves: [null, null, null, null] };
			setAllies(newAllies);
		} else if (searchConfig.target === "enemy") {
			const newEnemies = [...enemies];
			newEnemies[enemyIdx] = item as Pokemon;
			if (enemyIdx === enemies.length - 1 && enemies.length < 6) newEnemies.push(null);
			setEnemies(newEnemies);
		} else if (searchConfig.target === "move" && activeAlly && searchConfig.moveSlotIdx !== undefined) {
			const newAllies = [...allies];
			const targetAlly = { ...newAllies[allyIdx]! };
			targetAlly.moves = [...targetAlly.moves];

			targetAlly.moves[searchConfig.moveSlotIdx] = item as Move;
			newAllies[allyIdx] = targetAlly;
			setAllies(newAllies);
		}
		closeSearch();
	};

	const closeSearch = () => {
		setSearchConfig({ ...searchConfig, open: false });
		setSearchQuery("");
		setPage(1);
	};

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeSearch();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const getImageUrl = (pokemon: Pokemon) => {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
		//
		// `https://play.pokemonshowdown.com/sprites/dex/${pokemon.eng_name}.png`
	};

	const createWeakTypeIconList = (weakTypes: string[], color: string, text: string) => {
		const len = weakTypes.length;
		const render: string[][] = Array.from({ length: Math.ceil(weakTypes.length / 6) }, (_, i) =>
			weakTypes.slice(i * 6, i * 6 + 6),
		);
		return (
			len > 0 && (
				<div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
					<span style={{ fontSize: "12px", color, marginRight: "8px" }}>[{text}]</span>
					<div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
						{render.map((weakTypes, i) => (
							<div key={i} style={{ display: "flex", gap: "4px", alignItems: "center" }}>
								{weakTypes.map((t) => (
									<Tooltip key={t} content={TYPE_INFO[t].ko}>
										<div key={t} className="type-circle" style={{ background: TYPE_INFO[t].color }}>
											<img key={t} src={`/icons/${t}.svg`} />
										</div>
									</Tooltip>
								))}
							</div>
						))}
					</div>
				</div>
			)
		);
	};

	return (
		<div className="app-container">
			{/* 최상단 네비게이션 헤더 */}
			<div
				style={{
					background: "#111827",
					padding: "10px 8px 10px 15px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: "1px solid #374151",
				}}
			>
				<div
					style={{
						color: "#60a5fa",
						fontSize: "24px",
						WebkitTextStroke: "1px #3590ff77",
						transform: "translateY(2px)",
					}}
				>
					POKEMON TYPE MATCHUP
				</div>
				<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
					{view === "battle" ? (
						<button
							id="goto-ally-setup-button"
							onClick={() => {
								setView("party");
								if (isGuideActive && guideStep === 13) setGuideStep(14);
							}}
							style={{
								background: "#2563eb",
								color: "white",
								border: "none",
								borderRadius: "4px",
								fontSize: "12px",
								padding: "4px 10px",
								cursor: "pointer",
							}}
							tabIndex={-1}
						>
							⚙️ 아군 편성
						</button>
					) : (
						<button
							onClick={() => setView("battle")}
							style={{
								background: "#4b5563",
								color: "white",
								border: "none",
								borderRadius: "4px",
								fontSize: "12px",
								padding: "4px 10px",
								cursor: "pointer",
							}}
							tabIndex={-1}
						>
							⚔️ 전투 복귀
						</button>
					)}
					<button
						id="help-button"
						onClick={() => {
							setView("battle");
							setIsGuideActive(true);
						}}
						tabIndex={-1}
					>
						?
					</button>
				</div>
			</div>

			<div
				className={`slider-container ${view === "battle" ? "screen-battle" : "screen-party"}`}
				style={{ height: "calc(100% - 46px)", maxHeight: "calc(100% - 46px)", overflow: "hidden" }}
			>
				{/* ======================= [화면 1] 배틀 메인 ======================= */}
				<div className="screen">
					<div id="plate-enemy" className="plate-enemy">
						<div className="scroll-row">
							{enemies.map((enemy, idx) => (
								<div
									key={idx}
									className={`slot ${idx === enemyIdx && enemy ? "active" : ""}`}
									onClick={() => {
										if (!enemy) setSearchConfig({ open: true, target: "enemy" });
										setEnemyIdx(idx);
										if (isGuideActive && guideStep === 9 && !enemy) {
											setGuideStep(10);
											setSearchQuery("갸라도스");
											setPage(1);
										}
									}}
									style={{ gridTemplateRows: enemy ? "14px 1fr auto" : "auto" }}
								>
									{enemy ? (
										<>
											<div className="slot-del" onClick={(e) => handleRemove(e, "enemy", idx)}>
												✖
											</div>
											<div className="slot-image-container">
												<img src={getImageUrl(enemy)} className="pokemon-sprite sprite" />
											</div>
											<div className="type-icon-container">
												{enemy.types.map((t) => (
													<React.Fragment key={t}>
														<div
															className="type-icon"
															style={{
																background: `linear-gradient(180deg, ${TYPE_INFO[t]?.color}00 0%, ${TYPE_INFO[t]?.color} 55%`,
															}}
														>
															<img key={t} src={`/icons/${t}.svg`} />
														</div>
													</React.Fragment>
												))}
											</div>
										</>
									) : (
										<div style={{ margin: "auto", fontSize: "40px", color: "#95979d", fontFamily: "sans-serif" }}>
											+
										</div>
									)}
								</div>
							))}
						</div>
					</div>

					{/* 중앙 전투 스테이지 (좌우 레이아웃 분리) */}
					<div
						style={{
							position: "relative",
							display: "flex",
							flexDirection: "column",
							flex: 1,
						}}
					>
						<AnimatedGridBackground lineColor="rgba(56, 189, 248, 0.1)" targetFps={30} blinkProbability={0.3} />
						<div
							style={{
								position: "relative",
								display: "flex",
								flex: 1,
								flexDirection: "column",
								padding: "15px",
								justifyContent: "space-between",
							}}
						>
							{/* 적 정보 (위쪽) */}
							<div id="enemy-info" style={{ display: "flex", justifyContent: "space-between" }}>
								{activeEnemy ? (
									<>
										<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
											<div style={{ fontSize: "20px", marginBottom: "4px" }}>{activeEnemy.name}</div>
											<div style={{ fontSize: "12px", color: "#b4b9c2", marginBottom: "8px" }}>
												⚡종족값 스피드: <span style={{ fontSize: "14px", color: "#93d8bf" }}>{activeEnemy.speed}</span>
											</div>

											{/* 상성 & 요주의 특성 묶음 */}
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: "4px",
													width: "fit-content",
												}}
											>
												{(() => {
													const weak = getEnemyWeaknesses(activeEnemy.types);
													if (
														!weak.x4.length &&
														!weak.x2.length &&
														!weak.x0.length &&
														!weak["x0.5"].length &&
														!weak["x0.25"].length
													)
														return null;
													return (
														<div
															style={{
																background: "rgba(0,0,0,0.3)",
																maxWidth: "240px",
																padding: "6px",
																borderRadius: "6px",
																display: "flex",
																flexDirection: "column",
																gap: "4px",
																paddingInline: "16px",
															}}
														>
															{createWeakTypeIconList(weak.x4, "#fca5a5", "x4")}
															{createWeakTypeIconList(weak.x2, "#fdba74", "x2")}
															{createWeakTypeIconList(weak.x0, "#9ca3af", "x0")}
															{createWeakTypeIconList(weak["x0.5"], "#60A5FA", "x0.5")}
															{createWeakTypeIconList(weak["x0.25"], "#2652ca", "x0.25")}
														</div>
													);
												})()}
												{activeEnemy.abilities
													.filter((a) => DANGER_ABILITIES[a.name])
													.map((a, i) => (
														<div
															key={i}
															style={{
																color: "#fca5a5",
																fontSize: "12px",
																background: "rgba(220,38,38,0.2)",
																padding: "4px",
																borderRadius: "4px",
															}}
														>
															[특성] {a.name}: {DANGER_ABILITIES[a.name]}
														</div>
													))}
											</div>
										</div>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												width: "120px",
												transform: "translateX(-12px)",
												marginTop: "12px",
											}}
										>
											<img src={getImageUrl(activeEnemy)} className="stage-sprite sprite" />
											<div className="mc-floor"></div>
										</div>
									</>
								) : (
									<div style={{ width: "100%", textAlign: "center", color: "#9ca3af" }}>적군 포켓몬을 선택해주세요</div>
								)}
							</div>

							{/* VS 배경 텍스트 */}
							<div
								style={{
									position: "absolute",
									left: "0",
									top: "50%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									width: "100%",
									height: 0,
									overflow: "visible",
								}}
							>
								<div
									style={{
										textAlign: "center",
										fontSize: "40px",
										fontWeight: "900",
										fontStyle: "italic",
										opacity: 0.2,
										margin: "10px 0",
									}}
								>
									VS
								</div>
							</div>

							{/* 아군 정보 (아래쪽) */}
							<div id="ally-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
								{activeAlly ? (
									<>
										<div
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												width: "120px",
												transform: "translateX(12px)",
											}}
										>
											<img src={getImageUrl(activeAlly)} className="stage-sprite sprite" />
											<div className="mc-floor"></div>
										</div>
										<div style={{ flex: 1, textAlign: "right" }}>
											<div style={{ fontSize: "20px", color: "#fbbf24", marginBottom: "4px" }}>{activeAlly.name}</div>
											<div style={{ fontSize: "12px", color: "#b4b9c2", marginTop: "4px" }}>
												🛡️속성:
												{activeAlly.types.map((type, index) => (
													<React.Fragment key={index}>
														{index > 0 ? <span> / </span> : null}
														<span style={{ fontSize: "14px", color: TYPE_INFO[type].color }}>{TYPE_INFO[type].ko}</span>
													</React.Fragment>
												))}
											</div>
											<div style={{ fontSize: "12px", color: "#b4b9c2", marginTop: "4px" }}>
												⚡종족값 스피드: <span style={{ fontSize: "14px", color: "#93d8bf" }}>{activeAlly.speed}</span>
											</div>
											<div style={{ fontSize: "12px", color: "#878c96", marginTop: "4px" }}>
												특성 (참고용): {activeAlly.abilities.map((a) => a.name).join(", ")}
											</div>
										</div>
									</>
								) : (
									<div style={{ width: "100%", textAlign: "center", color: "#9ca3af" }}>아군 포켓몬을 선택해주세요</div>
								)}
							</div>
						</div>

						<div
							id="move-container"
							style={{
								minHeight: "116px",
								padding: "10px",
								background: "#1f2937",
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: "8px",
							}}
						>
							{(activeAlly?.moves || Array(4).fill(null)).map((move, i) => {
								const mult = activeEnemy && move ? getMultiplier(move.type, activeEnemy.types) : 1;
								let badgeColor = "#4b5563";
								let badgeText = `x${mult}`;

								if (mult === 4) {
									badgeColor = "#dc2626";
									badgeText = "x4";
								} else if (mult === 2) {
									badgeColor = "#ea580c";
									badgeText = "x2";
								} else if (mult === 0) {
									badgeColor = "#111827";
									badgeText = "x0";
								} else if (mult === 0.5) {
									badgeColor = "#636363";
									badgeText = "x0.5";
								} else if (mult === 0.25) {
									badgeColor = "#333333";
									badgeText = "x0.25";
								}

								return (
									<div
										key={i}
										id={move?.id === "thunderbolt" ? `move-available_${move.id}` : undefined}
										className="move-btn"
										onClick={() => {
											// activeAlly가 없을 때는 클릭 이벤트를 무시합니다.
											if (!activeAlly) return;

											if (isGuideActive && guideStep === 8) return setGuideStep(9);
											if (isGuideActive && guideStep === 12) return;
											setSearchConfig({ open: true, target: "move", moveSlotIdx: i });
											if (isGuideActive) {
												if (guideStep === 5) setGuideStep(6);
											}
										}}
										style={{
											opacity: mult === 0 ? 0.4 : mult === 0.5 ? 0.8 : mult === 0.25 ? 0.6 : 1,
											outline: mult === 4 ? "1px solid #dc2626" : mult === 2 ? "1px solid #ea580c" : undefined,
											cursor: activeAlly ? "pointer" : "auto",
										}}
									>
										{activeAlly ? (
											move ? (
												<>
													<div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
														<Tooltip content={TYPE_INFO[move.type].ko}>
															<div
																className="type-circle"
																style={{
																	background: TYPE_INFO[move.type]?.color?.toLowerCase(),
																	width: "22px",
																	height: "22px",
																}}
															>
																<img
																	key={move.type}
																	src={`/icons/${move.type}.svg`}
																	style={{ width: "16px", height: "16px" }}
																/>
															</div>
														</Tooltip>
														<span style={{ color: "white", fontSize: "13px" }}>{move.name}</span>
													</div>
													{activeEnemy && (
														<div
															id={move?.id === "thunderbolt" ? `move-available-multi_${move.id}` : undefined}
															style={{
																background: badgeColor,
																position: "absolute",
																top: "-6px",
																right: "-6px",
																padding: "2px 6px",
																fontSize: "12px",
																borderRadius: "4px",
																color: "white",
															}}
														>
															{badgeText}
														</div>
													)}
												</>
											) : (
												<span style={{ color: "#9ca3af", fontSize: "12px" }}>기술 선택</span>
											)
										) : null}
									</div>
								);
							})}
						</div>
					</div>
					<div id="plate-ally" className="plate-ally">
						<div className="scroll-row ally">
							{allies.map((ally, idx) => {
								const dangers = getAllyDangerLevel(ally, true);
								const advantages = getAllyAttackAdvantage(ally);
								return (
									<div
										key={idx}
										className={`slot ${idx === allyIdx && ally ? "active" : ""}`}
										onClick={() => {
											setAllyIdx(idx);
											if (!ally) setSearchConfig({ open: true, target: "ally" });
											if (isGuideActive && !ally && guideStep === 1) setGuideStep(2);
										}}
										style={{ gridTemplateRows: ally ? "auto 1fr 14px" : "auto" }}
									>
										{ally ? (
											<>
												{advantages.length > 0 && (
													<div
														style={{
															position: "absolute",
															bottom: "18px",
															left: "2px",
															display: "flex",
															flexDirection: "column",
															gap: "2px",
															zIndex: 10,
															alignItems: "flex-end",
														}}
													>
														{advantages.map((a) => (
															<div
																key={a.text}
																style={{
																	background: a.color,
																	fontSize: "10px",
																	color: "white",
																	padding: "2px 4px",
																	borderRadius: "4px",
																	boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
																}}
															>
																{a.text}
															</div>
														))}
													</div>
												)}
												{dangers.length > 0 && (
													<div
														style={{
															position: "absolute",
															bottom: "18px",
															left: "2px",
															display: "flex",
															flexDirection: "column",
															gap: "2px",
															zIndex: 10,
														}}
													>
														{dangers.map((d) => (
															<div
																key={d.text}
																style={{
																	background: d.color,
																	fontSize: "9px",
																	color: "white",
																	padding: "2px 4px",
																	borderRadius: "4px",
																	boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
																}}
															>
																{d.text}
															</div>
														))}
													</div>
												)}
												<div className="type-icon-container">
													{ally.types.map((t) => (
														<React.Fragment key={t}>
															<div
																className="type-icon"
																style={{
																	background: `linear-gradient(0deg, ${TYPE_INFO[t]?.color}00 0%, ${TYPE_INFO[t]?.color} 55%`,
																}}
															>
																<img key={t} src={`/icons/${t}.svg`} />
															</div>
														</React.Fragment>
													))}
												</div>
												<div className="slot-image-container">
													<img src={getImageUrl(ally)} className="pokemon-sprite sprite" />
												</div>
												<div className="slot-del" onClick={(e) => handleRemove(e, "ally", idx)}>
													✖
												</div>
											</>
										) : (
											<div style={{ margin: "auto", fontSize: "40px", color: "#95979d", fontFamily: "sans-serif" }}>
												+
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* ======================= [화면 2] 파티 프리셋 ======================= */}
				<div className="screen" style={{ background: "#1f2937" }}>
					<div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px 20px 12px 20px" }}>
						{/* 프리셋 헤더 */}
						<div
							style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}
						>
							<div style={{ margin: 0, fontSize: "18px" }}>파티 프리셋 관리</div>
							<button
								onClick={() => {
									const name = prompt("저장할 파티 이름을 입력하세요:");
									if (name) setPresets([...presets, { id: Date.now().toString(), name, allies: [...allies] }]);
								}}
								style={{
									background: "#10b981",
									color: "white",
									border: "none",
									padding: "6px 12px",
									borderRadius: "4px",
									cursor: "pointer",
								}}
								tabIndex={-1}
							>
								현재 파티 저장
							</button>
						</div>

						{/* 프리셋 리스트 */}
						<div
							style={{
								display: "flex",
								flex: 1,
								flexDirection: "column",
								gap: "10px",
								overflow: "auto",
								// maxHeight: "600px",
								paddingRight: "2px",
							}}
						>
							{presets.length === 0 && (
								<div style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>저장된 프리셋이 없습니다.</div>
							)}
							{presets.map((preset) => (
								<div
									key={preset.id}
									style={{
										background: "#374151",
										padding: "12px",
										borderRadius: "8px",
										display: "flex",
										flexDirection: "column",
										gap: "8px",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											paddingLeft: "8px",
											gap: "4px",
										}}
									>
										<div style={{ flex: 1, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
											{preset.name}
										</div>
										<div style={{ display: "flex", gap: "4px" }}>
											<button
												onClick={() => {
													if (confirm(`${preset.name} 프리셋을 불러오시겠습니까?`)) {
														setAllies([...preset.allies]);
														setView("battle");
													}
												}}
												style={{
													background: "#3b82f6",
													color: "white",
													border: "none",
													padding: "4px 8px",
													borderRadius: "4px",
													cursor: "pointer",
												}}
											>
												불러오기
											</button>
											<button
												onClick={() => {
													if (confirm(`${preset.name} 프리셋을 삭제하시겠습니까?`))
														setPresets(presets.filter((p) => p.id !== preset.id));
												}}
												style={{
													background: "#ef4444",
													color: "white",
													border: "none",
													padding: "4px 8px",
													borderRadius: "4px",
													cursor: "pointer",
												}}
											>
												삭제
											</button>
										</div>
									</div>
									<div
										style={{
											display: "grid",
											gridTemplateColumns: "repeat(6, 1fr)",
											height: "40px",
											placeItems: "center",
										}}
									>
										{preset.allies.map((ally, idx) => (
											<Tooltip content={ally?.name} key={idx}>
												<div
													style={{
														width: "40px",
														height: "40px",
														background: "linear-gradient(135deg ,#ffffff33 0%, #00000033 100%)",
														borderRadius: "4px",
													}}
												>
													{ally?.id ? (
														<img
															className={"preset-sprite sprite"}
															src={getImageUrl(ally as Pokemon)}
															style={{ width: "40px" }}
														/>
													) : (
														<div
															style={{
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																width: "100%",
																height: "100%",
																color: "#8b8a8a",
															}}
														>
															✖
														</div>
													)}
												</div>
											</Tooltip>
										))}
									</div>
								</div>
							))}
						</div>

						{/* 소스코드 링크 */}
						<div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px" }}>
							<a className="github-link" href="https://github.com/Citysquirrel/csq-matchup">
								<div className="github-icon" />
								<span style={{ fontSize: "12px" }}>source</span>
							</a>
						</div>
					</div>
				</div>
			</div>

			{/* ======================= 검색 오버레이 ======================= */}
			{searchConfig.open && (
				<div
					className="overlay"
					style={{
						position: "absolute",
						inset: 0,
						background: "rgba(17, 24, 39, 0.95)",
						zIndex: 50,
						display: "flex",
						flexDirection: "column",
					}}
				>
					<div style={{ padding: "15px", borderBottom: "1px solid #374151", display: "flex", gap: "10px" }}>
						<div style={{ position: "relative", flex: 1 }}>
							<input
								id="search-input"
								autoFocus
								type="text"
								placeholder={
									searchConfig.target === "move"
										? "정확한 기술명을 모른다면? '타입기술' 검색!"
										: "포켓몬 이름 검색 (초성불가)"
								}
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
									if (isGuideActive) {
										if (guideStep === 2 && e.target.value.replace(/\s+/g, "") === "피카츄") setGuideStep(3);
										if (guideStep === 6 && e.target.value.replace(/\s+/g, "") === "10만볼트") setGuideStep(7);
									}
								}}
								style={{
									width: "100%",
									padding: "10px 30px 10px 10px",
									borderRadius: "8px",
									background: "#374151",
									color: "white",
									border: "none",
									outline: "none",
								}}
							/>
							{searchQuery && (
								<button
									onClick={() => {
										setSearchQuery("");
										setPage(1);
									}}
									style={{
										position: "absolute",
										right: "10px",
										top: "10px",
										background: "none",
										border: "none",
										color: "#bec4ce",
										cursor: "pointer",
										transform: "translateY(-3px)",
									}}
								>
									✖
								</button>
							)}
						</div>
						<button
							onClick={closeSearch}
							style={{ background: "none", border: "none", color: "#bec4ce", fontSize: "14px", cursor: "pointer" }}
						>
							취소
						</button>
					</div>

					<div style={{ flex: 1, overflowY: "auto" }}>
						{currentItems.map((item) => {
							const isPokemon = "types" in item;
							return (
								<div
									key={item.id}
									id={
										item.name === "피카츄"
											? "pikachu"
											: item.name === "갸라도스"
												? "gyarados"
												: item.name === "10만볼트"
													? "thunderbolt"
													: undefined
									}
									className="search-item"
									onClick={() => {
										handleSelect(item);
										if (isGuideActive) {
											if (guideStep === 3) return setGuideStep(4);
											if (guideStep === 7) return setGuideStep(8);
											if (guideStep === 10) return setGuideStep(11);
										}
									}}
									style={{
										padding: "15px",
										borderBottom: "1px solid #374151",
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										cursor: "pointer",
									}}
								>
									<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
										{isPokemon && <img className="filter-sprite sprite" src={getImageUrl(item as Pokemon)} />}
										<div>{item.name}</div>
									</div>
									<div style={{ display: "flex", gap: "4px" }}>
										{isPokemon ? (
											(item as Pokemon).types.map((t) => (
												<div
													key={t}
													className="type-badge"
													style={{ background: TYPE_INFO[t]?.color?.toLowerCase(), width: "auto", padding: "0 8px" }}
												>
													{TYPE_INFO[t]?.ko}
												</div>
											))
										) : (
											<div
												className="type-badge"
												style={{
													background: TYPE_INFO[(item as Move).type.toLowerCase()]?.color?.toLowerCase(),
													width: "auto",
													padding: "0 8px",
												}}
											>
												{TYPE_INFO[(item as Move).type.toLowerCase()]?.ko}
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>

					<div style={{ padding: "15px", borderTop: "1px solid #374151", minHeight: "58px" }}>
						{totalPages > 1 ? (
							<div
								className="pagination-buttons"
								style={{
									display: "flex",
									gap: "8px",
									justifyContent: "center",
									marginTop: "2px",
								}}
							>
								<button className="pagination-button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
									이전
								</button>

								<span style={{ alignSelf: "center" }}>
									{page} / {totalPages}
								</span>

								<button
									className="pagination-button"
									disabled={page === totalPages}
									onClick={() => setPage((prev) => prev + 1)}
								>
									다음
								</button>
							</div>
						) : null}
					</div>
				</div>
			)}

			{/*  */}
			<Spotlight
				isActive={isGuideActive}
				steps={guideSteps}
				currentStep={guideStep}
				onStepChange={setGuideStep}
				onClose={() => {
					setIsGuideActive(false);
				}}
			/>
		</div>
	);
}

interface AllyOverviewBadge {
	text: string;
	color: string;
}

