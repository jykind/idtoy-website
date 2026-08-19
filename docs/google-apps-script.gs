/**
 * I.D. Toy 견적 문의 수신 스크립트 v3
 * ─────────────────────────────────────
 * 문의가 접수되면:
 *  1) 구글 시트에 한 줄 저장 — 머리글(한/태 병기)은 매번 자동 점검·교체 (시트 비울 필요 없음)
 *  2) 고객에게 → 고객의 언어(한국어/영어/태국어)로 접수 확인 메일 자동 발송
 *  3) 관리자에게 → 한국어/태국어 병기 알림 + 내용 자동 번역 병기
 *     (한국어 문의→태국어 번역 / 태국어 문의→한국어 번역 / 영어 문의→양쪽 번역)
 *
 * 설치·배포 방법은 같은 폴더의 "구글시트-연동-가이드.md" 참고.
 */

var SHEET_NAME = "견적문의";                 // 문의가 쌓일 시트 탭 이름
var ADMIN_EMAIL = "lifeyes1002@gmail.com";   // 관리자(알림 수신) 이메일
var BRAND_NAME = "I.D. Toy";

var HEADERS = [
  "접수시각\nเวลาที่ได้รับ",
  "회사명\nชื่อบริษัท",
  "담당자\nผู้ติดต่อ",
  "이메일\nอีเมล",
  "연락처\nเบอร์ติดต่อ",
  "제작방식\nรูปแบบการผลิต",
  "예상수량\nจำนวนโดยประมาณ",
  "희망납기\nกำหนดส่งที่ต้องการ",
  "프로젝트 설명\nรายละเอียดโปรเจกต์"
];

/* ══════════════════════════════════════════
   메인: 폼 수신
   ══════════════════════════════════════════ */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var p = (e && e.parameter) || {};
    var lang = detectLang(p);

    /* ── 1. 시트에 기록 ── */
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    ensureHeader(sheet);

    sheet.appendRow([
      new Date(),
      p.company || "", p.manager || "", p.email || "", p.phone || "",
      p.type || "", p.qty || "", p.when || "", p.message || ""
    ]);

    /* ── 2. 고객에게 접수 확인 메일 (고객 언어로) ── */
    try {
      if (isValidEmail(p.email)) {
        var c = customerTemplate(lang, p);
        MailApp.sendEmail({
          to: p.email,
          replyTo: ADMIN_EMAIL,
          name: BRAND_NAME,
          subject: c.subject,
          htmlBody: c.html
        });
      }
    } catch (mailErr) {
      // 고객 메일 실패해도 접수 자체는 유지
    }

    /* ── 3. 관리자에게 알림 메일 (한/태 병기 + 자동 번역) ── */
    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        name: BRAND_NAME + " Website",
        subject: "[I.D. Toy 새 견적 문의 · คำขอใหม่] " + (p.company || "회사명 미입력") +
                 " - " + shorten(p.type, 20) + " (" + (p.qty || "수량 미정") + ")",
        htmlBody: adminTemplate(lang, p)
      });
    } catch (mailErr2) {}

    return jsonOut({ result: "success" });

  } catch (err) {
    return jsonOut({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ══════════════════════════════════════════
   머리글 자동 점검 — 구버전이면 교체 (v3)
   ══════════════════════════════════════════ */
function ensureHeader(sheet) {
  var needWrite = false;

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    needWrite = true;
  } else {
    var a1 = String(sheet.getRange(1, 1).getValue());
    if (a1.indexOf("เวลา") === -1) {          // 태국어가 없으면 구버전 머리글
      if (a1.indexOf("접수시각") !== -1) {
        // 구버전 머리글 → 그 자리에서 교체
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      } else {
        // 머리글 자체가 없음(1행이 데이터) → 위에 새 행 삽입
        sheet.insertRowBefore(1);
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      }
      needWrite = true;
    }
  }

  if (needWrite) {
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight("bold").setBackground("#FFE9A8").setVerticalAlignment("middle");
    sheet.setFrozenRows(1);
  }
}

/* ══════════════════════════════════════════
   언어 감지: 사이트가 보낸 lang 값 우선,
   없으면 입력 텍스트의 문자 범위로 판별
   ══════════════════════════════════════════ */
function detectLang(p) {
  var l = String(p.lang || "").toLowerCase();
  if (l === "ko" || l === "en" || l === "th") return l;
  var t = (p.message || "") + " " + (p.company || "") + " " + (p.manager || "");
  if (/[฀-๿]/.test(t)) return "th";   // 태국 문자
  if (/[가-힣]/.test(t)) return "ko";   // 한글
  return "en";
}

/* ══════════════════════════════════════════
   고객 접수 확인 메일 — 언어별 템플릿
   ══════════════════════════════════════════ */
function customerTemplate(lang, p) {
  var T = {
    ko: {
      subject: "[I.D. Toy] 견적 문의가 정상적으로 접수되었습니다.",
      greeting: esc(p.manager || "고객") + "님, 안녕하세요! 🧸<br><b>I.D. Toy</b>입니다.",
      intro: "보내주신 견적 문의가 정상적으로 접수되었습니다.<br>아래 내용으로 확인하고 있어요.",
      labels: ["회사명", "제작 방식", "예상 수량", "희망 납기"],
      closing: "확인 후 <b>1영업일 이내</b>에 상세 견적 및 일정을 안내해 드리겠습니다.",
      sign: "따뜻한 인형을 만드는 사람들,<br><b>I.D. Toy Co., Ltd.</b> — Since 1980",
      footer: "본 메일은 접수 확인 메일입니다. 문의는 이 메일에 회신하시면 담당자에게 전달됩니다."
    },
    en: {
      subject: "[I.D. Toy] Quotation Inquiry Received Successfully",
      greeting: "Hello " + esc(p.manager || "there") + "! 🧸<br>This is <b>I.D. Toy</b>.",
      intro: "Your quotation inquiry has been received successfully.<br>Here is a summary of your request.",
      labels: ["Company", "Production Type", "Estimated Quantity", "Target Delivery"],
      closing: "We will review your inquiry and get back to you with a detailed quotation and schedule <b>within 1 business day</b>.",
      sign: "The people who make warm plush toys,<br><b>I.D. Toy Co., Ltd.</b> — Since 1980",
      footer: "This is an automated confirmation email. Reply to this email to reach our team directly."
    },
    th: {
      subject: "[I.D. Toy] ได้รับคำขอใบเสนอราคาเรียบร้อยแล้ว",
      greeting: "สวัสดีค่ะ คุณ" + esc(p.manager || "ลูกค้า") + " 🧸<br>จาก <b>I.D. Toy</b> ค่ะ",
      intro: "เราได้รับคำขอใบเสนอราคาของคุณเรียบร้อยแล้ว<br>สรุปรายละเอียดคำขอของคุณดังนี้ค่ะ",
      labels: ["บริษัท", "รูปแบบการผลิต", "จำนวนโดยประมาณ", "กำหนดส่งที่ต้องการ"],
      closing: "ทีมงานจะตรวจสอบและส่งใบเสนอราคาพร้อมกำหนดการโดยละเอียดให้<b>ภายใน 1 วันทำการ</b>ค่ะ",
      sign: "ทีมผู้ผลิตตุ๊กตาอบอุ่น,<br><b>I.D. Toy Co., Ltd.</b> — Since 1980",
      footer: "อีเมลนี้เป็นการยืนยันรับเรื่องอัตโนมัติ หากต้องการติดต่อทีมงาน สามารถตอบกลับอีเมลนี้ได้เลยค่ะ"
    }
  };
  var t = T[lang] || T.en;
  var values = [p.company, p.type, p.qty, p.when];

  var rows = "";
  for (var i = 0; i < t.labels.length; i++) {
    rows +=
      '<tr>' +
      '<td style="padding:10px 14px;background:#FFF4DC;border-radius:8px 0 0 8px;white-space:nowrap;font-weight:bold;color:#4A3B30;font-size:13px">' + t.labels[i] + '</td>' +
      '<td style="padding:10px 14px;background:#FFFDF6;border-radius:0 8px 8px 0;color:#4A3B30;font-size:13px">' + esc(values[i] || "-") + '</td>' +
      '</tr><tr><td style="height:6px" colspan="2"></td></tr>';
  }

  var html =
    '<div style="background:#FFF9F0;padding:32px 16px;font-family:\'Apple SD Gothic Neo\',\'Malgun Gothic\',Tahoma,sans-serif">' +
    '<div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(74,59,48,0.10)">' +
    '<div style="background:#FFE9A8;padding:18px 28px;text-align:center">' +
    '<span style="font-size:22px">🧸</span> ' +
    '<span style="font-weight:800;font-size:18px;color:#4A3B30;letter-spacing:0.5px">I.D. TOY</span>' +
    '<div style="font-size:10px;letter-spacing:2px;color:#8a6f3f;margin-top:2px">PLUSH MANUFACTURER · SINCE 1980</div>' +
    '</div>' +
    '<div style="padding:30px 28px;color:#4A3B30;line-height:1.8;font-size:14px">' +
    '<p style="margin:0 0 14px;font-size:16px">' + t.greeting + '</p>' +
    '<p style="margin:0 0 22px;color:#6E5C4D">' + t.intro + '</p>' +
    '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;margin:0 0 22px">' + rows + '</table>' +
    '<p style="margin:0 0 26px;color:#6E5C4D">' + t.closing + '</p>' +
    '<p style="margin:0;color:#4A3B30">' + t.sign + '</p>' +
    '</div>' +
    '<div style="background:#FFF4DC;padding:14px 28px;text-align:center;font-size:11px;color:#9C8B7B;line-height:1.6">' +
    t.footer + '<br>I.D. Toy Co., Ltd. · 199 Moo 2, T. Taopoon, A. Photharam, Ratchaburi, Thailand' +
    '</div>' +
    '</div></div>';

  return { subject: t.subject, html: html };
}

/* ══════════════════════════════════════════
   관리자 알림 메일 — 한국어/태국어 병기 (v3)
   내용 번역: ko문의→th번역, th문의→ko번역, en문의→ko+th번역
   ══════════════════════════════════════════ */
function adminTemplate(lang, p) {
  // 이 문의 내용에 붙일 번역 대상 언어
  var targets = lang === "ko" ? ["th"] : lang === "th" ? ["ko"] : ["ko", "th"];
  var langLabel = { ko: "한국어 · เกาหลี", en: "영어 · อังกฤษ", th: "태국어 · ไทย" }[lang] || lang;

  var rows =
    aRow("접수시각", "เวลาที่ได้รับ", Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm") + " (TH)") +
    aRow("회사명", "ชื่อบริษัท", p.company, targets) +
    aRow("담당자", "ผู้ติดต่อ", p.manager, targets) +
    aRow("이메일", "อีเมล", p.email) +
    aRow("연락처", "เบอร์ติดต่อ", p.phone) +
    aRow("제작방식", "รูปแบบการผลิต", p.type, targets) +
    aRow("예상수량", "จำนวนโดยประมาณ", p.qty, targets) +
    aRow("희망납기", "กำหนดส่ง", p.when) +
    aRow("프로젝트 설명", "รายละเอียดโปรเจกต์", p.message, targets) +
    aRow("문의 언어", "ภาษาที่ใช้", langLabel);

  return (
    '<div style="font-family:\'Malgun Gothic\',Tahoma,sans-serif;max-width:640px">' +
    '<h2 style="color:#4A3B30;margin-bottom:4px">🧸 새 견적 문의가 도착했습니다</h2>' +
    '<p style="color:#8a6f3f;margin:0 0 14px;font-size:14px">มีคำขอใบเสนอราคาใหม่เข้ามา</p>' +
    '<p style="color:#5B84B5;font-size:12.5px;margin:0 0 12px">🌐 ' + langLabel + ' 문의 — 아래 표에 자동 번역을 함께 표시했습니다 · แสดงคำแปลอัตโนมัติไว้ในตารางด้านล่าง</p>' +
    '<table cellpadding="8" style="border-collapse:collapse;width:100%">' + rows + "</table>" +
    '<p style="color:#9C8B7B;font-size:11.5px;line-height:1.7">고객에게는 ' + langLabel.split(" · ")[0] + ' 접수 확인 메일이 자동 발송되었습니다.<br>' +
    'ลูกค้าได้รับอีเมลยืนยันรับเรื่องอัตโนมัติแล้ว · idtoy-website 견적 폼 자동 발송</p>' +
    "</div>"
  );
}

/** 관리자 표 한 줄 — 라벨 한/태 병기, targets에 있는 언어로 번역 병기 */
function aRow(labelKo, labelTh, value, targets) {
  var raw = String(value || "-").trim();
  if (raw === "") raw = "-";
  var display = esc(raw).replace(/\n/g, "<br>");

  if (targets && raw !== "-") {
    var boxes = "";
    for (var i = 0; i < targets.length; i++) {
      var target = targets[i];
      try {
        var translated = LanguageApp.translate(raw, "", target);
        if (translated && norm(translated) !== norm(raw)) {
          var tag = target === "ko" ? "🇰🇷 한국어" : "🇹🇭 ไทย";
          var bg = target === "ko" ? "#EEF5FC" : "#FFF0EA";
          var col = target === "ko" ? "#2c5988" : "#a5502f";
          boxes +=
            '<div style="margin-top:6px;padding:6px 10px;background:' + bg + ';border-radius:6px;color:' + col + ';font-size:12px">' +
            "<b>[" + tag + "]</b> " + esc(translated).replace(/\n/g, "<br>") + "</div>";
        }
      } catch (trErr) { /* 번역 실패 시 원문만 */ }
    }
    if (boxes) display = '<div style="color:#333">' + display + "</div>" + boxes;
  }

  return (
    '<tr><td style="border:1px solid #eee;background:#FFF4DC;white-space:nowrap;vertical-align:top;font-size:12.5px;line-height:1.5"><b>' +
    labelKo + "</b><br><span style='color:#8a6f3f;font-weight:normal'>" + labelTh + "</span></td>" +
    '<td style="border:1px solid #eee;font-size:13px">' + display + "</td></tr>"
  );
}

/* ══════════════════════════════════════════
   유틸
   ══════════════════════════════════════════ */
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || ""));
}
function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function norm(s) {
  return String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
}
function shorten(s, n) {
  s = String(s || "방식 미선택");
  return s.length > n ? s.slice(0, n) + "…" : s;
}
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 브라우저로 웹앱 URL을 직접 열었을 때 확인용 */
function doGet() {
  return jsonOut({ status: "I.D. Toy quote endpoint OK (v3)" });
}
