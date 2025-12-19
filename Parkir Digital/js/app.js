// ============= DATA SIMULASI =============

// Lahan parkir (dengan tipe Mobil/Motor)
let paketKatering = [
  { id: 1, nama: "Parkir Harian Mall A", kategori: "Harian", lokasi: "Bekasi", tipe: "Mobil", harga: 5000, rating: 4.5 },
  { id: 2, nama: "Parkir Bulanan Kantor B", kategori: "Bulanan", lokasi: "Jakarta", tipe: "Mobil", harga: 300000, rating: 4.7 },
  { id: 3, nama: "Parkir Event Stadion", kategori: "Event", lokasi: "Depok", tipe: "Motor", harga: 20000, rating: 4.8 },
  { id: 4, nama: "Parkir Harian Stasiun", kategori: "Harian", lokasi: "Tangerang", tipe: "Motor", harga: 7000, rating: 4.6 }
];

let pesananCustomer = [];
let pesananMerchant = [];
let paketMerchant = [];

// User terdaftar (sudah termasuk 1 admin pengelola lahan)
let users = [
  { nama: "Admin Lahan", email: "admin@parkir.com", pass: "admin123", role: "merchant" }
];

let currentRole = null;

// ============= NAVIGASI SECTION =============

function showSection(id) {
  document.querySelectorAll("main > section").forEach(sec => {
    sec.classList.add("hidden");
  });

  const target = document.getElementById(id);
  if (target) target.classList.remove("hidden");

  if (id === "landing") renderPaket();
  if (id === "dashboardCustomer") {
    renderPaketCustomer();
    renderTabelPesananCustomer();
  }
  if (id === "dashboardMerchant") {
    renderTabelPaketMerchant();
    renderTabelPesananMerchant();
  }
}

// ============= REGISTRASI & LOGIN =============

// Registrasi hanya untuk Pengguna Parkir (role dikunci)
function register() {
  const nama = document.getElementById("regNama").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const pass = document.getElementById("regPassword").value;
  const role = "customer";

  if (!nama || !email || !pass) {
    alert("Nama, email, dan password wajib diisi.");
    return;
  }

  const sudahAda = users.some(u => u.email === email && u.role === role);
  if (sudahAda) {
    alert("Email Pengguna Parkir tersebut sudah terdaftar.");
    return;
  }

  users.push({ nama, email, pass, role });
  alert("Registrasi berhasil sebagai Pengguna Parkir, silakan login.");

  document.getElementById("regNama").value = "";
  document.getElementById("regEmail").value = "";
  document.getElementById("regPassword").value = "";

  showSection("login");
}

function doLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;
  const role = document.getElementById("loginRole").value; // customer / merchant

  const user = users.find(u => u.email === email && u.pass === pass && u.role === role);

  if (!user) {
    alert("Kombinasi email, password, dan role tidak cocok atau belum terdaftar.");
    return;
  }

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";

  currentRole = role;
  if (role === "customer") {
    showSection("dashboardCustomer");
  } else {
    showSection("dashboardMerchant");
  }
}

function logout() {
  currentRole = null;
  showSection("landing");
}

// ============= LANDING: LIST LAHAN =============

function renderPaket() {
  const kontainer = document.getElementById("listPaket");
  if (!kontainer) return;

  kontainer.innerHTML = "";
  const kategori = document.getElementById("filterKategori").value;
  const lokasi = document.getElementById("filterLokasi").value;
  const tipe = document.getElementById("filterTipe").value;
  const maxHarga = parseInt(document.getElementById("filterHarga").value || 0, 10);

  let data = paketKatering.slice();
  if (kategori) data = data.filter(p => p.kategori === kategori);
  if (lokasi) data = data.filter(p => p.lokasi === lokasi);
  if (tipe) data = data.filter(p => p.tipe === tipe);
  if (maxHarga) data = data.filter(p => p.harga <= maxHarga);

  data.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.width = "260px";
    div.innerHTML = `
      <h3>${p.nama}</h3>
      <p><span class="badge">${p.kategori}</span> • ${p.lokasi}</p>
      <p>Tipe: <b>${p.tipe}</b></p>
      <p>Tarif mulai <b>Rp ${p.harga.toLocaleString()}</b></p>
      <p>Rating: ${p.rating}</p>
      <button onclick="pesanDariLanding(${p.id})">Booking Sekarang</button>
    `;
    kontainer.appendChild(div);
  });
}

function pesanDariLanding(idPaket) {
  alert("Untuk booking lahan, silakan login sebagai Pengguna Parkir terlebih dahulu.");
  showSection("login");
}

// ============= DASHBOARD CUSTOMER =============

function renderPaketCustomer() {
  const kontainer = document.getElementById("listPaketCustomer");
  if (!kontainer) return;

  kontainer.innerHTML = "";
  paketKatering.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";
    div.style.width = "260px";
    div.innerHTML = `
      <h3>${p.nama}</h3>
      <p><span class="badge">${p.kategori}</span> • ${p.lokasi}</p>
      <p>Tipe: <b>${p.tipe}</b></p>
      <p>Tarif mulai <b>Rp ${p.harga.toLocaleString()}</b></p>
      <p>Rating: ${p.rating}</p>
      <button onclick="formPesan(${p.id})">Booking</button>
    `;
    kontainer.appendChild(div);
  });
}

function formPesan(idPaket) {
  const p = paketKatering.find(x => x.id === idPaket);
  const tanggal = prompt("Masukkan tanggal pakai (YYYY-MM-DD):");
  if (!tanggal) return;
  const metode = prompt("Metode bayar? (DP/FP):", "DP");
  const id = "BK-" + String(pesananCustomer.length + 1).padStart(3, "0");

  const order = {
    id,
    paket: p.nama,
    tanggal,
    metode: metode.toUpperCase() === "FP" ? "FP" : "DP",
    status: "Menunggu Konfirmasi"
  };
  pesananCustomer.push(order);

  pesananMerchant.push({
    ...order,
    customer: "Pengguna Demo"
  });

  renderTabelPesananCustomer();
  renderTabelPesananMerchant();
  alert("Booking berhasil dibuat dengan ID " + id);
}

function renderTabelPesananCustomer() {
  const tbody = document.querySelector("#tabelPesananCustomer tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  pesananCustomer.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.paket}</td>
      <td>${o.tanggal}</td>
      <td>${o.metode}</td>
      <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

// ============= STATUS BADGE =============

function statusClass(status) {
  if (status === "Menunggu Konfirmasi") return "status-menunggu";
  if (status === "Diproses") return "status-diproses";
  if (status === "Selesai") return "status-selesai";
  return "";
}

// ============= DASHBOARD MERCHANT: LAHAN =============

function tambahPaket() {
  const nama = document.getElementById("mNama").value.trim();
  const kategori = document.getElementById("mKategori").value;
  const lokasi = document.getElementById("mLokasi").value;
  const tipe = document.getElementById("mTipe").value;
  const harga = parseInt(document.getElementById("mHarga").value || "0", 10);
  const desk = document.getElementById("mDeskripsi").value.trim();

  if (!nama || !harga) {
    alert("Nama lahan dan tarif wajib diisi.");
    return;
  }

  const idEdit = window.paketSedangDiedit;

  if (idEdit) {
    paketKatering = paketKatering.map(p => {
      if (p.id === idEdit) {
        return { ...p, nama, kategori, lokasi, tipe, harga, deskripsi: desk };
      }
      return p;
    });

    paketMerchant = paketMerchant.map(p => {
      if (p.id === idEdit) {
        return { ...p, nama, kategori, lokasi, tipe, harga, deskripsi: desk };
      }
      return p;
    });

    window.paketSedangDiedit = null;
    alert("Lahan berhasil diperbarui.");
  } else {
    const paketBaru = {
      id: paketKatering.length + 1,
      nama,
      kategori,
      lokasi,
      tipe,
      harga,
      rating: 0,
      deskripsi: desk
    };
    paketKatering.push(paketBaru);
    paketMerchant.push(paketBaru);
    alert("Lahan baru berhasil ditambahkan.");
  }

  document.getElementById("mNama").value = "";
  document.getElementById("mHarga").value = "";
  document.getElementById("mDeskripsi").value = "";

  renderPaket();
  renderPaketCustomer();
  renderTabelPaketMerchant();
}

function renderTabelPaketMerchant() {
  const tbody = document.querySelector("#tabelPaketMerchant tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  paketMerchant.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nama}</td>
      <td>${p.kategori}</td>
      <td>${p.lokasi}</td>
      <td>${p.tipe}</td>
      <td>Rp ${p.harga.toLocaleString()}</td>
      <td>
        <button class="small" onclick="editPaket(${p.id})">Edit</button>
        <button class="small secondary" onclick="hapusPaket(${p.id})">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editPaket(id) {
  const p = paketMerchant.find(x => x.id === id);
  if (!p) return;

  document.getElementById("mNama").value = p.nama;
  document.getElementById("mKategori").value = p.kategori;
  document.getElementById("mLokasi").value = p.lokasi;
  document.getElementById("mTipe").value = p.tipe || "Mobil";
  document.getElementById("mHarga").value = p.harga;
  document.getElementById("mDeskripsi").value = p.deskripsi || "";

  window.paketSedangDiedit = id;
}

function hapusPaket(id) {
  paketMerchant = paketMerchant.filter(p => p.id !== id);
  paketKatering = paketKatering.filter(p => p.id !== id);
  renderPaket();
  renderPaketCustomer();
  renderTabelPaketMerchant();
}

// ============= PESANAN MERCHANT =============

function renderTabelPesananMerchant() {
  const tbody = document.querySelector("#tabelPesananMerchant tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  pesananMerchant.forEach((o, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.customer}</td>
      <td>${o.paket}</td>
      <td>${o.tanggal}</td>
      <td>${o.metode}</td>
      <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
      <td>
        <button class="small" onclick="ubahStatus(${idx}, 'Diproses')">Proses</button>
        <button class="small" onclick="ubahStatus(${idx}, 'Selesai')">Selesai</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function ubahStatus(index, statusBaru) {
  pesananMerchant[index].status = statusBaru;
  const id = pesananMerchant[index].id;
  const oCust = pesananCustomer.find(o => o.id === id);
  if (oCust) oCust.status = statusBaru;
  renderTabelPesananMerchant();
  renderTabelPesananCustomer();
}

// ============= INISIALISASI AWAL =============

renderPaket();
