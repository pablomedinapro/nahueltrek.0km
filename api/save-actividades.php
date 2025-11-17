<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

try {
    $input = file_get_contents('php://input');
    $actividades = json_decode($input, true);
    
    if (!is_array($actividades)) {
        throw new Exception('Datos inválidos');
    }
    
    // Guardar en archivo JSON
    $filePath = __DIR__ . '/../data/actividades.json';
    $result = file_put_contents($filePath, json_encode($actividades, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception('Error al guardar archivo');
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Actividades guardadas correctamente',
        'count' => count($actividades)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
