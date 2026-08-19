/**
 * I.D. Toys 견적 문의 수신 스크립트
 * ─────────────────────────────────
 * 구글 시트에 문의를 한 줄씩 저장하고, 이메일로 알림을 보냅니다.
 * 설치 방법은 같은 폴더의 "구글시트-연동-가이드.md" 참고.
 */

var SHEET_NAME = "견적문의";                 // 문의가 쌓일 시트 탭 이름
var NOTIFY_EMAIL = "lifeyes1002@gmail.com";  // 알림 받을 이메일

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // 첫 행(머리글)이 없으면 생성 — 한국어/태국어 병기
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

    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.company || "", p.manager || "", p.email || "", p.phone || "",
      p.type || "", p.qty || "", p.when || "", p.message || ""
    ]);

    // 이메일 알림
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "[I.D. Toys] 새 견적 문의 — " + (p.company || "회사명 미입력"),
      htmlBody:
        '<div style="font-family:sans-serif;max-width:560px">' +
        '<h2 style="color:#4A3B30">🧸 새 견적 문의가 도착했습니다</h2>' +
        '<table cellpadding="8" style="border-collapse:collapse;width:100%">' +
        row("회사명", p.company) +
        row("담당자", p.manager) +
        row("이메일", p.email) +
        row("연락처", p.phone) +
        row("제작방식", p.type) +
        row("예상수량", p.qty) +
        row("희망납기", p.when) +
        row("프로젝트 설명", p.message) +
        row("언어", p.lang) +
        "</table>" +
        '<p style="color:#9C8B7B;font-size:12px">이 메일은 idtoy-website 견적 폼에서 자동 발송되었습니다.</p>' +
        "</div>"
    });

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function row(label, value) {
  return (
    '<tr><td style="border:1px solid #eee;background:#FFF4DC;white-space:nowrap"><b>' +
    label + "</b></td>" +
    '<td style="border:1px solid #eee">' +
    String(value || "-").replace(/</g, "&lt;").replace(/\n/g, "<br>") +
    "</td></tr>"
  );
}

/** 브라우저로 웹앱 URL을 직접 열었을 때 확인용 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "I.D. Toys quote endpoint OK" }))
    .setMimeType(ContentService.MimeType.JSON);
}
