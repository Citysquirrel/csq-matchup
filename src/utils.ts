export const TYPE_INFO: Record<string, { ko: string; color: string }> = {
	normal: { ko: "노말", color: "#A8A77A" },
	fire: { ko: "불꽃", color: "#EE8130" },
	water: { ko: "물", color: "#6390F0" },
	grass: { ko: "풀", color: "#7AC74C" },
	electric: { ko: "전기", color: "#F7D02C" },
	ice: { ko: "얼음", color: "#96D9D6" },
	fighting: { ko: "격투", color: "#C22E28" },
	poison: { ko: "독", color: "#A33EA1" },
	ground: { ko: "땅", color: "#E2BF65" },
	flying: { ko: "비행", color: "#A98FF3" },
	psychic: { ko: "에스퍼", color: "#F95587" },
	bug: { ko: "벌레", color: "#A6B91A" },
	rock: { ko: "바위", color: "#B6A136" },
	ghost: { ko: "고스트", color: "#735797" },
	dragon: { ko: "드래곤", color: "#6F35FC" },
	dark: { ko: "악", color: "#705746" },
	steel: { ko: "강철", color: "#B7B7CE" },
	fairy: { ko: "페어리", color: "#D685AD" },
};

export const DANGER_ABILITIES: Record<string, string> = {
	부유: "땅 공격 무효",
	타오르는불꽃: "불꽃 무효/흡수",
	저수: "물 무효/흡수",
	마중물: "물 무효/특공 상승",
	축전: "전기 무효/흡수",
	피뢰침: "전기 무효/특공 상승",
	전기엔진: "전기 무효/스피드 상승",
	초식: "풀 무효/공격 상승",
	흙먹기: "땅 무효/흡수",
	불가사의부적: "약점 외 모두 무효",
	탈: "첫 공격 데미지 무효",
	아이스페이스: "첫 물리 무효",
	두꺼운지방: "불꽃/얼음 반감",
};

export const BANNED_POKEMON: string[] = [
	// 배틀에서 사용하지 않는 더미/라이드 폼
	// "피카츄(파트너)",
	// "이브이(파트너)",
	// "코라이돈(질주형태)",
	// "코라이돈(유영형태)",
	// "코라이돈(활공형태)",
	// "미라이돈(드라이브모드)",
	// "미라이돈(플로트모드)",
	// "미라이돈(글라이드모드)",
];

const AUTO_BANNED_ENG_POKEMON: string[] = [
	// "venusaur-mega", // 이상해꽃 (ID: 10033)
	// "venusaur-gmax", // 이상해꽃 (ID: 10195)
	// "charizard-mega-y", // 리자몽 (ID: 10035)
	// "charizard-gmax", // 리자몽 (ID: 10196)
	// "blastoise-mega", // 거북왕 (ID: 10036)
	// "blastoise-gmax", // 거북왕 (ID: 10197)
	// "butterfree-gmax", // 버터플 (ID: 10198)
	// "beedrill-mega", // 독침붕 (ID: 10090)
	// "pidgeot-mega", // 피죤투 (ID: 10073)
	"pikachurockstar", // 피카츄 (ID: 10080)
	"pikachubelle", // 피카츄 (ID: 10081)
	"pikachupopstar", // 피카츄 (ID: 10082)
	"pikachuphd", // 피카츄 (ID: 10083)
	"pikachulibre", // 피카츄 (ID: 10084)
	"pikachucosplay", // 피카츄 (ID: 10085)
	"pikachu-original-cap", // 피카츄 (ID: 10094)
	"pikachu-hoenn-cap", // 피카츄 (ID: 10095)
	"pikachu-sinnoh-cap", // 피카츄 (ID: 10096)
	"pikachu-unova-cap", // 피카츄 (ID: 10097)
	"pikachu-kalos-cap", // 피카츄 (ID: 10098)
	"pikachu-partner-cap", // 피카츄 (ID: 10148)
	"pikachu-starter", // 피카츄 (ID: 10158)
	"pikachu-world-cap", // 피카츄 (ID: 10160)
	// "pikachu-gmax", // 피카츄 (ID: 10199)
	// "meowth-gmax", // 나옹 (ID: 10200)
	// "alakazam-mega", // 후딘 (ID: 10037)
	// "machamp-gmax", // 괴력몬 (ID: 10201)
	// "slowbro-mega", // 야도란 (ID: 10071)
	// "gengar-mega", // 팬텀 (ID: 10038)
	// "gengar-gmax", // 팬텀 (ID: 10202)
	// "kingler-gmax", // 킹크랩 (ID: 10203)
	// "kangaskhan-mega", // 캥카 (ID: 10039)
	// "lapras-gmax", // 라프라스 (ID: 10204)
	// "eevee-starter", // 이브이 (ID: 10159)
	// "eevee-gmax", // 이브이 (ID: 10205)
	// "aerodactyl-mega", // 프테라 (ID: 10042)
	// "snorlax-gmax", // 잠만보 (ID: 10206)
	// "mewtwo-mega-y", // 뮤츠 (ID: 10044)
	// "steelix-mega", // 강철톤 (ID: 10072)
	// "scizor-mega", // 핫삼 (ID: 10046)
	// "heracross-mega", // 헤라크로스 (ID: 10047)
	// "houndoom-mega", // 헬가 (ID: 10048)
	// "tyranitar-mega", // 마기라스 (ID: 10049)
	// "blaziken-mega", // 번치코 (ID: 10050)
	// "swampert-mega", // 대짱이 (ID: 10064)
	// "gardevoir-mega", // 가디안 (ID: 10051)
	// "sableye-mega", // 깜까미 (ID: 10066)
	// "mawile-mega", // 입치트 (ID: 10052)
	// "medicham-mega", // 요가램 (ID: 10054)
	// "manectric-mega", // 썬더볼트 (ID: 10055)
	// "sharpedo-mega", // 샤크니아 (ID: 10070)
	// "camerupt-mega", // 폭타 (ID: 10087)
	// "banette-mega", // 다크펫 (ID: 10056)
	// "absol-mega", // 앱솔 (ID: 10057)
	// "glalie-mega", // 얼음귀신 (ID: 10074)
	// "salamence-mega", // 보만다 (ID: 10089)
	// "metagross-mega", // 메타그로스 (ID: 10076)
	// "latias-mega", // 라티아스 (ID: 10062)
	// "latios-mega", // 라티오스 (ID: 10063)
	// "kyogre-primal", // 가이오가 (ID: 10077)
	// "rayquaza-mega", // 레쿠쟈 (ID: 10079)
	// "deoxys-attack", // 테오키스 (ID: 10001)
	// "deoxys-defense", // 테오키스 (ID: 10002)
	// "deoxys-speed", // 테오키스 (ID: 10003)
	// "garchomp-mega", // 한카리아스 (ID: 10058)
	// "lucario-mega", // 루카리오 (ID: 10059)
	// "abomasnow-mega", // 눈설왕 (ID: 10060)
	// "gallade-mega", // 엘레이드 (ID: 10068)
	// "dialga-origin", // 디아루가 (ID: 10245)
	// "palkia-origin", // 펄기아 (ID: 10246)
	// "giratina-origin", // 기라티나 (ID: 10007)
	// "basculin-blue-striped", // 배쓰나이 (ID: 10016)
	// "basculin-white-striped", // 배쓰나이 (ID: 10247)
	// "garbodor-gmax", // 더스트나 (ID: 10207)
	// "tornadus-therian", // 토네로스 (ID: 10019)
	// "thundurus-therian", // 볼트로스 (ID: 10020)
	// "landorus-therian", // 랜드로스 (ID: 10021)
	// "kyurem-black", // 큐레무 (ID: 10022)
	// "kyurem-white", // 큐레무 (ID: 10023)
	// "keldeo-resolute", // 케르디오 (ID: 10024)
	// "greninja-battle-bond", // 개굴닌자 (ID: 10116)
	// "greninja-ash", // 개굴닌자 (ID: 10117)
	// "floette-eternal", // 플라엣테 (ID: 10061)
	// "meowstic-female", // 냐오닉스 (ID: 10025)
	// "aegislash-blade", // 킬가르도 (ID: 10026)
	"pumpkaboo-small", // 호바귀 (ID: 10027)
	"pumpkaboo-large", // 호바귀 (ID: 10028)
	"pumpkaboo-super", // 호바귀 (ID: 10029)
	"gourgeist-small", // 펌킨인 (ID: 10030)
	"gourgeist-large", // 펌킨인 (ID: 10031)
	"gourgeist-super", // 펌킨인 (ID: 10032)
	"zygarde-10-power-construct", // 지가르데 (ID: 10118)
	"zygarde-50-power-construct", // 지가르데 (ID: 10119)
	// "zygarde-complete", // 지가르데 (ID: 10120)
	// "zygarde-10", // 지가르데 (ID: 10181)
	// "diancie-mega", // 디안시 (ID: 10075)
	"gumshoos-totem", // 형사구스 (ID: 10121)
	"vikavolt-totem", // 투구뿌논 (ID: 10122)
	"ribombee-totem", // 에리본 (ID: 10150)
	"rockruff-own-tempo", // 암멍이 (ID: 10151)
	// "lycanroc-midnight", // 루가루암 (ID: 10126)
	// "lycanroc-dusk", // 루가루암 (ID: 10152)
	// "wishiwashi-school", // 약어리 (ID: 10127)
	"araquanid-totem", // 깨비물거미 (ID: 10153)
	"lurantis-totem", // 라란티스 (ID: 10128)
	"salazzle-totem", // 염뉴트 (ID: 10129)
	"minior-orange-meteor", // 메테노 (ID: 10130)
	"minior-yellow-meteor", // 메테노 (ID: 10131)
	"minior-green-meteor", // 메테노 (ID: 10132)
	"minior-blue-meteor", // 메테노 (ID: 10133)
	"minior-indigo-meteor", // 메테노 (ID: 10134)
	"minior-violet-meteor", // 메테노 (ID: 10135)
	"minior-red", // 메테노 (ID: 10136)
	"minior-orange", // 메테노 (ID: 10137)
	"minior-yellow", // 메테노 (ID: 10138)
	"minior-green", // 메테노 (ID: 10139)
	"minior-blue", // 메테노 (ID: 10140)
	"minior-indigo", // 메테노 (ID: 10141)
	"minior-violet", // 메테노 (ID: 10142)
	"togedemaru-totem", // 토게데마루 (ID: 10154)
	// "mimikyu-busted", // 따라큐 (ID: 10143)
	"mimikyu-totem-disguised", // 따라큐 (ID: 10144)
	"mimikyu-totem-busted", // 따라큐 (ID: 10145)
	"kommo-o-totem", // 짜랑고우거 (ID: 10146)
	// "magearna-original", // 마기아나 (ID: 10147)
	// "melmetal-gmax", // 멜메탈 (ID: 10208)
	// "rillaboom-gmax", // 고릴타 (ID: 10209)
	// "cinderace-gmax", // 에이스번 (ID: 10210)
	// "inteleon-gmax", // 인텔리레온 (ID: 10211)
	// "corviknight-gmax", // 아머까오 (ID: 10212)
	// "orbeetle-gmax", // 이올브 (ID: 10213)
	// "drednaw-gmax", // 갈가부기 (ID: 10214)
	// "coalossal-gmax", // 석탄산 (ID: 10215)
	// "flapple-gmax", // 애프룡 (ID: 10216)
	// "appletun-gmax", // 단지래플 (ID: 10217)
	// "sandaconda-gmax", // 사다이사 (ID: 10218)
	"cramorant-gulping", // 윽우지 (ID: 10182)
	"cramorant-gorging", // 윽우지 (ID: 10183)
	// "toxtricity-low-key", // 스트린더 (ID: 10184)
	"toxtricity-amped-gmax", // 스트린더 (ID: 10219)
	// "toxtricity-low-key-gmax", // 스트린더 (ID: 10228)
	// "centiskorch-gmax", // 다태우지네 (ID: 10220)
	// "hatterene-gmax", // 브리무음 (ID: 10221)
	// "grimmsnarl-gmax", // 오롱털 (ID: 10222)
	// "alcremie-gmax", // 마휘핑 (ID: 10223)
	// "eiscue-noice", // 빙큐보 (ID: 10185)
	// "indeedee-female", // 에써르 (ID: 10186)
	// "morpeko-hangry", // 모르페코 (ID: 10187)
	// "copperajah-gmax", // 대왕끼리동 (ID: 10224)
	// "duraludon-gmax", // 두랄루돈 (ID: 10225)
	// "eternatus-eternamax", // 무한다이노 (ID: 10190)
	// "urshifu-single-strike-gmax", // 우라오스 (ID: 10226)
	// "urshifu-rapid-strike-gmax", // 우라오스 (ID: 10227)
	// "zarude-dada", // 자루도 (ID: 10192)
	// "ursaluna-bloodmoon", // 다투곰 (ID: 10272)
	// "basculegion-female", // 대쓰여너 (ID: 10248)
	// "enamorus-therian", // 러브로스 (ID: 10249)
	// "oinkologne-female", // 퍼퓨돈 (ID: 10254)
	// "maushold-family-of-three", // 파밀리쥐 (ID: 10257)
	"squawkabilly-blue-plumage", // 시비꼬 (ID: 10260)
	"squawkabilly-yellow-plumage", // 시비꼬 (ID: 10261)
	"squawkabilly-white-plumage", // 시비꼬 (ID: 10262)
	// "palafin-hero", // 돌핀맨 (ID: 10256)
	// "tatsugiri-droopy", // 싸리용 (ID: 10258)
	// "tatsugiri-stretchy", // 싸리용 (ID: 10259)
	// "dudunsparce-three-segment", // 노고고치 (ID: 10255)
	// "gimmighoul-roaming", // 모으령 (ID: 10263)
	"koraidon-limited-build", // 코라이돈 (ID: 10264)
	"koraidon-sprinting-build", // 코라이돈 (ID: 10265)
	"koraidon-swimming-build", // 코라이돈 (ID: 10266)
	"koraidon-gliding-build", // 코라이돈 (ID: 10267)
	"miraidon-low-power-mode", // 미라이돈 (ID: 10268)
	"miraidon-drive-mode", // 미라이돈 (ID: 10269)
	"miraidon-aquatic-mode", // 미라이돈 (ID: 10270)
	"miraidon-glide-mode", // 미라이돈 (ID: 10271)
	// "terapagos-terastal", // 테라파고스 (ID: 10276)
	// "terapagos-stellar", // 테라파고스 (ID: 10277)
	"raticate-totem-alola", // 레트라 (알로라) (ID: 10093)

	"marowak-totem", // 텅구리 (알로라 토템) (ID:10149)
];

export const BANNED_ENG_POKEMON: string[] = [
	...AUTO_BANNED_ENG_POKEMON,
	// 1세대: 레츠고 파트너 폼
	"pikachu-starter",
	"eevee-starter",

	// 7세대: 토템(주인) 포켓몬
	// "raticate-alola-totem",
	// "gumshoos-totem",
	// "vikavolt-totem",
	// "lurantis-totem",
	// "salazzle-totem",
	// "marowak-alola-totem",
	// "araquanid-totem",
	// "togedemaru-totem",
	// "mimikyu-totem",
	// "mimikyu-busted-totem",
	// "kommo-o-totem",
	// "ribombee-totem",

	// 9세대: 전설의 포켓몬 라이드 폼
	"koraidon-limited-build",
	"koraidon-sprinting-build",
	"koraidon-swimming-build",
	"koraidon-gliding-build",
	"koraidon-apex-build",
	"miraidon-low-power-mode",
	"miraidon-drive-mode",
	"miraidon-aquatic-mode",
	"miraidon-glide-mode",
	"miraidon-ultimate-mode",

	// 포켓몬 고?
	"pikachurockstar",
	"pikachubelle",
	"pikachupopstar",
	"pikachuphd",
	"pikachulibre",
	"pikachucosplay",
	"pikachu-original-cap",
	"pikachu-hoenn-cap",
	"pikachu-sinnoh-cap",
	"pikachu-unova-cap",
	"pikachu-kalos-cap",
	"pikachu-partner-cap",
	"pikachu-world-cap",
	// "pikachu-gmax",
];

const TYPE_CHART: Record<string, Record<string, number>> = {
	normal: { rock: 0.5, ghost: 0, steel: 0.5 },
	fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
	water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
	grass: {
		fire: 0.5,
		water: 2,
		grass: 0.5,
		poison: 0.5,
		ground: 2,
		flying: 0.5,
		bug: 0.5,
		rock: 2,
		dragon: 0.5,
		steel: 0.5,
	},
	electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
	ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
	fighting: {
		normal: 2,
		ice: 2,
		poison: 0.5,
		flying: 0.5,
		psychic: 0.5,
		bug: 0.5,
		rock: 2,
		ghost: 0,
		dark: 2,
		steel: 2,
		fairy: 0.5,
	},
	poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
	ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
	flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
	psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
	bug: {
		fire: 0.5,
		grass: 2,
		fighting: 0.5,
		poison: 0.5,
		flying: 0.5,
		psychic: 2,
		ghost: 0.5,
		dark: 2,
		steel: 0.5,
		fairy: 0.5,
	},
	rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
	ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
	dragon: { steel: 0.5, dragon: 2, fairy: 0 },
	dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
	steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
	fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export const getMultiplier = (moveType: string, targetTypes: string[]): number => {
	if (!targetTypes || targetTypes.length === 0) return 1;
	let mult = 1;
	targetTypes.forEach((t) => {
		const val = TYPE_CHART[moveType]?.[t];
		if (val !== undefined) mult *= val;
	});
	return mult;
};

export const getEnemyWeaknesses = (targetTypes: string[]) => {
	const weaknesses = { x4: [] as string[], x2: [] as string[], x0: [] as string[] };
	Object.keys(TYPE_INFO).forEach((attackType) => {
		const mult = getMultiplier(attackType, targetTypes);
		if (mult === 4) weaknesses.x4.push(attackType);
		else if (mult === 2) weaknesses.x2.push(attackType);
		else if (mult === 0) weaknesses.x0.push(attackType);
	});
	return weaknesses;
};
