CREATE TABLE IF NOT EXISTS `konfirmasi_kehadiran` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_lengkap` VARCHAR(100) NOT NULL,
    `presensi` ENUM('hadir', 'tidak_hadir') NOT NULL,
    `komentar` TEXT DEFAULT NULL,
    `gif_url` VARCHAR(500) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
