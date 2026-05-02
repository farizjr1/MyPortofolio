import { Profile } from "../models/Profile";
import { Portfolio } from "../models/Portfolio";
import { logger } from "./logger";

export async function seedDatabase() {
  try {
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create({
        name: "Fariz Jelang Ramadhan",
        title: "Full-Stack Developer & Accounting Professional",
        bio: "Saya adalah seorang profesional muda yang memiliki keahlian di bidang akuntansi dan pengembangan teknologi. Dengan latar belakang pendidikan akuntansi dan pengalaman di dunia kerja, saya memiliki pemahaman mendalam tentang laporan keuangan, perpajakan, dan analisis data bisnis.\n\nSelain itu, saya juga mengembangkan kemampuan di bidang teknologi informasi, khususnya pengembangan aplikasi web dan sistem informasi akuntansi. Saya percaya bahwa kombinasi keahlian akuntansi dan teknologi adalah kunci untuk menciptakan solusi bisnis yang efektif dan efisien di era digital ini.",
        email: "fariz@example.com",
        phone: "+62 812 3456 7890",
        location: "Jakarta, Indonesia",
        avatarUrl: "",
        githubUrl: "https://github.com/farizjr1",
        linkedinUrl: "https://linkedin.com/in/farizjr",
        websiteUrl: "https://myportofolio.flutce.app",
        education: [
          {
            id: "edu-1",
            institution: "Universitas Indonesia",
            degree: "Sarjana Ekonomi",
            field: "Akuntansi",
            startYear: "2019",
            endYear: "2023",
            description: "Lulus dengan IPK 3.75. Aktif dalam organisasi Himpunan Mahasiswa Akuntansi dan mengikuti berbagai kompetisi akuntansi tingkat nasional.",
          },
          {
            id: "edu-2",
            institution: "SMA Negeri 1 Jakarta",
            degree: "SMA",
            field: "IPA",
            startYear: "2016",
            endYear: "2019",
            description: "Lulus dengan nilai UN tertinggi di kelas dan aktif dalam kegiatan ekstrakurikuler olimpiade matematika.",
          },
        ],
        experience: [
          {
            id: "exp-1",
            company: "PT Solusi Digital Nusantara",
            position: "Junior Accountant & System Analyst",
            startDate: "2023-08",
            endDate: "",
            isCurrent: true,
            description: "Bertanggung jawab atas penyusunan laporan keuangan bulanan, rekonsiliasi bank, dan pengembangan sistem informasi akuntansi berbasis web untuk memudahkan proses pelaporan keuangan perusahaan.",
            technologies: ["Microsoft Excel", "SAP", "React", "Node.js"],
          },
          {
            id: "exp-2",
            company: "KAP Budi & Rekan",
            position: "Audit Intern",
            startDate: "2022-06",
            endDate: "2022-12",
            isCurrent: false,
            description: "Melakukan audit laporan keuangan klien dari berbagai sektor industri, menyiapkan kertas kerja audit, dan membantu senior auditor dalam pengujian substantif.",
            technologies: ["Microsoft Excel", "IDEA Audit Software", "CaseWare"],
          },
          {
            id: "exp-3",
            company: "Freelance",
            position: "Web Developer",
            startDate: "2021-01",
            endDate: "2022-05",
            isCurrent: false,
            description: "Mengembangkan aplikasi web untuk UMKM lokal, termasuk sistem kasir sederhana dan website profil bisnis.",
            technologies: ["React", "TypeScript", "Tailwind CSS", "Express.js"],
          },
        ],
        skills: [
          { id: "sk-1", name: "Akuntansi Keuangan", category: "Accounting", level: 90 },
          { id: "sk-2", name: "Perpajakan", category: "Accounting", level: 80 },
          { id: "sk-3", name: "Audit", category: "Accounting", level: 75 },
          { id: "sk-4", name: "Analisis Laporan Keuangan", category: "Accounting", level: 85 },
          { id: "sk-5", name: "React & TypeScript", category: "Technology", level: 80 },
          { id: "sk-6", name: "Node.js & Express", category: "Technology", level: 75 },
          { id: "sk-7", name: "MongoDB", category: "Technology", level: 70 },
          { id: "sk-8", name: "Microsoft Excel & VBA", category: "Technology", level: 90 },
        ],
        tools: ["SAP", "MYOB", "Accurate Online", "Microsoft Office", "Figma", "VS Code", "Git", "Postman"],
        expertiseAreas: ["Laporan Keuangan", "Perpajakan", "Audit Internal", "Pengembangan Web", "Sistem Informasi Akuntansi", "Analisis Data"],
      });
      logger.info("Profile template seeded");
    }

    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      await Portfolio.insertMany([
        {
          title: "Sistem Informasi Akuntansi UMKM",
          description: "Aplikasi web untuk pengelolaan pembukuan dan laporan keuangan usaha kecil menengah secara digital dan real-time.",
          longDescription: "Sistem ini dirancang khusus untuk UMKM yang belum memiliki sistem pembukuan digital. Fitur meliputi pencatatan transaksi harian, laporan laba rugi, neraca, dan arus kas otomatis. Dilengkapi dengan ekspor laporan ke PDF dan Excel.",
          category: "Web App",
          technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "Chart.js"],
          imageUrl: "",
          demoUrl: "",
          githubUrl: "https://github.com/farizjr1",
          featured: true,
          order: 1,
        },
        {
          title: "Dashboard Analisis Laporan Keuangan",
          description: "Dashboard interaktif untuk visualisasi dan analisis laporan keuangan perusahaan dengan grafik dinamis.",
          longDescription: "Dashboard ini memungkinkan manajemen untuk melihat performa keuangan perusahaan secara visual. Menampilkan tren pendapatan, pengeluaran, rasio keuangan, dan perbandingan periode. Data dapat difilter per bulan, kuartal, atau tahun.",
          category: "Data Analysis",
          technologies: ["React", "Recharts", "Python", "Pandas", "FastAPI", "PostgreSQL"],
          imageUrl: "",
          demoUrl: "",
          githubUrl: "https://github.com/farizjr1",
          featured: true,
          order: 2,
        },
        {
          title: "Aplikasi Perhitungan PPh 21",
          description: "Tools otomatis untuk perhitungan Pajak Penghasilan Pasal 21 karyawan sesuai regulasi perpajakan terbaru.",
          longDescription: "Aplikasi ini membantu HRD dan akuntan dalam menghitung PPh 21 karyawan secara akurat. Mendukung berbagai metode perhitungan (gross, gross-up, net), menghitung PTKP sesuai status, dan menghasilkan bukti potong 1721-A1.",
          category: "Accounting Tool",
          technologies: ["React", "TypeScript", "Tailwind CSS", "jsPDF"],
          imageUrl: "",
          demoUrl: "",
          githubUrl: "https://github.com/farizjr1",
          featured: true,
          order: 3,
        },
        {
          title: "Portfolio & CMS Personal",
          description: "Website portfolio profesional dengan sistem manajemen konten dan generator CV berbasis ATS.",
          longDescription: "Website ini adalah proyek portfolio pribadi yang dibangun dengan stack modern. Dilengkapi dengan admin dashboard untuk mengelola konten secara dinamis dan fitur generator CV yang menghasilkan dokumen PDF ATS-friendly.",
          category: "Web App",
          technologies: ["React 19", "Vite", "TypeScript", "Express", "MongoDB", "Tailwind CSS", "Framer Motion"],
          imageUrl: "",
          demoUrl: "https://myportofolio.flutce.app",
          githubUrl: "https://github.com/farizjr1/MyPortofolio",
          featured: false,
          order: 4,
        },
        {
          title: "Sistem Rekonsiliasi Bank Otomatis",
          description: "Script otomasi untuk rekonsiliasi data mutasi bank dengan data buku besar akuntansi menggunakan Python.",
          longDescription: "Tool ini membantu akuntan melakukan rekonsiliasi bank yang biasanya memakan waktu berjam-jam menjadi hanya beberapa menit. Mampu membaca file CSV dari berbagai bank Indonesia, mencocokkan transaksi, dan mengidentifikasi selisih secara otomatis.",
          category: "Automation",
          technologies: ["Python", "Pandas", "OpenPyXL", "Streamlit"],
          imageUrl: "",
          demoUrl: "",
          githubUrl: "https://github.com/farizjr1",
          featured: false,
          order: 5,
        },
        {
          title: "Laporan Audit Internal Template",
          description: "Template kertas kerja audit internal yang terstandarisasi untuk berbagai jenis pengujian audit.",
          longDescription: "Kumpulan template Excel dengan macro VBA untuk mempercepat proses dokumentasi audit internal. Mencakup kertas kerja untuk pengujian pengendalian, pengujian substantif, dan ringkasan temuan audit.",
          category: "Accounting Tool",
          technologies: ["Microsoft Excel", "VBA Macro", "Power Query"],
          imageUrl: "",
          demoUrl: "",
          githubUrl: "",
          featured: false,
          order: 6,
        },
      ]);
      logger.info("Portfolio template seeded");
    }
  } catch (err) {
    logger.error({ err }, "Error seeding database");
  }
}
