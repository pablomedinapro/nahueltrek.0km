<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataFile = __DIR__ . '/../data/lugares.json';
$dataDir = dirname($dataFile);

// Crear directorio data si no existe
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Crear archivo inicial si no existe
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Leer lugares
    $lugares = json_decode(file_get_contents($dataFile), true);
    echo json_encode($lugares ?: []);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Guardar lugares
    $input = file_get_contents('php://input');
    $lugares = json_decode($input, true);
    
    if (json_last_error() === JSON_ERROR_NONE) {
        file_put_contents($dataFile, json_encode($lugares, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
    }
}
?>
