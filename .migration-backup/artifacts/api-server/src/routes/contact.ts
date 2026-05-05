import { Router, Request, Response } from "express";
import {
  getTransporter,
  smtpFrom,
  contactTo,
  contactEmailHtml,
} from "../lib/mailer";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    res.status(400).json({ message: "Semua field wajib diisi." });
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    req.log.warn("SMTP belum dikonfigurasi — SMTP_EMAIL atau SMTP_APP_PASSWORD kosong");
    res.status(503).json({ message: "Layanan email belum dikonfigurasi." });
    return;
  }

  try {
    await transporter.sendMail({
      from:    smtpFrom(),
      to:      contactTo(),
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html:    contactEmailHtml(name, email, subject, message),
    });

    req.log.info({ from: email, subject }, "Contact email sent");
    res.json({ message: "Pesan berhasil dikirim!" });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ message: "Gagal mengirim pesan. Coba lagi nanti." });
  }
});

export default router;
