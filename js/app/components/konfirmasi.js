import { util } from '../../common/util.js';

export const konfirmasi = (() => {

    /**
     * @type {string}
     */
    const API_ENDPOINT = '/api/konfirmasi.php';

    /**
     * @returns {string}
     */
    const getApiUrl = () => {
        const base = document.body.getAttribute('data-konfirmasi-url');
        return base ? base.replace(/\/+$/, '') + '/konfirmasi.php' : API_ENDPOINT;
    };

    /**
     * @param {string} dateStr
     * @returns {string}
     */
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options);
    };

    /**
     * @param {{ id: number, nama_lengkap: string, presensi: string, komentar: string|null, gif_url: string|null, created_at: string }} item
     * @returns {string}
     */
    const renderCard = (item) => {
        const presensiBadge = item.presensi === 'hadir'
            ? '<span class="badge bg-success rounded-pill ms-2"><i class="fa-solid fa-circle-check me-1"></i>Hadir</span>'
            : '<span class="badge bg-danger rounded-pill ms-2"><i class="fa-solid fa-circle-xmark me-1"></i>Tidak Hadir</span>';

        const gifHtml = item.gif_url
            ? `<div class="mt-2"><img src="${util.escapeHtml(item.gif_url)}" alt="GIF" class="rounded-3" style="max-width: 100%; max-height: 150px;" loading="lazy"></div>`
            : '';

        const komentarHtml = item.komentar
            ? `<p class="mb-1 mt-2" style="font-size: 0.95rem;">${util.escapeHtml(item.komentar)}</p>`
            : '';

        return `<div class="bg-theme-auto rounded-4 shadow-sm p-3 mb-3">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <i class="fa-solid fa-user-circle fa-lg me-2 text-secondary"></i>
                    <strong style="font-size: 0.95rem;">${util.escapeHtml(item.nama_lengkap)}</strong>
                    ${presensiBadge}
                </div>
            </div>
            ${komentarHtml}
            ${gifHtml}
            <small class="text-muted d-block mt-2" style="font-size: 0.75rem;"><i class="fa-solid fa-clock me-1"></i>${formatDate(item.created_at)}</small>
        </div>`;
    };

    /**
     * @returns {string}
     */
    const renderLoading = () => {
        return '<div class="text-center p-4"><span class="spinner-border spinner-border-sm"></span> Memuat data...</div>';
    };

    /**
     * @returns {string}
     */
    const renderEmpty = () => {
        return '<div class="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow"><p class="fw-bold p-0 m-0" style="font-size: 0.95rem;">Belum ada konfirmasi kehadiran. Jadilah yang pertama!</p></div>';
    };

    /**
     * @returns {Promise<void>}
     */
    const loadKonfirmasi = async () => {
        const listEl = document.getElementById('konfirmasi-list');
        if (!listEl) {
            return;
        }

        util.safeInnerHTML(listEl, renderLoading());

        try {
            const res = await fetch(getApiUrl() + '?per=50');
            const json = await res.json();

            if (!json.status || !json.data || json.data.length === 0) {
                util.safeInnerHTML(listEl, renderEmpty());
                return;
            }

            const html = json.data.map(renderCard).join('');
            util.safeInnerHTML(listEl, html);
        } catch {
            util.safeInnerHTML(listEl, renderEmpty());
        }
    };

    /**
     * @returns {void}
     */
    const setupGifPreview = () => {
        const gifInput = document.getElementById('konfirmasi-gif');
        const previewWrapper = document.getElementById('konfirmasi-gif-preview-wrapper');
        const previewImg = document.getElementById('konfirmasi-gif-preview');

        if (!gifInput || !previewWrapper || !previewImg) {
            return;
        }

        gifInput.addEventListener('input', () => {
            const url = gifInput.value.trim();
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                previewImg.src = url;
                previewWrapper.classList.remove('d-none');
            } else {
                previewImg.src = '';
                previewWrapper.classList.add('d-none');
            }
        });

        previewImg.addEventListener('error', () => {
            previewWrapper.classList.add('d-none');
        });
    };

    /**
     * @returns {void}
     */
    const setupSubmit = () => {
        const submitBtn = document.getElementById('konfirmasi-submit-btn');
        if (!submitBtn) {
            return;
        }

        submitBtn.addEventListener('click', async () => {
            const nama = document.getElementById('konfirmasi-nama');
            const presensi = document.getElementById('konfirmasi-presensi');
            const komentar = document.getElementById('konfirmasi-komentar');
            const gifInput = document.getElementById('konfirmasi-gif');

            if (!nama.value.trim()) {
                util.notify('Nama lengkap wajib diisi.').warning();
                return;
            }

            if (!presensi.value) {
                util.notify('Silakan pilih konfirmasi presensi.').warning();
                return;
            }

            const btn = util.disableButton(submitBtn);

            const body = {
                nama_lengkap: nama.value.trim(),
                presensi: presensi.value,
                komentar: komentar.value.trim() || null,
                gif_url: gifInput.value.trim() || null,
            };

            try {
                const res = await fetch(getApiUrl(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });

                const json = await res.json();

                if (json.status) {
                    util.notify('Konfirmasi kehadiran berhasil dikirim!').success();
                    nama.value = '';
                    presensi.value = '';
                    komentar.value = '';
                    gifInput.value = '';

                    const previewWrapper = document.getElementById('konfirmasi-gif-preview-wrapper');
                    if (previewWrapper) {
                        previewWrapper.classList.add('d-none');
                    }

                    await loadKonfirmasi();
                } else {
                    util.notify(json.message || 'Terjadi kesalahan.').error();
                }
            } catch {
                util.notify('Gagal mengirim konfirmasi. Periksa koneksi Anda.').error();
            }

            btn.restore();
        });
    };

    /**
     * @returns {void}
     */
    const init = () => {
        setupGifPreview();
        setupSubmit();
        loadKonfirmasi();
    };

    return {
        init,
        loadKonfirmasi,
    };
})();
