/* =====================================================
   I.D. Toys — KO / EN / TH language switcher
   text-node replacement engine + full dictionary
   ===================================================== */
(function () {
  "use strict";

  var LS_KEY = "idtoy-lang";
  var lang = localStorage.getItem(LS_KEY) || "ko";
  if (lang !== "ko" && lang !== "en" && lang !== "th") lang = "ko";

  /* ---------- dictionary: "한국어" : [en, th] ---------- */
  var D = {
    /* ===== nav (B2B) ===== */
    "홈": ["Home", "หน้าแรก"],
    "회사소개": ["About", "เกี่ยวกับเรา"],
    "제작 서비스": ["Services", "บริการผลิต"],
    "제작 분야": ["Our Work", "ผลงาน"],
    "컨슈머 라인 ↗": ["Consumer Line ↗", "แบรนด์ของเรา ↗"],
    "견적 문의": ["Get a Quote", "ขอใบเสนอราคา"],
    /* ===== nav (Collection) ===== */
    "컬렉션": ["Collection", "คอลเลกชัน"],
    "브랜드": ["Brand", "แบรนด์"],
    "여덟 친구들": ["The Eight Friends", "เพื่อนทั้งแปด"],
    "모먼트": ["Moments", "โมเมนต์"],
    "기업 제작 (B2B) ↗": ["For Business (B2B) ↗", "สำหรับธุรกิจ (B2B) ↗"],
    "주문 예약": ["Reserve", "สั่งจอง"],

    /* ===== index hero ===== */
    "당신의 캐릭터가": ["Where your character", "ที่ที่คาแรกเตอร์ของคุณ"],
    "인형": ["becomes a plush", "กลายเป็นตุ๊กตา"],
    "이 되는 곳": ["", ""],
    "I.D. Toys는 1980년부터 태국 라차부리에서 봉제인형만 만들어 온 제조사입니다.": ["I.D. Toys has been making plush toys — and only plush toys — in Ratchaburi, Thailand since 1980.", "I.D. Toys ผลิตตุ๊กตาผ้า และเฉพาะตุ๊กตาผ้า ที่ราชบุรี ประเทศไทย มาตั้งแต่ปี 1980"],
    "시안 한 장으로 시작해 샘플, 양산, 선적까지 — 브랜드의 눈높이에서 함께 만듭니다.": ["From a single sketch to sample, production and shipping — we build at your brand's standard.", "เริ่มจากแบบร่างเพียงแผ่นเดียว สู่ตัวอย่าง การผลิต และการจัดส่ง — เราสร้างไปด้วยกันตามมาตรฐานแบรนด์ของคุณ"],
    "견적 문의하기": ["Request a Quote", "ขอใบเสนอราคา"],
    "제작 서비스 보기": ["See Our Services", "ดูบริการผลิต"],

    /* ===== trust ===== */
    "46년째 인형만 만드는 중": ["46 years in, still making only plush", "46 ปีแล้ว ยังผลิตแต่ตุ๊กตา"],
    "도면 제작부터 기획 개발까지": ["From spec-sheet builds to full development", "ตั้งแต่ผลิตตามแบบจนถึงพัฒนาร่วมกัน"],
    "In-house 검수": ["In-house QC", "ตรวจสอบคุณภาพในโรงงาน"],
    "전 수량 자체 검수 후 출고": ["Every unit inspected before shipping", "ตรวจสอบทุกชิ้นก่อนจัดส่ง"],
    "해외 브랜드 수출 실적 보유": ["Export track record with global brands", "มีประสบการณ์ส่งออกให้แบรนด์ทั่วโลก"],

    /* ===== index hub ===== */
    "Guide — 무엇이 궁금하세요?": ["Guide — What would you like to know?", "ไกด์ — อยากรู้เรื่องอะไร?"],
    "필요한 이야기부터": ["Start with what", "เริ่มจากเรื่องที่"],
    "펼쳐": ["matters to you", "คุณอยากรู้"],
    "보세요": ["", ""],
    "1980년부터 봉제인형만 만들어 온 라차부리 공장의 이야기와 품질·안전 기준을 소개합니다.": ["Making only plush in Ratchaburi since 1980 — our story and our quality & safety standards.", "ผลิตแต่ตุ๊กตาที่ราชบุรีมาตั้งแต่ปี 1980 — เรื่องราวและมาตรฐานคุณภาพความปลอดภัยของเรา"],
    "OEM 주문 제작, ODM 기획 개발, 스톡 커스텀 — 세 가지 제작 방식과 6단계 공정을 안내합니다.": ["OEM builds, ODM development and stock customs — three ways to make, in six steps.", "OEM, ODM และ Stock Custom — สามวิธีการผลิตใน 6 ขั้นตอน"],
    "캐릭터 IP 굿즈부터 웰컴 키트, 시즌 프로모션까지 — 브랜드가 인형을 필요로 하는 모든 순간을 모았습니다.": ["From character IP goods to welcome kits and seasonal promos — every moment a brand needs a plush.", "ตั้งแต่สินค้าคาแรกเตอร์ ชุดเวลคัมคิท ไปจนถึงโปรโมชันตามฤดูกาล"],
    "자세히 보기 →": ["Learn more →", "ดูเพิ่มเติม →"],

    /* ===== consumer band ===== */
    "우리가 만든 것을,": ["We sell what", "เราขายสิ่งที่"],
    "우리가 직접 팝니다": ["we make ourselves", "เราผลิตเอง"],
    "ID TOY 컬렉션은 I.D. Toys가 직접 운영하는 컨슈머 라인입니다. 공장의 품질을 소비자 시장에서 매일 증명하고 있습니다 — 귀사의 프로젝트도 같은 라인에서 같은 기준으로 만들어집니다.": ["ID TOY Collection is our own consumer line. We prove our factory's quality in the retail market every day — your project is made on the same line, to the same standard.", "ID TOY Collection คือไลน์สินค้าผู้บริโภคของเราเอง เราพิสูจน์คุณภาพโรงงานในตลาดจริงทุกวัน — โปรเจกต์ของคุณผลิตบนไลน์เดียวกัน มาตรฐานเดียวกัน"],
    "컬렉션 보러 가기": ["Visit the Collection", "ชมคอลเลกชัน"],
    "이 품질로 견적 받기": ["Get a quote at this quality", "ขอใบเสนอราคาคุณภาพนี้"],

    /* ===== next-cta (shared) ===== */
    "내일, 한국어 담당자가": ["Tomorrow, a dedicated manager", "พรุ่งนี้ ผู้ดูแลโปรเจกต์"],
    "직접 연락드립니다": ["will contact you directly", "จะติดต่อคุณโดยตรง"],
    "수량과 용도만 알려주셔도 충분합니다. 영업일 기준 24시간 안에 회신드려요.": ["Just tell us quantity and purpose. We reply within 24 business hours.", "เพียงบอกจำนวนและวัตถุประสงค์ เราจะตอบกลับภายใน 24 ชั่วโมงทำการ"],
    "Next — 제작 서비스": ["Next — Services", "ต่อไป — บริการผลิต"],
    "이 공장에서, 어떻게 만드는지": ["Curious how things are made", "อยากรู้ว่าโรงงานนี้"],
    "궁금하시다면": ["in this factory?", "ผลิตอย่างไร?"],
    "세 가지 제작 방식과 문의부터 선적까지의 6단계 공정을 안내합니다.": ["Three ways to make, and our six steps from inquiry to shipping.", "สามวิธีการผลิต และ 6 ขั้นตอนตั้งแต่สอบถามจนถึงจัดส่ง"],
    "바로 견적 문의": ["Get a quote now", "ขอใบเสนอราคาเลย"],
    "Next — 제작 분야": ["Next — Our Work", "ต่อไป — ผลงาน"],
    "어떤 것들을 만들 수 있는지": ["Want to see what", "อยากเห็นว่าเรา"],
    "보고 싶다면": ["we can make?", "ทำอะไรได้บ้าง?"],
    "캐릭터 IP 굿즈부터 웰컴 키트, 홀리데이 에디션까지 — 활용 예시를 모았습니다.": ["From character goods to welcome kits and holiday editions — see the possibilities.", "ตั้งแต่สินค้าคาแรกเตอร์ เวลคัมคิท จนถึงรุ่นเทศกาล — ดูตัวอย่างการใช้งาน"],
    "제작 분야 보기": ["See Our Work", "ดูผลงาน"],
    "우리 브랜드의 인형,": ["Your brand's plush —", "ตุ๊กตาของแบรนด์คุณ"],
    "지금 시작해 볼까요?": ["shall we begin?", "เริ่มกันเลยไหม?"],

    /* ===== footer (B2B) ===== */
    "당신의 캐릭터가 인형이 되는 곳.": ["Where your character becomes a plush.", "ที่ที่คาแรกเตอร์ของคุณกลายเป็นตุ๊กตา"],
    "견적 문의서 작성": ["Write a quote request", "กรอกแบบฟอร์มขอใบเสนอราคา"],
    "맨 위로 ↑": ["Back to top ↑", "กลับขึ้นบน ↑"],

    /* ===== about page ===== */
    "봉제인형": ["Plush toys —", "ตุ๊กตาผ้า —"],
    "하나": ["the only thing", "สิ่งเดียว"],
    "만": ["", ""],
    "만들어 온 공장": ["this factory has ever made", "ที่โรงงานนี้ผลิตมาตลอด"],
    "태국 라차부리의 I.D. Toys는 1980년부터 재단·봉제·검수·포장 전 공정을 한 지붕 아래에서 처리해 온 봉제인형 전문 제조사입니다.": ["Since 1980, I.D. Toys in Ratchaburi has handled everything — cutting, sewing, inspection and packing — under one roof.", "ตั้งแต่ปี 1980 I.D. Toys ที่ราชบุรีดูแลทุกขั้นตอน ตั้งแต่ตัดผ้า เย็บ ตรวจสอบ จนถึงบรรจุ ภายใต้หลังคาเดียว"],
    "46년째, 인형만": ["46 years in —", "46 ปีแล้ว —"],
    "만드는 중": ["still making plush,", "ยังคงผลิตแต่ตุ๊กตา"],
    "입니다": ["nothing else", ""],
    "1980년, 재봉틀 한 대에서 시작했습니다. 유행이 수십 번 바뀌는 동안 우리는 한 가지만 팠어요 — 봉제인형.": ["It started in 1980 with a single sewing machine. Trends came and went by the dozen; we kept digging at one thing — plush.", "เริ่มต้นปี 1980 ด้วยจักรเย็บผ้าเครื่องเดียว เทรนด์เปลี่ยนไปนับสิบรอบ แต่เราขุดลึกอยู่เรื่องเดียว — ตุ๊กตาผ้า"],
    "그래서 지금은 어떤 캐릭터를 가져와도 인형으로 만들 수 있습니다. 짬에서 나오는 바이브, 46년이면 그럴 만하죠.": ["So today, bring us any character and we can make it plush. Experience has its own vibe — 46 years will do that.", "วันนี้ไม่ว่าคาแรกเตอร์ไหน เราก็ทำเป็นตุ๊กตาได้ ประสบการณ์มันมีออร่าของมันเอง — 46 ปีก็แบบนี้แหละ"],
    "“트렌드는 계속 바뀝니다.": ["“Trends keep changing.", "“เทรนด์เปลี่ยนตลอด"],
    "잘 만든 인형은 안 바뀌고요.”": ["A well-made plush doesn't.”", "แต่ตุ๊กตาที่ทำดีไม่เปลี่ยน”"],
    "오래 곁에 두는 물건을 만든다는 마음으로": ["Made to stay by your side for years", "ผลิตด้วยใจ ให้อยู่ข้างกายไปนาน ๆ"],
    "전 공정이 한 공장 안에서": ["Every process happens", "ทุกขั้นตอนเกิดขึ้น"],
    "이루어집니다": ["inside one factory", "ในโรงงานเดียว"],
    "I.D. Toys는 태국 라차부리(Ratchaburi)에 자리한 봉제인형 전문 제조사입니다. 원단 재단부터 봉제, 표정 자수, 충전, 검수, 포장까지 전 공정을 한 공장 안에서 처리하기 때문에 품질 편차 없이 납기를 지킬 수 있습니다.": ["I.D. Toys is a plush toy specialist in Ratchaburi, Thailand. Cutting, sewing, face embroidery, stuffing, inspection and packing all happen in one factory — so quality stays consistent and deadlines are kept.", "I.D. Toys คือผู้ผลิตตุ๊กตาผ้าโดยเฉพาะที่ราชบุรี ทุกขั้นตอน ตั้งแต่ตัดผ้า เย็บ ปักหน้า ยัดใย ตรวจสอบ และบรรจุ ทำในโรงงานเดียว จึงควบคุมคุณภาพและกำหนดส่งได้แม่นยำ"],
    "캐릭터 IP의 굿즈화, 기업 판촉물, 브랜드 웰컴 키트, 유아·교육 브랜드의 정식 상품까지 —": ["Character IP goods, corporate giveaways, brand welcome kits, retail products for kids brands —", "สินค้าคาแรกเตอร์ ของพรีเมียมองค์กร เวลคัมคิทของแบรนด์ จนถึงสินค้าจริงของแบรนด์เด็ก —"],
    "도면 그대로 만드는 것": ["building exactly to spec", "ผลิตตรงตามแบบ"],
    "과": [" and ", " และ "],
    "컨셉을 상품으로 키워내는 것": ["growing a concept into a product", "พัฒนาคอนเซปต์ให้เป็นสินค้า"],
    ", 두 가지 모두가 우리의 일입니다.": [" — both are what we do.", " — ทั้งสองอย่างคืองานของเรา"],
    "Google Maps에서 보기 ↗": ["View on Google Maps ↗", "ดูใน Google Maps ↗"],

    /* ===== quality ===== */
    "Quality — 품질과 안전": ["Quality — Quality & Safety", "Quality — คุณภาพและความปลอดภัย"],
    "아이 손에 쥐여도": ["Only things safe enough", "เฉพาะสิ่งที่ปลอดภัยพอ"],
    "되는 물건만": ["for a child's hands", "สำหรับมือเด็ก"],
    "공장 문": ["leave this factory", "เท่านั้นที่ออกจากโรงงานนี้"],
    "을 나섭니다": ["", ""],
    "봉제인형의 최종 소비자는 대부분 아이들입니다. 그래서 우리는 눈·코를 자수로 마감하고, 출고 전 전 수량이 니들(금속) 검침기를 통과합니다. 유아 안전 기준 시험이 필요한 프로젝트는 시험 성적서 발급 절차를 함께 안내해 드립니다.": ["Most plush toys end up in children's hands. That's why eyes and noses are embroidered, and every unit passes a needle detector before shipping. For projects that need infant-safety testing, we guide you through certification.", "ตุ๊กตาส่วนใหญ่จบลงในมือเด็ก เราจึงปักตาและจมูกแทนชิ้นส่วนพลาสติก และทุกชิ้นผ่านเครื่องตรวจเข็มก่อนส่ง สำหรับโปรเจกต์ที่ต้องทดสอบมาตรฐานความปลอดภัย เราช่วยดูแลขั้นตอนออกใบรับรอง"],
    "EN71 · KC 등 안전 기준 시험 대응": ["EN71, KC and other safety standard testing supported", "รองรับการทดสอบมาตรฐาน EN71, KC และอื่น ๆ"],
    "*세부 인증 보유 현황은 상담 시 안내": ["*Details of certifications provided during consultation", "*รายละเอียดใบรับรองแจ้งเมื่อปรึกษา"],
    "전 수량 니들 검침 · 봉제 강도 검사": ["Needle detection & seam strength tests on every unit", "ตรวจเข็มโลหะและทดสอบความแข็งแรงตะเข็บทุกชิ้น"],
    "브랜드 라벨·택·자수 네임 태그 제작 지원": ["Brand labels, tags and embroidered name tags supported", "รองรับการผลิตป้ายแบรนด์ แท็ก และป้ายชื่อปัก"],
    "원단 밀도·감촉 검수": ["Fabric density & touch inspection", "ตรวจสอบความหนาแน่นและสัมผัสของผ้า"],
    "파츠 없는 자수 마감 — 삼킴 위험 제로": ["Embroidered finish, no parts — zero choking risk", "ปักแทนชิ้นส่วน — ไร้ความเสี่ยงกลืนติดคอ"],

    /* ===== services page ===== */
    "프로젝트 단계에 맞는": ["Three doors, matched to", "สามประตู ที่เหมาะกับ"],
    "세 개의 문": ["your project stage", "ขั้นของโปรเจกต์คุณ"],
    "완성된 도면이 있어도, 스케치 한 장뿐이어도, 로고만 있어도 시작할 수 있습니다. 어느 방식이 맞을지 모르겠다면 문의 주세요 — 상담에서 함께 정하면 됩니다.": ["A finished spec sheet, a single sketch, or just a logo — any of them is a start. Not sure which fits? Just ask — we'll decide together.", "มีแบบสมบูรณ์ มีแค่สเก็ตช์ หรือมีเพียงโลโก้ ก็เริ่มได้ ไม่แน่ใจว่าแบบไหนเหมาะ ปรึกษาเราได้เลย"],
    "주문 제작": ["Build to Order", "ผลิตตามสั่ง"],
    "캐릭터 시트·도면·기존 샘플을 주시면 그대로 구현합니다. 원단 스와치와 자수 컬러칩을 맞춰 브랜드 가이드에 정확히 대응합니다.": ["Send a character sheet, spec or existing sample and we build it exactly. Fabric swatches and thread color chips are matched to your brand guide.", "ส่งแบบคาแรกเตอร์ สเปก หรือตัวอย่างเดิมมา เราผลิตให้ตรงเป๊ะ พร้อมเทียบสีผ้าและไหมปักตามไกด์แบรนด์"],
    "캐릭터 IP 굿즈 · 라이선스 상품": ["Character IP goods · licensed products", "สินค้าคาแรกเตอร์ · สินค้าลิขสิทธิ์"],
    "MOQ 500개부터": ["MOQ from 500 pcs", "MOQ เริ่มที่ 500 ชิ้น"],
    "*협의 가능": ["*negotiable", "*ต่อรองได้"],
    "샘플 2–3주 · 양산 4–8주": ["Sample 2–3 wks · production 4–8 wks", "ตัวอย่าง 2–3 สัปดาห์ · ผลิต 4–8 สัปดาห์"],
    "기획 개발": ["Design & Develop", "ออกแบบและพัฒนา"],
    "컨셉과 타깃만 있어도 됩니다. 사내 디자이너가 캐릭터 도안과 패턴 설계부터 함께 개발해 브랜드의 정식 상품으로 완성합니다.": ["A concept and a target audience is enough. Our in-house designers develop the character art and patterns with you, into a retail-ready product.", "มีแค่คอนเซปต์กับกลุ่มเป้าหมายก็พอ นักออกแบบของเราพัฒนาลายเส้นและแพทเทิร์นร่วมกับคุณจนเป็นสินค้าจริง"],
    "도안 → 패턴 → 샘플 풀 패키지": ["Art → pattern → sample, full package", "ลายเส้น → แพทเทิร์น → ตัวอย่าง ครบชุด"],
    "디자인 시안 왕복 수정 포함": ["Design revision rounds included", "รวมรอบแก้ไขแบบ"],
    "독점 디자인 권리 이전": ["Exclusive design rights transferred", "โอนสิทธิ์แบบเอกสิทธิ์ให้คุณ"],
    "스톡 커스텀": ["Stock Custom", "สต็อกคัสตอม"],
    "검증된 자사 몸판 8종(곰·토끼·고양이·강아지·양·오리·여우·판다)에 로고 자수, 컬러, 의상, 태그만 바꿔 빠르고 가볍게 만듭니다.": ["Take our 8 proven bodies (bear, bunny, cat, puppy, lamb, duck, fox, panda) and customize logo embroidery, colors, outfits and tags — fast and light.", "ใช้โครงตุ๊กตา 8 แบบของเรา (หมี กระต่าย แมว หมา แกะ เป็ด จิ้งจอก แพนด้า) ปรับโลโก้ปัก สี ชุด และแท็ก — เร็วและง่าย"],
    "소량 판촉물 · 웰컴 키트에 최적": ["Ideal for small-run promos & welcome kits", "เหมาะกับของพรีเมียมจำนวนน้อยและเวลคัมคิท"],
    "MOQ 100개부터": ["MOQ from 100 pcs", "MOQ เริ่มที่ 100 ชิ้น"],
    "*낮은 진입 장벽": ["*low barrier to entry", "*เริ่มต้นง่าย"],
    "샘플 1–2주 · 양산 3–5주": ["Sample 1–2 wks · production 3–5 wks", "ตัวอย่าง 1–2 สัปดาห์ · ผลิต 3–5 สัปดาห์"],

    /* ===== process ===== */
    "Process — 문의에서 선적까지": ["Process — Inquiry to Shipping", "Process — จากสอบถามถึงจัดส่ง"],
    "6단계, 전 과정을": ["Six steps, one dedicated", "6 ขั้นตอน ดูแลโดย"],
    "담당자 한 명이 안내합니다": ["manager guiding you through", "ผู้จัดการคนเดียวตลอดทาง"],
    "단계마다 사진과 영상으로 진행 상황을 공유하고, 승인 없이는 다음 단계로 넘어가지 않습니다. 한국어로 소통합니다.": ["We share photos and videos at every step, and never move on without your approval. Korean, English and Thai support available.", "เราแชร์ภาพและวิดีโอทุกขั้นตอน และไม่ไปขั้นถัดไปโดยไม่ได้รับอนุมัติ สื่อสารได้ทั้งไทย เกาหลี อังกฤษ"],
    "문의 · 상담": ["Inquiry & Consult", "สอบถามและปรึกษา"],
    "수량·용도·예산을 듣고 제작 방식과 개략 견적을 제안합니다.": ["We hear your quantity, purpose and budget, then propose an approach and rough quote.", "ฟังจำนวน วัตถุประสงค์ งบประมาณ แล้วเสนอวิธีผลิตและราคาคร่าว ๆ"],
    "시안 확정": ["Design Lock", "สรุปแบบ"],
    "도안·사이즈·원단·부자재를 확정하고 견적서를 드립니다.": ["Art, size, fabric and trims confirmed; formal quote issued.", "ยืนยันแบบ ขนาด ผ้า อุปกรณ์ แล้วออกใบเสนอราคา"],
    "샘플 제작": ["Sampling", "ทำตัวอย่าง"],
    "실물 샘플을 제작해 발송합니다. 사진·영상 선공유.": ["A physical sample is made and shipped. Photos and video shared first.", "ผลิตตัวอย่างจริงและจัดส่ง แชร์ภาพและวิดีโอให้ก่อน"],
    "수정 · 승인": ["Revise & Approve", "แก้ไขและอนุมัติ"],
    "표정·비율·감촉을 조정합니다. 승인 후에만 양산 시작.": ["Face, proportions and feel are adjusted. Production starts only after approval.", "ปรับหน้า สัดส่วน สัมผัส เริ่มผลิตเมื่ออนุมัติเท่านั้น"],
    "양산": ["Production", "ผลิตจริง"],
    "승인 샘플 기준으로 생산하고 중간 검수 리포트를 보냅니다.": ["We produce to the approved sample and send mid-run inspection reports.", "ผลิตตามตัวอย่างที่อนุมัติ พร้อมส่งรายงานตรวจสอบระหว่างผลิต"],
    "검수 · 선적": ["Inspect & Ship", "ตรวจสอบและจัดส่ง"],
    "전수 검수·니들 검침 후 선적합니다. 통관 서류를 지원합니다.": ["Full inspection and needle detection, then shipping. Customs documents supported.", "ตรวจทุกชิ้นและตรวจเข็มก่อนส่ง พร้อมช่วยเอกสารศุลกากร"],
    "1–3일": ["1–3 days", "1–3 วัน"],
    "3–7일": ["3–7 days", "3–7 วัน"],
    "2–3주": ["2–3 weeks", "2–3 สัปดาห์"],
    "1–2주": ["1–2 weeks", "1–2 สัปดาห์"],
    "4–8주": ["4–8 weeks", "4–8 สัปดาห์"],

    /* ===== work page ===== */
    "브랜드가 인형을": ["Every moment a brand", "ทุกโมเมนต์ที่แบรนด์"],
    "필요로 하는": ["needs", "ต้องการ"],
    "모든 순간": ["a plush toy", "ตุ๊กตา"],
    "아래 이미지는 자사 스톡 라인으로 연출한 활용 예시입니다. 실제 납품 포트폴리오는 NDA 관계로 상담 시 공개해 드립니다.": ["Images below are styled examples using our stock line. Actual client portfolios are shared during consultation, under NDA.", "ภาพด้านล่างเป็นตัวอย่างจัดวางจากไลน์สต็อกของเรา ผลงานลูกค้าจริงเปิดเผยเมื่อปรึกษา ภายใต้ NDA"],
    "캐릭터 IP 굿즈": ["Character IP Goods", "สินค้าคาแรกเตอร์"],
    "이모티콘·웹툰·게임 캐릭터의 인형화": ["Emoji, webtoon & game characters as plush", "เปลี่ยนคาแรกเตอร์อีโมจิ เว็บตูน เกม เป็นตุ๊กตา"],
    "웰컴 키트 · VIP 기프트": ["Welcome Kits · VIP Gifts", "เวลคัมคิท · ของขวัญ VIP"],
    "박스·속지·카드까지 패키지 일괄 제작": ["Box, tissue and card — full package production", "ผลิตครบชุดทั้งกล่อง กระดาษรอง และการ์ด"],
    "시즌 프로모션": ["Seasonal Promotions", "โปรโมชันตามฤดูกาล"],
    "봄 캠페인·이벤트 사은품 대량 제작": ["Volume production for campaigns & event giveaways", "ผลิตจำนวนมากสำหรับแคมเปญและของแจกอีเวนต์"],
    "홀리데이 에디션": ["Holiday Editions", "รุ่นเทศกาล"],
    "연말 한정판 · 콜라보 상품": ["Year-end limited editions & collabs", "รุ่นลิมิเต็ดปลายปี · สินค้าคอลแลบ"],
    "유아 · 교육 브랜드": ["Kids & Education Brands", "แบรนด์เด็กและการศึกษา"],
    "안전 기준 대응 정식 상품 개발": ["Retail products built to safety standards", "พัฒนาสินค้าจริงตามมาตรฐานความปลอดภัย"],
    "리빙 · 콜라보": ["Living & Collabs", "ของแต่งบ้าน · คอลแลบ"],
    "쿠션·애착인형 등 카테고리 확장": ["Category extensions: cushions, comfort plush and more", "ขยายหมวดหมู่: หมอน ตุ๊กตากอด และอื่น ๆ"],

    /* ===== contact page ===== */
    "내일, 담당자가": ["Tomorrow, a manager", "พรุ่งนี้ ผู้ดูแล"],
    "직접": ["personally", "จะติดต่อคุณ"],
    "연락드립니다": ["gets back to you", "โดยตรง"],
    "문의를 남기시면 영업일 기준 24시간 안에 한국어 담당자가 회신합니다. 모든 자료는 상담 목적 외에 사용하지 않으며, 요청 시 NDA를 먼저 체결합니다.": ["Leave an inquiry and we reply within 24 business hours. Your materials are used for consultation only, and we sign an NDA first upon request.", "ฝากข้อความไว้ เราตอบภายใน 24 ชั่วโมงทำการ ข้อมูลของคุณใช้เพื่อการปรึกษาเท่านั้น และเซ็น NDA ก่อนได้ตามต้องการ"],
    "Quote — 견적 문의": ["Quote — Request a Quote", "Quote — ขอใบเสนอราคา"],
    "시안 한 장이면": ["A single sketch", "แค่สเก็ตช์แผ่นเดียว"],
    "충분합니다": ["is enough", "ก็เพียงพอ"],
    "시안·참고 이미지가 있다면 회신 메일에 첨부해 주시면 됩니다. 아직 그림이 없어도 괜찮습니다 — 용도와 수량만 알려주세요.": ["If you have sketches or reference images, attach them to our reply email. No drawings yet? That's fine — just tell us purpose and quantity.", "ถ้ามีแบบหรือภาพอ้างอิง แนบมากับอีเมลตอบกลับได้เลย ยังไม่มีภาพก็ไม่เป็นไร — แค่บอกวัตถุประสงค์และจำนวน"],
    "견적 문의서": ["Quote Request", "แบบฟอร์มขอใบเสนอราคา"],
    "회사명": ["Company", "ชื่อบริษัท"],
    "담당자 성함": ["Contact Person", "ชื่อผู้ติดต่อ"],
    "이메일": ["Email", "อีเมล"],
    "연락처": ["Phone", "เบอร์ติดต่อ"],
    "제작 방식": ["Production Type", "รูปแบบการผลิต"],
    "예상 수량": ["Estimated Quantity", "จำนวนโดยประมาณ"],
    "희망 납기": ["Target Delivery", "กำหนดส่งที่ต้องการ"],
    "프로젝트 설명": ["Project Details", "รายละเอียดโปรเจกต์"],
    "상담 목적의 개인정보 수집·이용에 동의합니다": ["I agree to the use of my information for consultation", "ยินยอมให้ใช้ข้อมูลเพื่อการปรึกษา"],
    "선택해 주세요": ["Please select", "กรุณาเลือก"],
    "OEM — 도면·캐릭터가 있어요": ["OEM — I have specs / a character", "OEM — มีแบบ/คาแรกเตอร์แล้ว"],
    "ODM — 기획부터 함께해요": ["ODM — develop it together", "ODM — พัฒนาร่วมกันตั้งแต่ต้น"],
    "스톡 커스텀 — 기존 몸판 활용": ["Stock Custom — use existing bodies", "Stock Custom — ใช้โครงที่มีอยู่"],
    "아직 모르겠어요": ["Not sure yet", "ยังไม่แน่ใจ"],
    "100 – 500개": ["100 – 500 pcs", "100 – 500 ชิ้น"],
    "500 – 1,000개": ["500 – 1,000 pcs", "500 – 1,000 ชิ้น"],
    "1,000 – 5,000개": ["1,000 – 5,000 pcs", "1,000 – 5,000 ชิ้น"],
    "5,000개 이상": ["5,000+ pcs", "มากกว่า 5,000 ชิ้น"],
    "미정 — 상담 후 결정": ["TBD — decide after consulting", "ยังไม่กำหนด — ตัดสินใจหลังปรึกษา"],
    "주식회사 OOO": ["Your Company Inc.", "บริษัท ตัวอย่าง จำกัด"],
    "이름 / 직함": ["Name / title", "ชื่อ / ตำแหน่ง"],
    "캐릭터/브랜드 소개, 용도(판촉·굿즈·정식 상품), 사이즈, 참고 링크 등을 자유롭게 적어주세요": ["Tell us about your character/brand, purpose (promo, goods, retail), size, reference links...", "เล่าเรื่องคาแรกเตอร์/แบรนด์ วัตถุประสงค์ ขนาด ลิงก์อ้างอิง ได้ตามสะดวก"],
    "견적 문의 보내기": ["Send Quote Request", "ส่งคำขอใบเสนอราคา"],
    "영업일 기준 24시간 내 회신드립니다. 급한 건은 이메일로 바로 연락 주세요.": ["We reply within 24 business hours. In a hurry? Email us directly.", "ตอบกลับภายใน 24 ชั่วโมงทำการ เร่งด่วนติดต่อทางอีเมลได้เลย"],
    "문의가 접수되었습니다": ["Your inquiry has been received", "ได้รับคำขอของคุณแล้ว"],
    "감사합니다. 영업일 기준 24시간 안에 담당자가 연락드리겠습니다.": ["Thank you. A manager will contact you within 24 business hours.", "ขอบคุณค่ะ ผู้ดูแลจะติดต่อกลับภายใน 24 ชั่วโมงทำการ"],
    "새 문의 작성": ["Write a new inquiry", "เขียนคำขอใหม่"],
    "발주 전에": ["Frequently asked,", "คำถามที่พบบ่อย"],
    "자주 묻는 질문": ["before you order", "ก่อนสั่งผลิต"],
    "여기 없는 질문은 견적 문의서에 함께 적어주세요.": ["Questions not covered here? Add them to your quote request.", "คำถามอื่น ๆ เขียนมาในแบบฟอร์มขอใบเสนอราคาได้เลย"],
    "최소 주문 수량(MOQ)은 얼마인가요?": ["What is the minimum order quantity (MOQ)?", "จำนวนสั่งขั้นต่ำ (MOQ) เท่าไหร่?"],
    "신규 도면 제작(OEM·ODM)은 500개, 자사 몸판을 활용하는 스톡 커스텀은 100개부터 가능합니다. 사이즈·사양에 따라 조정될 수 있으니 우선 문의해 주세요.": ["New builds (OEM/ODM) start at 500 pcs; stock customs using our bodies start at 100. It varies by size and spec, so please ask first.", "งานผลิตใหม่ (OEM/ODM) เริ่มที่ 500 ชิ้น สต็อกคัสตอมเริ่มที่ 100 ชิ้น ขึ้นกับขนาดและสเปก สอบถามก่อนได้"],
    "샘플 비용과 기간은 어떻게 되나요?": ["What about sample cost and timing?", "ค่าตัวอย่างและระยะเวลา?"],
    "신규 도면 샘플은 2–3주가 소요되며, 샘플비는 양산 발주 시 전액 공제됩니다. 스톡 커스텀 샘플은 1–2주로 더 빠릅니다.": ["New-build samples take 2–3 weeks; the sample fee is fully credited on production orders. Stock custom samples are faster at 1–2 weeks.", "ตัวอย่างงานใหม่ใช้เวลา 2–3 สัปดาห์ ค่าตัวอย่างหักคืนเต็มเมื่อสั่งผลิต สต็อกคัสตอมเร็วกว่าที่ 1–2 สัปดาห์"],
    "디자인 시안은 몇 번까지 수정되나요?": ["How many design revisions are included?", "แก้แบบได้กี่รอบ?"],
    "샘플 단계에서 표정·비율·원단 조정 2회가 기본 포함이며, 승인 전까지는 협의로 추가 조정이 가능합니다. 승인 샘플과 양산품이 다르면 전량 책임집니다.": ["Two rounds of face/proportion/fabric adjustment are included at sampling, with more negotiable before approval. If production differs from the approved sample, we take full responsibility.", "รวมแก้ไข 2 รอบในขั้นตัวอย่าง และเจรจาเพิ่มได้ก่อนอนุมัติ ถ้าสินค้าผลิตต่างจากตัวอย่างที่อนุมัติ เรารับผิดชอบทั้งหมด"],
    "납기는 보통 얼마나 걸리나요?": ["How long is the typical lead time?", "ระยะเวลาผลิตโดยทั่วไป?"],
    "샘플 승인 후 양산 4–8주, 검수·선적 1–2주입니다. 해상 운송 기준 한국 도착까지 통상 2–3개월을 권장 일정으로 안내드리며, 급한 일정은 상담 시 조율합니다.": ["After sample approval: 4–8 weeks production, 1–2 weeks inspection & shipping. We recommend planning 2–3 months door-to-door by sea; urgent timelines can be discussed.", "หลังอนุมัติตัวอย่าง: ผลิต 4–8 สัปดาห์ ตรวจและส่ง 1–2 สัปดาห์ แนะนำเผื่อเวลา 2–3 เดือนทางเรือ งานเร่งเจรจาได้"],
    "KC 인증이 필요한데 지원되나요?": ["Do you support KC certification?", "รองรับใบรับรอง KC ไหม?"],
    "어린이제품 안전확인(KC) 등 목적 시장의 안전 기준에 맞춘 시험용 샘플 제공과 시험 성적서 발급 절차를 안내·지원합니다. 필요한 인증을 문의 시 알려주세요.": ["We provide test samples and guide you through certification for your target market's standards, including KC. Tell us what you need when you inquire.", "เราจัดตัวอย่างทดสอบและช่วยดูแลขั้นตอนใบรับรองตามมาตรฐานตลาดเป้าหมาย รวมถึง KC แจ้งความต้องการตอนสอบถามได้เลย"],
    "배송과 통관은 어떻게 진행되나요?": ["How do shipping and customs work?", "การจัดส่งและศุลกากรเป็นอย่างไร?"],
    "FOB·CIF 등 인코텀즈 협의 후 진행하며, 인보이스·패킹리스트 등 통관 서류 일체를 지원합니다. 소량 건은 항공 특송으로도 발송 가능합니다.": ["We agree on incoterms (FOB, CIF, etc.) and support all customs documents — invoice, packing list and more. Small orders can ship by air express.", "ตกลง Incoterms (FOB, CIF ฯลฯ) และช่วยเอกสารศุลกากรทั้งหมด งานจำนวนน้อยส่งแอร์ได้"],

    /* ===== collection page ===== */
    "이름을 지어주는 순간,": ["The moment you give it a name,", "วินาทีที่คุณตั้งชื่อให้"],
    "인형은": ["a plush becomes", "ตุ๊กตาก็กลายเป็น"],
    "친구": ["your friend", "เพื่อนของคุณ"],
    "가 됩니다": ["", ""],
    "여덟 명의 친구들이": ["Eight little friends", "เพื่อนตัวน้อยทั้งแปด"],
    "인사를 건네요": ["are saying hello", "กำลังทักทายคุณ"],
    "스크롤하면 친구들이 차례로 지나갑니다.": ["Keep scrolling and the friends parade by.", "เลื่อนต่อไป แล้วเพื่อน ๆ จะเดินผ่านมาทีละตัว"],
    "카드에 마우스를 올려 뒤집어 보세요.": ["Hover a card to flip it over.", "ชี้เมาส์ที่การ์ดเพื่อพลิกดู"],
    "주문 예약하기": ["Reserve an Order", "สั่งจองเลย"],
    "친구들 만나보기": ["Meet the Friends", "พบเพื่อน ๆ"],
    "주문하기 →": ["Order →", "สั่งจอง →"],
    "Brand — 아이디토이": ["Brand — ID TOY", "Brand — ID TOY"],
    "ID는": ["ID stands for", "ID ย่อมาจาก"],
    "이름": ["Your name", "ชื่อของคุณ"],
    "— 하나뿐인 존재라는 뜻입니다": ["— it means one of a kind", "— หมายถึงการเป็นหนึ่งเดียวในโลก"],
    "우리는 1980년부터 인형만 만들어 왔습니다. 46년 동안 유행은 수없이 바뀌었지만, 품에 안기는 순간 인형이 세상에 하나뿐인 존재가 된다는 사실만은 한 번도 바뀐 적이 없어요.": ["We've made plush toys — only plush toys — since 1980. Trends changed countless times over 46 years, but one thing never did: the moment a plush is held, it becomes the only one of its kind.", "เราผลิตแต่ตุ๊กตามาตั้งแต่ปี 1980 ตลอด 46 ปี เทรนด์เปลี่ยนนับไม่ถ้วน แต่สิ่งเดียวที่ไม่เคยเปลี่ยน — วินาทีที่ตุ๊กตาถูกกอด มันกลายเป็นหนึ่งเดียวในโลก"],
    "그래서 아이디토이의 모든 인형은 주문이 들어온 뒤에야 바느질을 시작합니다. 장인의 손끝에서 표정이 조금씩 달라지고, 완성된 친구는 여러분이 지어 준 이름을 자수 태그에 새기고 떠납니다. 이름을 붙이는 순간, 인형은 비로소 자신만의 ID를 갖게 되니까요.": ["That's why every ID TOY is sewn only after your order arrives. Expressions shift subtly under the artisan's hand, and each finished friend leaves with the name you chose embroidered on its tag. Because the moment it's named, a plush finally gets an ID of its own.", "นั่นคือเหตุผลที่ ID TOY ทุกตัวเริ่มเย็บหลังได้รับออเดอร์ สีหน้าเปลี่ยนไปเล็กน้อยตามมือช่าง และเพื่อนที่เสร็จแล้วออกเดินทางพร้อมชื่อที่คุณตั้งปักบนป้าย เพราะวินาทีที่มีชื่อ ตุ๊กตาก็มี ID ของตัวเองเสียที"],
    "ID TOY 컬렉션은 봉제인형 전문 제조사": ["ID TOY Collection is made in the factory of", "ID TOY Collection ผลิตในโรงงานของ"],
    "(태국 라차부리)의 자사 공장에서 제작됩니다. 브랜드들이 믿고 맡기는 그 손끝이, 우리 컬렉션의 품질 기준입니다.": ["(Ratchaburi, Thailand). The same hands that brands trust set the quality bar for our collection.", "(ราชบุรี ประเทศไทย) ฝีมือที่แบรนด์ต่าง ๆ ไว้วางใจ คือมาตรฐานคุณภาพของคอลเลกชันเรา"],
    "“46년 동안 수없이 많은 인형을 만들었지만,": ["“We've made countless plush in 46 years,", "“46 ปีเราผลิตตุ๊กตานับไม่ถ้วน"],
    "똑같은 친구는 한 번도 없었습니다.”": ["but never two friends the same.”", "แต่ไม่เคยมีเพื่อนที่เหมือนกันเลยสักครั้ง”"],
    "함께한 지 3주, 토끼 '보리'와 서윤이": ["Three weeks together — Bunny 'Bori' and Seoyun", "สามสัปดาห์ด้วยกัน — กระต่าย 'โบริ' กับซอยุน"],
    "Collection — 여덟 명의 친구들": ["Collection — The Eight Friends", "Collection — เพื่อนทั้งแปด"],
    "아직 이름이 없는 친구들": ["Friends still waiting for names", "เพื่อน ๆ ที่ยังรอชื่ออยู่"],
    "모두 오가닉 코튼 원단과 저자극 충전솜으로 만들어지며, 눈과 코는 단추 대신 자수로 놓아 영·유아에게도 안전합니다. 마음이 가는 친구를 골라 이름을 지어주세요.": ["All are made with organic cotton and hypoallergenic stuffing; eyes and noses are embroidered, safe even for infants. Pick the friend your heart goes to, and give them a name.", "ทุกตัวทำจากผ้าฝ้ายออร์แกนิกและใยสังเคราะห์อ่อนโยน ตาและจมูกปักแทนกระดุม ปลอดภัยแม้กับทารก เลือกเพื่อนที่ถูกใจ แล้วตั้งชื่อให้เลย"],
    "2026 시그니처 컬렉션 — 전 8종": ["2026 Signature Collection — all 8 friends", "คอลเลกชันซิกเนเจอร์ 2026 — ครบ 8 แบบ"],
    "테디 베어": ["Teddy Bear", "หมีเท็ดดี้"],
    "토끼": ["Bunny", "กระต่าย"],
    "고양이": ["Cat", "แมว"],
    "강아지": ["Puppy", "ลูกหมา"],
    "아기 양": ["Lamb", "ลูกแกะ"],
    "오리": ["Duck", "เป็ด"],
    "여우": ["Fox", "จิ้งจอก"],
    "판다": ["Panda", "แพนด้า"],
    "담담하고 듬직한 맏이. 어떤 이야기든 끝까지 들어줍니다.": ["The calm, dependable eldest. Listens to every story to the end.", "พี่ใหญ่ใจเย็นและพึ่งพาได้ ฟังทุกเรื่องจนจบเสมอ"],
    "처음 인형을 선물하는 분께 — 실패가 없는 첫 친구예요.": ["For first-time gifters — the friend that never misses.", "สำหรับคนที่ให้ตุ๊กตาเป็นของขวัญครั้งแรก — เพื่อนตัวแรกที่ไม่มีพลาด"],
    "#듬직함": ["#dependable", "#พึ่งพาได้"],
    "#포옹전문": ["#hugexpert", "#กอดเก่ง"],
    "수줍음 많은 낭만가. 긴 귀로 작은 소리까지 담아둡니다.": ["A shy romantic. Those long ears keep even the smallest sounds.", "นักโรแมนติกขี้อาย หูยาวเก็บเสียงเบา ๆ ไว้ทุกเสียง"],
    "마음이 여린 분께 — 비밀 이야기를 가장 잘 지켜줘요.": ["For tender hearts — the best keeper of secrets.", "สำหรับคนใจอ่อนโยน — เก็บความลับเก่งที่สุด"],
    "#낭만가": ["#romantic", "#โรแมนติก"],
    "#긴귀": ["#longears", "#หูยาว"],
    "새침한 관찰자. 곁을 내주기까지 시간이 걸리지만, 한번 곁이 되면 평생입니다.": ["An aloof observer. Takes time to warm up — but once it does, it's for life.", "นักสังเกตผู้เย็นชา ใช้เวลากว่าจะเปิดใจ แต่เมื่อเปิดแล้วคือตลอดไป"],
    "혼자만의 시간을 아끼는 분께 — 적당한 거리의 다정함이에요.": ["For those who cherish alone time — warmth at just the right distance.", "สำหรับคนรักเวลาส่วนตัว — ความอบอุ่นในระยะที่พอดี"],
    "#새침": ["#aloof", "#เย็นชา"],
    "#관찰자": ["#observer", "#นักสังเกต"],
    "애교 많은 분위기 메이커. 현관 앞이 제일 좋아하는 자리입니다.": ["The affectionate mood-maker. Its favorite spot is right by the front door.", "ตัวป่วนขี้อ้อน ที่โปรดคือหน้าประตูบ้าน"],
    "매일 웃을 일이 필요한 분께 — 집에 오는 길이 즐거워져요.": ["For those who need a daily smile — coming home gets happier.", "สำหรับคนที่อยากยิ้มทุกวัน — ทางกลับบ้านจะสนุกขึ้น"],
    "#애교쟁이": ["#affectionate", "#ขี้อ้อน"],
    "#환영인사": ["#welcomehome", "#ต้อนรับกลับบ้าน"],
    "구름 같은 잠꾸러기. 몽글몽글한 감촉이 특기입니다.": ["A cloud-like sleepyhead. Its specialty is that fluffy, cuddly touch.", "จอมขี้เซาราวก้อนเมฆ จุดเด่นคือสัมผัสนุ่มฟู"],
    "잠들기 어려운 밤이 많은 분께 — 안고 있으면 스르르 눈이 감겨요.": ["For restless nights — hold it and your eyes drift closed.", "สำหรับคืนที่หลับยาก — กอดแล้วตาจะค่อย ๆ ปิดเอง"],
    "#몽글몽글": ["#fluffy", "#นุ่มฟู"],
    "#잠친구": ["#sleepbuddy", "#เพื่อนนอน"],
    "호기심 많은 막내. 물가보다 이불 속을 더 좋아합니다.": ["The curious youngest. Prefers blankets to ponds.", "น้องเล็กขี้สงสัย ชอบผ้าห่มมากกว่าบ่อน้ำ"],
    "작고 귀여운 것에 약한 분께 — 책상 위 단짝으로도 좋아요.": ["For lovers of small cute things — great as a desk buddy too.", "สำหรับคนหลงของเล็กน่ารัก — เป็นเพื่อนบนโต๊ะทำงานก็ดี"],
    "#호기심": ["#curious", "#ขี้สงสัย"],
    "#막내": ["#youngest", "#น้องเล็ก"],
    "겨울을 좋아하는 몽상가. 창가에 앉혀두면 하루 종일 눈을 기다립니다.": ["A dreamer who loves winter. Sit it by the window and it waits all day for snow.", "นักฝันผู้รักฤดูหนาว วางไว้ริมหน้าต่าง จะรอหิมะทั้งวัน"],
    "계절을 타는 분께 — 겨울이 오는 게 기다려지게 돼요.": ["For the season-sensitive — you'll start looking forward to winter.", "สำหรับคนอินตามฤดู — จะเริ่มตั้งตารอฤดูหนาว"],
    "#몽상가": ["#dreamer", "#นักฝัน"],
    "#첫눈": ["#firstsnow", "#หิมะแรก"],
    "느긋한 미식가. 서두르는 법이 없어 곁에 있으면 마음이 느려집니다.": ["A laid-back gourmet. Never in a hurry — being near it slows your heart down.", "นักชิมสุดชิล ไม่เคยรีบ อยู่ใกล้แล้วใจจะช้าลง"],
    "쉼이 필요한 분께 — 바쁜 하루의 속도를 늦춰줘요.": ["For those needing rest — it slows down your busy day.", "สำหรับคนที่ต้องการพัก — ช่วยผ่อนจังหวะวันที่วุ่นวาย"],
    "#느긋함": ["#easygoing", "#ชิล"],
    "#쉼표": ["#pause", "#จังหวะพัก"],
    "이 친구 주문하기": ["Order this friend", "สั่งจองเพื่อนตัวนี้"],
    "Craft — 21일의 손끝": ["Craft — 21 Days of Handwork", "Craft — 21 วันแห่งงานฝีมือ"],
    "기계가 흉내 낼 수 없는": ["A 0.5mm tenderness", "ความอ่อนโยน 0.5 มม."],
    "0.5mm": ["no machine", "ที่เครื่องจักร"],
    "의 다정함": ["can imitate", "เลียนแบบไม่ได้"],
    "아이디토이의 인형은 재봉틀이 아니라 사람의 손끝에서 완성됩니다. 속눈썹 한 올, 코끝의 새틴 스티치 하나까지 장인이 직접 자수로 놓기 때문에 같은 친구라도 표정이 조금씩 다릅니다. 주문 후 스물하루, 느리지만 그래서 하나뿐입니다.": ["ID TOY plush are finished by hand, not by machine. Every eyelash and satin stitch on the nose is embroidered by an artisan, so even the same friend wears a slightly different face. Twenty-one days after your order — slow, and that's why it's one of a kind.", "ตุ๊กตา ID TOY เสร็จสมบูรณ์ด้วยมือ ไม่ใช่เครื่องจักร ขนตาทุกเส้นและสติทช์ที่ปลายจมูกปักโดยช่างฝีมือ เพื่อนตัวเดียวกันจึงมีหน้าต่างกันเล็กน้อย ยี่สิบเอ็ดวันหลังสั่ง — ช้า แต่เพราะแบบนั้นจึงมีเพียงหนึ่งเดียว"],
    "KC 안전확인 완료 원단 · 저자극 마이크로 충전솜": ["KC-certified fabrics · hypoallergenic micro stuffing", "ผ้าผ่านมาตรฐาน KC · ใยไมโครอ่อนโยน"],
    "자사 스톡 몸판 8종 — 커스텀 베이스로 활용": ["Our 8 stock bodies — used as custom bases", "โครงสต็อก 8 แบบของเรา — ใช้เป็นฐานคัสตอม"],
    "희망 수령 시기": ["Preferred Delivery", "ช่วงเวลารับที่ต้องการ"],
    "단추·플라스틱 파츠 없이 100% 자수 마감": ["100% embroidered finish, no buttons or plastic parts", "ปัก 100% ไร้กระดุมและชิ้นส่วนพลาสติก"],
    "30℃ 손세탁 가능 · 평생 무상 봉제 수선": ["Hand-washable at 30℃ · lifetime free seam repairs", "ซักมือได้ที่ 30℃ · ซ่อมตะเข็บฟรีตลอดชีพ"],
    "부클 원단의 밀도를 확인하는 검수 과정": ["Inspecting the density of bouclé fabric", "ตรวจสอบความหนาแน่นของผ้าบูเคล่"],
    "속눈썹까지 한 땀씩 놓는 아이 세이프 자수": ["Child-safe embroidery, stitch by stitch to the lashes", "งานปักปลอดภัยสำหรับเด็ก ทีละเข็มจนถึงขนตา"],
    "Moments — 함께한 계절": ["Moments — Seasons Together", "Moments — ฤดูกาลที่มีกัน"],
    "먼저 만난 가족들이 보내온 장면들": ["Scenes sent by families who met them first", "ภาพจากครอบครัวที่ได้พบเพื่อน ๆ ก่อนใคร"],
    "봄 소풍": ["Spring Picnic", "ปิกนิกฤดูใบไม้ผลิ"],
    "토끼 '봄이' · 오리 '노랑' · 강아지 '두부'": ["Bunny 'Bomi' · Duck 'Norang' · Puppy 'Dubu'", "กระต่าย 'โบมี' · เป็ด 'โนรัง' · หมา 'ดูบู'"],
    "봄의 정원": ["Spring Garden", "สวนฤดูใบไม้ผลิ"],
    "오리 '병아' · 토끼 '솜이' · 아기 양 '메에'": ["Duck 'Byeonga' · Bunny 'Somi' · Lamb 'Meh'", "เป็ด 'บยองอา' · กระต่าย 'ซมอี' · แกะ 'เมเอะ'"],
    "오후 세 시의 낮잠": ["Three O'Clock Nap", "งีบยามบ่ายสาม"],
    "강아지 '모카'": ["Puppy 'Mocha'", "ลูกหมา 'มอคค่า'"],
    "거실의 오랜 친구": ["Old Friends of the Living Room", "เพื่อนเก่าแก่ประจำห้องนั่งเล่น"],
    "아기 양 '구름' · 고양이 '재롱'": ["Lamb 'Gureum' · Cat 'Jaerong'", "แกะ 'กูรึม' · แมว 'แจรง'"],
    "첫눈 기다리기": ["Waiting for First Snow", "รอหิมะแรก"],
    "여우 '단풍' · 판다 '온溫'": ["Fox 'Danpung' · Panda 'On'", "จิ้งจอก 'ทันพุง' · แพนด้า 'อน'"],
    "잠들기 전 10분": ["Ten Minutes Before Sleep", "สิบนาทีก่อนนอน"],
    "드림 컬렉션 — 아기 양 '포근' · 토끼 '달래'": ["Dream Collection — Lamb 'Pogeun' · Bunny 'Dallae'", "ดรีมคอลเลกชัน — แกะ 'โพกึน' · กระต่าย 'ทัลแล'"],
    "“괜찮아, 내가 있잖아.”": ["“It's okay. I'm right here.”", "“ไม่เป็นไรนะ มีเราอยู่ทั้งคน”"],
    "아이가 처음 마음을 건네는 상대는, 자주, 인형입니다.": ["The first one a child opens their heart to is, so often, a plush.", "สิ่งแรกที่เด็กเปิดใจให้ บ่อยครั้งคือตุ๊กตา"],
    "마음이 가는 친구를": ["Found the friend", "เจอเพื่อนที่"],
    "찾으셨나요?": ["your heart picked?", "ถูกใจหรือยัง?"],
    "주문 예약 페이지에서 친구를 고르고 이름을 지어주세요. 선물 포장과 손글씨 카드도 함께 준비해 드립니다.": ["Choose a friend and give them a name on the reservation page. Gift wrapping and a handwritten card are included.", "เลือกเพื่อนและตั้งชื่อได้ที่หน้าสั่งจอง พร้อมห่อของขวัญและการ์ดเขียนมือ"],
    "주문 예약하러 가기": ["Go to Reservation", "ไปหน้าสั่งจอง"],

    /* ===== collection footer ===== */
    "이름을 지어주는 순간, 인형은 친구가 됩니다.": ["The moment you give it a name, a plush becomes a friend.", "วินาทีที่คุณตั้งชื่อ ตุ๊กตาก็กลายเป็นเพื่อน"],
    "브랜드 스토리": ["Brand Story", "เรื่องราวแบรนด์"],
    "카카오채널 @아이디토이": ["KakaoTalk @idtoy", "KakaoTalk @idtoy"],
    "Blog — 공방일지": ["Blog — Atelier Diary", "บล็อก — บันทึกโรงงาน"],
    "기업 굿즈·OEM 제작 문의는": ["For corporate goods & OEM inquiries, visit", "สอบถามงานองค์กรและ OEM ได้ที่"],
    "I.D. Toys 기업 페이지": ["the I.D. Toys business site", "เพจธุรกิจ I.D. Toys"],
    "에서": ["", ""],

    /* ===== order page ===== */
    "이 친구의 이름을": ["Would you give this friend", "ช่วยตั้งชื่อ"],
    "지어주시겠어요?": ["a name?", "ให้เพื่อนตัวนี้หน่อยได้ไหม?"],
    "예약서를 보내주시면 하루 안에 제작 일정과 입금 안내를 문자로 드립니다. 제작은 입금 확인일로부터 21일이 걸리며, 매달 서른 가족만 모십니다.": ["Send your reservation and we'll text the schedule and payment details within a day. Crafting takes 21 days from payment, and we welcome only thirty families a month.", "ส่งใบจองมา เราจะส่งตารางผลิตและวิธีชำระเงินภายในหนึ่งวัน ใช้เวลาผลิต 21 วันหลังชำระ และรับเพียงสามสิบครอบครัวต่อเดือน"],
    "Gift — 선물이 되는 순간": ["Gift — The Moment It Becomes a Present", "Gift — วินาทีที่กลายเป็นของขวัญ"],
    "상자를 여는 순간까지": ["A first hello, designed down to", "คำทักทายแรก ที่ออกแบบไว้"],
    "설계된": ["the moment", "จนถึงวินาที"],
    "첫인사": ["the box opens", "ที่เปิดกล่อง"],
    "모든 친구는 시그니처 기프트 박스에 담겨 떠납니다. 속지를 걷어내면 가장 먼저 눈이 마주치도록, 눕는 방향까지 정해서 포장합니다. 출산 선물·첫 생일·백일 답례품으로 준비하신다면 손글씨 카드를 무료로 동봉해 드려요.": ["Every friend leaves in our signature gift box, positioned so your eyes meet the moment the tissue lifts. For baby showers, first birthdays and celebrations, a handwritten card is included free.", "เพื่อนทุกตัวเดินทางในกล่องซิกเนเจอร์ จัดวางให้สบตาทันทีที่เปิดกระดาษ สำหรับของขวัญเด็กแรกเกิดหรือวันเกิดแรก แนบการ์ดเขียนมือให้ฟรี"],
    "시그니처 기프트 박스 & 새틴 리본": ["Signature gift box & satin ribbon", "กล่องซิกเนเจอร์และริบบิ้นซาติน"],
    "이름 자수 네임 태그": ["Embroidered name tag", "ป้ายชื่อปัก"],
    "손글씨 웰컴 카드 (문구 지정 가능)": ["Handwritten welcome card (your message)", "การ์ดต้อนรับเขียนมือ (กำหนดข้อความได้)"],
    "품질 보증서 & 관리 안내서": ["Quality certificate & care guide", "ใบรับประกันและคู่มือดูแล"],
    "Reservation — 주문 예약": ["Reservation — Order Reservation", "Reservation — สั่งจอง"],
    "이름은 자수로 새겨져": ["The name is embroidered", "ชื่อจะถูกปักไว้"],
    "왼발 바닥에 남습니다": ["on the left footpad", "ที่ฝ่าเท้าซ้าย"],
    "아래에 이름을 적으면 태그에 미리 새겨 볼 수 있어요. 이름은 제작 시작 전까지 언제든 바꿀 수 있습니다.": ["Type a name below to preview it on the tag. You can change it anytime before crafting begins.", "พิมพ์ชื่อด้านล่างเพื่อดูตัวอย่างบนป้าย เปลี่ยนชื่อได้ทุกเมื่อก่อนเริ่มผลิต"],
    "이름을 지어주세요": ["Give them a name", "ตั้งชื่อให้หน่อยนะ"],
    "주문 예약서": ["Order Reservation", "ใบสั่งจอง"],
    "함께할 친구": ["Your Friend", "เพื่อนที่จะไปด้วย"],
    "친구를 선택해 주세요": ["Choose a friend", "เลือกเพื่อนของคุณ"],
    "아직 고민 중이에요": ["Still deciding", "ยังเลือกไม่ได้"],
    "지어줄 이름": ["Name to Give", "ชื่อที่จะตั้งให้"],
    "— 자수 태그에 새겨집니다 (한글·영문 8자 이내)": ["— embroidered on the tag (up to 8 characters)", "— ปักบนป้าย (ไม่เกิน 8 ตัวอักษร)"],
    "예) 보리, Coco": ["e.g. Bori, Coco", "เช่น โบริ, Coco"],
    "주문자 성함": ["Your Name", "ชื่อผู้สั่ง"],
    "선물 포장으로 준비할게요": ["Please gift-wrap it", "ห่อของขวัญให้ด้วย"],
    "남기고 싶은 말": ["Message", "ข้อความถึงเรา"],
    "카드에 담을 문구, 궁금한 점을 적어주세요": ["Card message, questions — anything at all", "ข้อความในการ์ด หรือคำถามต่าง ๆ"],
    "필수 항목을 확인해 주세요.": ["Please check the required fields.", "กรุณาตรวจสอบช่องที่จำเป็น"],
    "예약서 보내기": ["Send Reservation", "ส่งใบจอง"],
    "예약서 접수만으로는 결제가 이루어지지 않으며, 안내 문자 확인 후 확정됩니다.": ["Sending a reservation is not a payment; it's confirmed after our text message.", "การส่งใบจองยังไม่ใช่การชำระเงิน ยืนยันหลังได้รับข้อความจากเรา"],
    "예약서가 도착했습니다": ["Your reservation has arrived", "ได้รับใบจองแล้ว"],
    "소중한 예약 감사합니다. 하루 안에 제작 일정을 문자로 안내드릴게요.": ["Thank you for your reservation. We'll text the crafting schedule within a day.", "ขอบคุณสำหรับการจอง เราจะส่งตารางผลิตให้ภายในหนึ่งวัน"],
    "새 예약서 쓰기": ["Write a new reservation", "เขียนใบจองใหม่"],
    "더 궁금한 점은 카카오채널": ["More questions? Reach us on KakaoTalk", "มีคำถามเพิ่ม ติดต่อ KakaoTalk"],
    "@아이디토이": ["@idtoy", "@idtoy"],
    "로 편하게 물어봐 주세요.": ["anytime.", "ได้ตลอดเลย"],
    "가격은 어디서 확인하나요?": ["Where can I see prices?", "ดูราคาได้ที่ไหน?"],
    "친구와 사양(사이즈·의상·자수)에 따라 달라져서, 예약서 접수 후 안내 문자로 정확한 금액을 알려드립니다. 예약서 접수만으로는 결제가 이루어지지 않으니 부담 없이 보내주세요.": ["Prices vary by friend and spec (size, outfit, embroidery), so we text the exact amount after your reservation. Sending one isn't a payment — feel free.", "ราคาขึ้นกับแบบและสเปก (ขนาด ชุด งานปัก) เราส่งราคาแน่นอนทางข้อความหลังได้รับใบจอง การส่งใบจองยังไม่ใช่การชำระเงิน ส่งมาได้สบายใจ"],
    "제작 기간은 얼마나 걸리나요?": ["How long does crafting take?", "ใช้เวลาผลิตนานแค่ไหน?"],
    "입금 확인일로부터 21일입니다. 표정 자수와 검수에 시간을 들이기 때문에 단축은 어렵지만, 예정일보다 늦어지는 일은 없도록 매달 서른 가족만 예약을 받습니다.": ["21 days from payment confirmation. Face embroidery and inspection take time, so it can't be rushed — but to never run late, we accept only thirty families a month.", "21 วันนับจากยืนยันชำระเงิน งานปักหน้าและการตรวจสอบใช้เวลา เร่งไม่ได้ แต่เพื่อไม่ให้ล่าช้า เรารับเพียงสามสิบครอบครัวต่อเดือน"],
    "세탁은 어떻게 하나요?": ["How do I wash it?", "ซักอย่างไร?"],
    "30℃ 이하 미지근한 물에 중성세제로 부드럽게 손세탁해 주세요. 그늘에서 뉘어 말린 뒤 결을 따라 빗어주면 처음의 감촉이 돌아옵니다. 관리 안내서를 함께 보내드려요.": ["Hand-wash gently in lukewarm water (under 30℃) with mild detergent. Dry flat in the shade and brush along the fur — the original touch returns. A care guide is included.", "ซักมือเบา ๆ ในน้ำอุ่นต่ำกว่า 30℃ ด้วยน้ำยาสูตรอ่อน ตากแนวนอนในที่ร่ม แล้วแปรงตามแนวขน สัมผัสเดิมจะกลับมา มีคู่มือดูแลแนบไปให้"],
    "이름은 어디에 새겨지나요?": ["Where is the name embroidered?", "ชื่อปักตรงไหน?"],
    "왼발 바닥의 코튼 네임 태그에 이름을 자수로 새깁니다. 한글·영문 8자까지 가능하며, 예약서의 이름은 제작 시작 전까지 변경하실 수 있어요.": ["On a cotton tag on the left footpad. Up to 8 characters, and you can change it anytime before crafting begins.", "บนป้ายผ้าฝ้ายที่ฝ่าเท้าซ้าย ยาวได้ถึง 8 ตัวอักษร และเปลี่ยนได้ก่อนเริ่มผลิต"],
    "수선(AS)도 되나요?": ["Do you offer repairs?", "มีบริการซ่อมไหม?"],
    "네, 봉제선 뜯어짐·자수 풀림은 평생 무상으로 수선해 드립니다. 오래 함께한 친구일수록 반갑습니다. 왕복 배송비만 부담해 주세요.": ["Yes — torn seams and loose embroidery are repaired free, for life. The longer you've been together, the happier we are to see them. You cover only round-trip shipping.", "ได้ — ตะเข็บขาดหรือปักหลุด ซ่อมฟรีตลอดชีพ ยิ่งอยู่ด้วยกันนาน เรายิ่งดีใจที่ได้เจอ จ่ายแค่ค่าส่งไปกลับ"],
    "영·유아가 사용해도 안전한가요?": ["Is it safe for infants?", "ปลอดภัยสำหรับทารกไหม?"],
    "모든 원단과 충전솜은 KC 안전확인을 마쳤고, 단추·플라스틱 눈 대신 전부 자수로 마감해 삼킴 위험 부품이 없습니다. 신생아 선물로도 안심하고 준비하실 수 있어요.": ["All fabrics and stuffing are KC-certified, and everything is embroidered instead of buttons or plastic eyes — no swallowable parts. Safe even as a newborn gift.", "ผ้าและใยยัดทุกชิ้นผ่านมาตรฐาน KC และปักแทนกระดุมหรือตาพลาสติกทั้งหมด ไม่มีชิ้นส่วนเสี่ยงกลืน ให้เป็นของขวัญเด็กแรกเกิดได้อย่างมั่นใจ"]
  };

  var idx = lang === "en" ? 0 : 1;

  function t(str) {
    if (lang === "ko") return str;
    var key = String(str).replace(/\s+/g, " ").trim();
    var hit = D[key];
    return hit ? hit[idx] : str;
  }

  /* ---------- apply to document ---------- */
  function translateTextNodes(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var p = node.parentNode && node.parentNode.nodeName;
        if (p === "SCRIPT" || p === "STYLE") return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var m = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
      if (!m || !m[2]) continue;
      var key = m[2].replace(/\s+/g, " ");
      var hit = D[key];
      if (hit !== undefined) {
        node.nodeValue = m[1] + hit[idx] + m[3];
      }
    }
  }

  function translateAttributes() {
    document.querySelectorAll("[placeholder]").forEach(function (el) {
      el.setAttribute("placeholder", t(el.getAttribute("placeholder")));
    });
  }

  if (lang !== "ko") {
    document.documentElement.lang = lang;
    translateTextNodes(document.body);
    translateAttributes();
  }

  /* expose for dynamic messages in site.js */
  window.IDTOY_I18N = { lang: lang, t: t };

  /* ---------- switcher ---------- */
  var sw = document.getElementById("langSwitch");
  if (sw) {
    sw.querySelectorAll(".lang__btn").forEach(function (btn) {
      if (btn.dataset.lang === lang) btn.classList.add("is-on");
      btn.addEventListener("click", function () {
        if (btn.dataset.lang === lang) return;
        localStorage.setItem(LS_KEY, btn.dataset.lang);
        location.reload();
      });
    });
  }
})();
