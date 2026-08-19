/**
 * I.D. Toys 견적 문의 수신 스크립트 v2
 * ─────────────────────────────────────
 * 문의가 접수되면:
 *  1) 구글 시트에 한 줄 저장 (머리글 한/태 병기)
 *  2) 고객에게 → 고객의 언어(한국어/영어/태국어)로 접수 확인 메일 자동 발송
 *  3) 관리자에게 → 전체 내용 + 외국어는 한국어 자동 번역을 붙여 알림 메일 발송
 *
 * 설치·배포 방법은 같은 폴더의 "구글시트-연동-가이드.md" 참고.
 */

var SHEET_NAME = "견적문의";                 // 문의가 쌓일 시트 탭 이름
var ADMIN_EMAIL = "lifeyes1002@gmail.com";   // 관리자(알림 수신) 이메일
var BRAND_NAME = "I.D. Toys";

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

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "접수시각\nเวลาที่ได้รับ",
        "회사명\nชื่อบริษัท",
        "담당자\nผู้ติดต่อ",
        "이메일\nอีเมล",
        "연락처\nเบอร์ติดต่อ",
        "제작방식\nรูปแบบการผลิต",
        "예상수량\nจำนวนโดยประมาณ",
        "희망납기\nกำหนดส่งที่ต้องการ",
        "프로젝트 설명\nรายละเอียดโปรเจกต์"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#FFE9A8").setVerticalAlignment("middle");
      sheet.setFrozenRows(1);
    }

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

    /* ── 3. 관리자에게 알림 메일 (외국어 → 한국어 번역 병기) ── */
    try {
      MailApp.sendEmail({
        to: ADMIN_EMAIL,
        name: BRAND_NAME + " 웹사이트",
        subject: "[I.D. Toys 새 견적 문의] " + (p.company || "회사명 미입력") +
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
      subject: "[I.D. Toys] 견적 문의가 정상적으로 접수되었습니다.",
      greeting: esc(p.manager || "고객") + "님, 안녕하세요! 🧸<br><b>I.D. Toys</b>입니다.",
      intro: "보내주신 견적 문의가 정상적으로 접수되었습니다.<br>아래 내용으로 확인하고 있어요.",
      labels: ["회사명", "제작 방식", "예상 수량", "희망 납기"],
      closing: "확인 후 <b>1영업일 이내</b>에 상세 견적 및 일정을 안내해 드리겠습니다.",
      sign: "따뜻한 인형을 만드는 사람들,<br><b>I.D. Toys Co., Ltd.</b> — Since 1980",
      footer: "본 메일은 발신 전용 접수 확인 메일입니다. 문의는 이 메일에 회신하시면 담당자에게 전달됩니다."
    },
    en: {
      subject: "[I.D. Toys] Quotation Inquiry Received Successfully",
      greeting: "Hello " + esc(p.manager || "there") + "! 🧸<br>This is <b>I.D. Toys</b>.",
      intro: "Your quotation inquiry has been received successfully.<br>Here is a summary of your request.",
      labels: ["Company", "Production Type", "Estimated Quantity", "Target Delivery"],
      closing: "We will review your inquiry and get back to you with a detailed quotation and schedule <b>within 1 business day</b>.",
      sign: "The people who make warm plush toys,<br><b>I.D. Toys Co., Ltd.</b> — Since 1980",
      footer: "This is an automated confirmation email. Reply to this email to reach our team directly."
    },
    th: {
      subject: "[I.D. Toys] ได้รับคำขอใบเสนอราคาเรียบร้อยแล้ว",
      greeting: "สวัสดีค่ะ คุณ" + esc(p.manager || "ลูกค้า") + " 🧸<br>จาก <b>I.D. Toys</b> ค่ะ",
      intro: "เราได้รับคำขอใบเสนอราคาของคุณเรียบร้อยแล้ว<br>สรุปรายละเอียดคำขอของคุณดังนี้ค่ะ",
      labels: ["บริษัท", "รูปแบบการผลิต", "จำนวนโดยประมาณ", "กำหนดส่งที่ต้องการ"],
      closing: "ทีมงานจะตรวจสอบและส่งใบเสนอราคาพร้อมกำหนดการโดยละเอียดให้<b>ภายใน 1 วันทำการ</b>ค่ะ",
      sign: "ทีมผู้ผลิตตุ๊กตาอบอุ่น,<br><b>I.D. Toys Co., Ltd.</b> — Since 1980",
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
    // 상단 브랜드 바
    '<div style="background:#FFE9A8;padding:18px 28px;text-align:center">' +
    '<span style="font-size:22px">🧸</span> ' +
    '<span style="font-weight:800;font-size:18px;color:#4A3B30;letter-spacing:0.5px">I.D. TOYS</span>' +
    '<div style="font-size:10px;letter-spacing:2px;color:#8a6f3f;margin-top:2px">PLUSH MANUFACTURER · SINCE 1980</div>' +
    '</div>' +
    // 본문
    '<div style="padding:30px 28px;color:#4A3B30;line-height:1.8;font-size:14px">' +
    '<p style="margin:0 0 14px;font-size:16px">' + t.greeting + '</p>' +
    '<p style="margin:0 0 22px;color:#6E5C4D">' + t.intro + '</p>' +
    '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;margin:0 0 22px">' + rows + '</table>' +
    '<p style="margin:0 0 26px;color:#6E5C4D">' + t.closing + '</p>' +
    '<p style="margin:0;color:#4A3B30">' + t.sign + '</p>' +
    '</div>' +
    // 푸터
    '<div style="background:#FFF4DC;padding:14px 28px;text-align:center;font-size:11px;color:#9C8B7B;line-height:1.6">' +
    t.footer + '<br>I.D. Toys Co., Ltd. · 199 Moo 2, T. Taopoon, A. Photharam, Ratchaburi, Thailand' +
    '</div>' +
    '</div></div>';

  return { subject: t.subject, html: html };
}

/* ══════════════════════════════════════════
   관리자 알림 메일 — 외국어는 한국어 번역 병기
   ══════════════════════════════════════════ */
function adminTemplate(lang, p) {
  var needTranslate = (lang !== "ko");
  var langLabel = { ko: "한국어", en: "영어", th: "태국어" }[lang] || lang;

  var rows =
    adminRow("접수시각", Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy-MM-dd HH:mm") + " (태국 기준)") +
    adminRow("회사명", p.company, needTranslate) +
    adminRow("담당자", p.manager, needTranslate) +
    adminRow("이메일", p.email) +
    adminRow("연락처", p.phone) +
    adminRow("제작방식", p.type, needTranslate) +
    adminRow("예상수량", p.qty, needTranslate) +
    adminRow("희망납기", p.when) +
    adminRow("프로젝트 설명", p.message, needTranslate) +
    adminRow("언어", langLabel + " (" + lang + ")");

  return (
    '<div style="font-family:\'Malgun Gothic\',sans-serif;max-width:600px">' +
    '<h2 style="color:#4A3B30">🧸 새 견적 문의가 도착했습니다</h2>' +
    (needTranslate
      ? '<p style="color:#5B84B5;font-size:13px">🌐 ' + langLabel + ' 문의입니다 — 외국어 항목에는 <b>[한국어 자동 번역]</b>을 함께 표시했습니다.</p>'
      : "") +
    '<table cellpadding="8" style="border-collapse:collapse;width:100%">' + rows + "</table>" +
    '<p style="color:#9C8B7B;font-size:12px">고객에게는 ' + langLabel + ' 접수 확인 메일이 자동 발송되었습니다.<br>이 메일은 idtoy-website 견적 폼에서 자동 발송되었습니다.</p>' +
    "</div>"
  );
}

/** 관리자 표 한 줄. translate=true이고 값에 외국어가 있으면 한국어 번역 병기 */
function adminRow(label, value, translate) {
  var raw = String(value || "-");
  var display = esc(raw).replace(/\n/g, "<br>");

  if (translate && raw !== "-" && raw.trim() !== "" && !/^[가-힣\s\d\W]*$/.test(raw)) {
    try {
      var translated = LanguageApp.translate(raw, "", "ko");
      if (translated && translated.trim() !== raw.trim()) {
        display =
          '<div style="color:#333">' + esc(raw).replace(/\n/g, "<br>") + "</div>" +
          '<div style="margin-top:6px;padding:6px 10px;background:#EEF5FC;border-radius:6px;color:#2c5988;font-size:12px">' +
          "<b>[한국어 번역]</b> " + esc(translated).replace(/\n/g, "<br>") + "</div>";
      }
    } catch (trErr) { /* 번역 실패 시 원문만 표시 */ }
  }

  return (
    '<tr><td style="border:1px solid #eee;background:#FFF4DC;white-space:nowrap;vertical-align:top"><b>' +
    label + "</b></td>" +
    '<td style="border:1px solid #eee">' + display + "</td></tr>"
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
function shorten(s, n) {
  s = String(s || "방식 미선택");
  return s.length > n ? s.slice(0, n) + "…" : s;
}
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** 브라우저로 웹앱 URL을 직접 열었을 때 확인용 */
function doGet() {
  return jsonOut({ status: "I.D. Toys quote endpoint OK (v2)" });
}
