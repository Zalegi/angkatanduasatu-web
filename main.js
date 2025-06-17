///GANTI BACKGROUND
const images = [
  'IMAGE/COLLAPSE/1.jpeg',
  'IMAGE/COLLAPSE/2.jpeg',
];

let index = 0;
let visible = true;

const bg1 = document.getElementById('bg1');
const bg2 = document.getElementById('bg2');

bg1.style.backgroundImage = `url('${images[0]}')`;
bg1.style.opacity = 1;
bg2.style.opacity = 0;

setInterval(() => {
  index = (index + 1) % images.length;
  const nextImage = images[index];
  if (visible) {
    bg2.style.backgroundImage = `url('${nextImage}')`;
    bg2.style.opacity = 1;
    bg1.style.opacity = 0;
  } else {
    bg1.style.backgroundImage = `url('${nextImage}')`;
    bg1.style.opacity = 1;
    bg2.style.opacity = 0;
  }
  visible = !visible;
}, 6000);

///RENDER PROFIL SISWA
let siswa = [];
fetch('JSON/data.json')
  .then(res => res.json())
  .then(data => {
    siswa = data;
    renderTabKelas();
    initSearch();
    document.getElementById("loading").style.display = "none";
  })
  .catch(err => {
    document.getElementById("loading").innerHTML = `<span class="text-danger">Gagal memuat data siswa.</span>`;
    console.error("Fetch error:", err);
  });

function renderTabKelas() {
  const kelasUnik = [...new Set(siswa.map(s => s.kelas))].sort();
  const tabKelas = document.getElementById('tabKelas');
  const tabContent = document.getElementById('tabContentKelas');
  tabKelas.innerHTML = "";
  tabContent.innerHTML = "";

  kelasUnik.forEach((kelas, idx) => {
    tabKelas.innerHTML += `
      <li class="nav-item" role="presentation">
        <button class="a-black nav-link ${idx === 0 ? 'active' : ''}" id="tab-${kelas}" data-bs-toggle="tab" data-bs-target="#konten-${kelas}" type="button">${kelas}</button>
      </li>`;

    const siswaKelas = siswa.filter(s => s.kelas === kelas);
    let listItems = siswaKelas.map(s => {
      const index = siswa.indexOf(s);
      return `
        <div class="col-md-6">
          <li style="padding:10px;" class="list-group-item rounded-3 shadow-sm mb-2">
            <a href="#" class="a-black profil-link" data-index="${index}">
              <img src="${s.foto}" class="fSiswa" alt="Foto Siswa" onerror="this.src='IMAGE/PROFIL/default.jpeg'">
              ${s.nama}
            </a>
          </li>
        </div>`;
    }).join("");

    tabContent.innerHTML += `
      <div class="tab-pane fade ${idx === 0 ? 'show active' : ''}" id="konten-${kelas}">
        <div class="row g-2">
          ${listItems}
        </div>
      </div>`;
  });
}


///PENCARIAN NAMA SISWA
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  let timeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const keyword = searchInput.value.toLowerCase();
      searchResults.innerHTML = "";

      if (keyword.length > 0) {
        let found = false;
        searchResults.innerHTML = `<div class="row g-2"></div>`;
        const row = searchResults.querySelector(".row");

        siswa.forEach((s, index) => {
          if (s.nama.toLowerCase().includes(keyword)) {
            const col = document.createElement("div");
            col.className = "col-md-6";
            const item = document.createElement("li");
            item.className = "list-group-item rounded-3 shadow-sm mb-2";
            item.innerHTML = `
              <a href="#" class="a-black profil-link" data-index="${index}">
                <img src="${s.foto}" class="fSiswa" alt="Foto Siswa" onerror="this.src='IMAGE/PROFIL/default.jpeg'">
                ${s.nama} (${s.kelas})
              </a>`;
            col.appendChild(item);
            row.appendChild(col);
            found = true;
          }
        });

        if (!found) {
          row.innerHTML = `<div class="col-12"><li class="list-group-item text-muted rounded-3 shadow-sm mb-2">Tidak ditemukan</li></div>`;
        }
      }
    }, 300);
  });
}


///RENDER testimoni
let testimonies = [];
let testiIndex = 0;

fetch('JSON/testimoni.json')
  .then(res => res.json())
  .then(data => {
    testimonies = data;
    if (testimonies.length > 0) {
      tampilkanTestimoni();
      setInterval(gantiTestimoni, 5000); // ganti setiap 5 detik
    }
  })
  .catch(err => {
    console.error("Gagal memuat testimoni:", err);
    document.getElementById("pesanTesti").textContent = "Gagal memuat testimoni.";
  });

function tampilkanTestimoni() {
  const t = testimonies[testiIndex];
  document.getElementById("pesanTesti").textContent = `"${t.pesan}"`;
  document.getElementById("footerTesti").textContent = `${t.nama}, ${t.kelas}`;
}

function gantiTestimoni() {
  const el = document.getElementById("testimoni");
  el.style.opacity = 0;
  setTimeout(() => {
    testiIndex = (testiIndex + 1) % testimonies.length;
    tampilkanTestimoni();
    el.style.opacity = 1;
  }, 300);
}

///TAB FOTO PERKELAS
let galeri = [];
fetch('JSON/galeri.json')
  .then(res => res.json())
  .then(data => {
    galeri = data;
    renderTabGaleri();
  })

function renderTabGaleri() {
  const kelasUnikG = [...new Set(galeri.map(g => g.kelas))].sort();
  const tabGaleri = document.getElementById('tabKelasPerkelas');
  const tabKonten = document.getElementById('tabKontenPerkelas');

  tabGaleri.innerHTML = "";
  tabKonten.innerHTML = "";

  kelasUnikG.forEach((kelas, idx) => {
    tabGaleri.innerHTML += `
      <li class="nav-item" role="presentation">
        <button class="a-black nav-link ${idx === 0 ? 'active' : ''}" id="tab-galeri-${kelas}" data-bs-toggle="tab" data-bs-target="#galeri-${kelas}" type="button">${kelas}</button>
      </li>`;

    const fotoKelas = galeri.filter(g => g.kelas === kelas);
    let fotoHTML = fotoKelas.map((f, i) => {
      const index = galeri.indexOf(f);
      return `
        <div class="col-sm-6 col-md-3">
          <img src="${f.foto}" data-index="${index}" class="foto-galeri img-fluid galeri-img" alt="Foto Galeri" onerror="this.src='IMAGE/COLLAPSE/default.jpg'">
        </div>
    `}).join("");

    tabKonten.innerHTML += `
      <div class="tab-pane fade ${idx === 0 ? 'show active' : ''}" id="galeri-${kelas}">
        <div class="row g-3">
          ${fotoHTML}
        </div>
      </div>`;
  });
}


document.addEventListener('click', function (e) {
  if (e.target.classList.contains('profil-link')) {
    e.preventDefault();
    const index = e.target.dataset.index;
    const s = siswa[index];
    document.getElementById("modalProfilLabel").textContent = `Profil: ${s.nama}`;
    document.getElementById("fotoSiswa").src = s.foto;
    document.getElementById("namaSiswa").textContent = s.nama;
    document.getElementById("kelasSiswa").textContent = `Kelas: ${s.kelas}`;
    document.getElementById("kutipanSiswa").textContent = s.kutipan;
    new bootstrap.Modal(document.getElementById('modalProfil')).show();
  }
  else if(e.target.classList.contains('foto-galeri')) {
    e.preventDefault();
    const index = e.target.dataset.index;
    const f = galeri[index];
    document.getElementById("fotoGaleri").src = f.foto;
    new bootstrap.Modal(document.getElementById('modalGaleri')).show();
  }
});
