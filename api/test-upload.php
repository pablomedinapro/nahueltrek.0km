<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnóstico Upload</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        .info { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .success { background: #c8e6c9; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .error { background: #ffcdd2; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .warning { background: #fff9c4; padding: 15px; margin: 10px 0; border-radius: 5px; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
        h3 { color: #1976d2; }
    </style>
</head>
<body>
    <h1>🔍 Diagnóstico de Upload</h1>
    
    <h3>1. Configuración PHP</h3>
    <div class="info">
        <strong>file_uploads:</strong> <?php echo ini_get('file_uploads') ? '✅ Habilitado' : '❌ Deshabilitado'; ?><br>
        <strong>upload_max_filesize:</strong> <?php echo ini_get('upload_max_filesize'); ?><br>
        <strong>post_max_size:</strong> <?php echo ini_get('post_max_size'); ?><br>
        <strong>max_file_uploads:</strong> <?php echo ini_get('max_file_uploads'); ?><br>
        <strong>upload_tmp_dir:</strong> <?php echo ini_get('upload_tmp_dir') ?: 'default'; ?><br>
        <strong>Versión PHP:</strong> <?php echo phpversion(); ?>
    </div>

    <h3>2. Permisos de Directorios</h3>
    <?php
    $uploadDir = __DIR__ . '/../uploads/';
    $dataDir = __DIR__ . '/../data/';
    
    echo "<div class='info'>";
    echo "<strong>Directorio uploads:</strong> $uploadDir<br>";
    if (is_dir($uploadDir)) {
        echo "✅ Existe<br>";
        echo "<strong>Permisos:</strong> " . substr(sprintf('%o', fileperms($uploadDir)), -4) . "<br>";
        echo "<strong>Escribible:</strong> " . (is_writable($uploadDir) ? '✅ Sí' : '❌ No') . "<br>";
    } else {
        echo "❌ No existe<br>";
        if (@mkdir($uploadDir, 0777, true)) {
            echo "✅ Creado exitosamente<br>";
        } else {
            echo "❌ No se pudo crear<br>";
        }
    }
    echo "</div>";

    echo "<div class='info'>";
    echo "<strong>Directorio data:</strong> $dataDir<br>";
    if (is_dir($dataDir)) {
        echo "✅ Existe<br>";
        echo "<strong>Permisos:</strong> " . substr(sprintf('%o', fileperms($dataDir)), -4) . "<br>";
        echo "<strong>Escribible:</strong> " . (is_writable($dataDir) ? '✅ Sí' : '❌ No') . "<br>";
    } else {
        echo "❌ No existe<br>";
        if (@mkdir($dataDir, 0777, true)) {
            echo "✅ Creado exitosamente<br>";
        } else {
            echo "❌ No se pudo crear<br>";
        }
    }
    echo "</div>";
    ?>

    <h3>3. Test de Escritura</h3>
    <?php
    $testFile = $uploadDir . 'test_' . time() . '.txt';
    if (file_put_contents($testFile, 'Test de escritura: ' . date('Y-m-d H:i:s'))) {
        echo "<div class='success'>✅ Se puede escribir en uploads/<br>";
        echo "<strong>Archivo creado:</strong> " . basename($testFile) . "<br>";
        if (file_exists($testFile)) {
            echo "<strong>URL:</strong> <a href='/uploads/" . basename($testFile) . "' target='_blank'>/uploads/" . basename($testFile) . "</a><br>";
            unlink($testFile); // Limpiar
            echo "✅ Archivo de prueba eliminado</div>";
        }
    } else {
        echo "<div class='error'>❌ No se puede escribir en uploads/</div>";
    }
    ?>

    <h3>4. Endpoints Disponibles</h3>
    <div class="info">
        <?php
        $endpoints = [
            '/api/upload-image.php' => 'Upload de imágenes',
            '/api/actividades.php' => 'CRUD de actividades',
            '/api/test-endpoint.html' => 'Test de upload'
        ];
        
        foreach ($endpoints as $path => $desc) {
            $fullPath = __DIR__ . str_replace('/api/', '/', $path);
            $exists = file_exists($fullPath);
            echo "• <strong>$path</strong> ($desc): " . 
                 ($exists ? "✅ Existe" : "❌ No encontrado") . "<br>";
        }
        ?>
    </div>

    <h3>5. Archivos en uploads/</h3>
    <?php
    if (is_dir($uploadDir)) {
        $files = scandir($uploadDir);
        $imageFiles = array_filter($files, function($f) use ($uploadDir) {
            return is_file($uploadDir . $f) && !str_starts_with($f, '.');
        });
        
        if (count($imageFiles) > 0) {
            echo "<div class='info'>";
            echo "<strong>Total de archivos:</strong> " . count($imageFiles) . "<br><br>";
            foreach (array_slice($imageFiles, 0, 10) as $file) {
                $size = filesize($uploadDir . $file);
                $sizeKB = round($size / 1024, 2);
                echo "📄 <a href='/uploads/$file' target='_blank'>$file</a> ({$sizeKB}KB)<br>";
            }
            if (count($imageFiles) > 10) {
                echo "<br><em>... y " . (count($imageFiles) - 10) . " archivos más</em>";
            }
            echo "</div>";
        } else {
            echo "<div class='warning'>⚠️ No hay archivos en uploads/</div>";
        }
    }
    ?>

    <h3>6. Variables de Servidor</h3>
    <div class="info">
        <strong>DOCUMENT_ROOT:</strong> <?php echo $_SERVER['DOCUMENT_ROOT']; ?><br>
        <strong>HTTP_HOST:</strong> <?php echo $_SERVER['HTTP_HOST']; ?><br>
        <strong>SERVER_SOFTWARE:</strong> <?php echo $_SERVER['SERVER_SOFTWARE']; ?><br>
        <strong>SCRIPT_FILENAME:</strong> <?php echo __FILE__; ?>
    </div>

    <hr style="margin: 30px 0;">
    
    <p><strong>💡 Siguiente paso:</strong></p>
    <ul>
        <li>Si todo está ✅, prueba subir una imagen desde el admin</li>
        <li>Si hay ❌, corrige los permisos en Hostinger File Manager</li>
        <li>Usa <a href="test-endpoint.html">test-endpoint.html</a> para probar upload</li>
    </ul>
</body>
</html>
