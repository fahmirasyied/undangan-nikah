//===================== fungsi untuk memutar musik audio ==================
document.addEventListener("DOMContentLoaded", function () {
    var audio = document.getElementById("myAudio");
    var playPauseBtn = document.getElementById("playPauseBtn");
    var volumeSlider = document.getElementById("volumeSlider");
    var bukaUndanganBtn = document.getElementById("bukaUndangan");
    var audioPlayerContainer = document.getElementById("audioPlayerContainer");
    
    // Initially hide audio controls
    audioPlayerContainer.style.display = "none";
    
    // Handle "Buka Undangan" button click
    bukaUndanganBtn.addEventListener("click", function (event) {
        event.preventDefault();
        
        // Show audio player
        audioPlayerContainer.style.display = "flex";
        
        // Start music autoplay
        audio.volume = 0.7; // Set volume to 70%
        audio.play().catch(error => {
            console.log("Autoplay diblokir oleh browser:", error);
        });
        
        // Update button icon
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        
        // Scroll to home section with slide-down transition
        var homeSection = document.getElementById("home");
        var coverSection = document.querySelector(".cover");
        
        // Hide cover section
        coverSection.style.opacity = "0";
        coverSection.style.pointerEvents = "none";
        
        // Show home section with slide-down animation
        homeSection.classList.add("show-home");
        
        // Scroll to home section after animation starts
        setTimeout(function() {
            homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
    });
    
    // Play/Pause button
    playPauseBtn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        }
    });
    
    // Volume control
    volumeSlider.addEventListener("input", function () {
        audio.volume = this.value / 100;
    });
    
    // Update button saat audio dimulai
    audio.addEventListener("play", function () {
        playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
    });
    
    // Update button saat audio di-pause
    audio.addEventListener("pause", function () {
        playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
    });
});
// ===========================================================================
document.addEventListener("DOMContentLoaded", function () {
    let homeSection = document.querySelector(".home");

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                homeSection.classList.add("show");
            }
        });
    }, { threshold: 0.3 });

    observer.observe(homeSection);
});
// ============================================================================
document.addEventListener("DOMContentLoaded", function () {
    let ourSection = document.querySelector(".time");

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ourSection.classList.add("show");
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ourSection);
});
// ============================================================================
document.addEventListener("DOMContentLoaded", function () {
    let ourSection = document.querySelector(".our");

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ourSection.classList.add("show");
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ourSection);
});
// =============================================================================
document.addEventListener("DOMContentLoaded", function () {
    let ourSection = document.querySelector(".close");

    let observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                ourSection.classList.add("show");
            }
        });
    }, { threshold: 0.3 });

    observer.observe(ourSection);
});
// =============================================================================
function copyToClipboard(id) {
    var text = document.getElementById(id).innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Nomor rekening berhasil disalin!");
    }).catch(err => {
        console.error("Gagal menyalin", err);
    });
}

function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    var value = params.get(name);
    if (!value) return "";
    return value.replace(/^\s*['\"]?|['\"]?\s*$/g, "");
}

function setGuestName() {
    var nama = getQueryParam("nama");
    var guestName = document.getElementById("guestName");
    if (!guestName) return;

    if (nama) {
        guestName.textContent = nama;
    } else {
        guestName.textContent = "";
    }
}

document.addEventListener("DOMContentLoaded", setGuestName);
// =============================================================================
var SangatPasti = "Assalamualaikum, halo Fahmi & Aisah, wah selamat ya semoga kalian menjadi keluarga yang sakinah, mawaddah, warahmah. tentu saja aku gak bakal melewatkan kesempatan ini...aku pasti hadir dipernikahan kalian"
var pasti = "Assalamualaikum, halo Fahmi & Aisah, wah selamat ya semoga kalian menjadi keluarga yang sakinah, mawaddah, warahmah. Insyallah aku pasti hadir dipernikahan kalian"
var KurangPasti = "Assalamualaikum, halo Fahmi & Aisah, wah selamat ya semoga kalian menjadi keluarga yang sakinah, mawaddah, warahmah. Sebelumnya mohon maaf banget nih kyknya aku ada urusan lain, tapi aku usahain hadir kok dipernikahan kalian"

var encodeMessage1 = encodeURIComponent(SangatPasti)
var encodeMessage2 = encodeURIComponent(pasti)
var encodeMessage3 = encodeURIComponent(KurangPasti)

var number = "6285156231808" // Ganti dengan nomor WhatsApp yang dituju, pastikan formatnya benar (misal: "6281234567890" untuk Indonesia)

var walink1 = "https://wa.me/" + number + "?text=" + encodeMessage1;
var walink2 = "https://wa.me/" + number + "?text=" + encodeMessage2;
var walink3 = "https://wa.me/" + number + "?text=" + encodeMessage3;


window.onload = function () {
    document.getElementById("whatsapplink1").href = walink1;
    document.getElementById("whatsapplink2").href = walink2;
    document.getElementById("whatsapplink3").href = walink3;
};