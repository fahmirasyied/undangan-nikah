<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getKonfirmasi($pdo);
        break;
    case 'POST':
        postKonfirmasi($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['status' => false, 'message' => 'Method not allowed']);
        break;
}

function getKonfirmasi(PDO $pdo): void
{
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $per = min(50, max(1, (int) ($_GET['per'] ?? 10)));
    $offset = ($page - 1) * $per;

    $countStmt = $pdo->query('SELECT COUNT(*) FROM konfirmasi_kehadiran');
    $total = (int) $countStmt->fetchColumn();

    $stmt = $pdo->prepare('SELECT id, nama_lengkap, presensi, komentar, gif_url, created_at FROM konfirmasi_kehadiran ORDER BY created_at DESC LIMIT :limit OFFSET :offset');
    $stmt->bindValue(':limit', $per, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $data = $stmt->fetchAll();

    echo json_encode([
        'status' => true,
        'data' => $data,
        'total' => $total,
        'page' => $page,
        'per' => $per,
    ]);
}

function postKonfirmasi(PDO $pdo): void
{
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'Invalid JSON input']);
        return;
    }

    $nama_lengkap = trim($input['nama_lengkap'] ?? '');
    $presensi = $input['presensi'] ?? '';
    $komentar = trim($input['komentar'] ?? '');
    $gif_url = trim($input['gif_url'] ?? '');

    if (empty($nama_lengkap)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'Nama lengkap wajib diisi']);
        return;
    }

    if (!in_array($presensi, ['hadir', 'tidak_hadir'], true)) {
        http_response_code(400);
        echo json_encode(['status' => false, 'message' => 'Presensi tidak valid']);
        return;
    }

    $stmt = $pdo->prepare('INSERT INTO konfirmasi_kehadiran (nama_lengkap, presensi, komentar, gif_url) VALUES (:nama_lengkap, :presensi, :komentar, :gif_url)');
    $stmt->execute([
        ':nama_lengkap' => $nama_lengkap,
        ':presensi' => $presensi,
        ':komentar' => empty($komentar) ? null : $komentar,
        ':gif_url' => empty($gif_url) ? null : $gif_url,
    ]);

    $id = (int) $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'status' => true,
        'message' => 'Konfirmasi berhasil disimpan',
        'data' => [
            'id' => $id,
            'nama_lengkap' => $nama_lengkap,
            'presensi' => $presensi,
            'komentar' => empty($komentar) ? null : $komentar,
            'gif_url' => empty($gif_url) ? null : $gif_url,
        ],
    ]);
}
