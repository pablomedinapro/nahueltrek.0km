<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$dataFile = __DIR__ . '/../data/actividades.json';

// Asegurar que existe el directorio data
$dataDir = dirname($dataFile);
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// GET - Obtener actividades
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($dataFile)) {
        $data = file_get_contents($dataFile);
        echo $data;
    } else {
        // Si no existe, devolver array vacío
        echo json_encode([]);
    }
    exit();
}

// POST - Guardar actividades
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $actividades = json_decode($json, true);
    
    if ($actividades === null) {
        http_response_code(400);
        echo json_encode(['error' => 'JSON inválido']);
        exit();
    }
    
    if (file_put_contents($dataFile, json_encode($actividades, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'count' => count($actividades),
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al guardar']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
?>
