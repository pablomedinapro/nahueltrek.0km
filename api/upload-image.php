<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Manejar preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Verificar que se envió un archivo
if (!isset($_FILES['image'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No se recibió ninguna imagen']);
    exit();
}

$file = $_FILES['image'];

// Validaciones
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$maxSize = 2 * 1024 * 1024; // 2MB

// Validar tipo
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato no permitido. Solo JPG, PNG, WEBP']);
    exit();
}

// Validar tamaño
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Archivo muy grande. Máximo 2MB']);
    exit();
}

// Validar que no hubo errores en la carga
if ($file['error'] !== UPLOAD_ERR_OK) {
    $errorMessages = [
        UPLOAD_ERR_INI_SIZE => 'El archivo excede el tamaño permitido en php.ini',
        UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamaño permitido en el formulario',
        UPLOAD_ERR_PARTIAL => 'El archivo solo se subió parcialmente',
        UPLOAD_ERR_NO_FILE => 'No se subió ningún archivo',
        UPLOAD_ERR_NO_TMP_DIR => 'Falta la carpeta temporal',
        UPLOAD_ERR_CANT_WRITE => 'Error al escribir el archivo en disco',
        UPLOAD_ERR_EXTENSION => 'Una extensión de PHP detuvo la carga'
    ];
    $errorMsg = $errorMessages[$file['error']] ?? 'Error desconocido al subir';
    http_response_code(500);
    echo json_encode(['error' => $errorMsg, 'code' => $file['error']]);
    exit();
}

// Crear directorio uploads si no existe
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo crear la carpeta uploads/', 'path' => $uploadDir]);
        exit();
    }
}

// Verificar que el directorio sea escribible
if (!is_writable($uploadDir)) {
    http_response_code(500);
    echo json_encode(['error' => 'La carpeta uploads/ no tiene permisos de escritura', 'path' => $uploadDir]);
    exit();
}

// Generar nombre único
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('nahueltrek_', true) . '.' . $extension;
$uploadPath = $uploadDir . $filename;

// Mover archivo
if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    // Obtener URL completa
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $baseUrl = $protocol . '://' . $host;
    $imageUrl = $baseUrl . '/uploads/' . $filename;
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'url' => $imageUrl,
        'filename' => $filename,
        'size' => $file['size']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar el archivo']);
}
?>
