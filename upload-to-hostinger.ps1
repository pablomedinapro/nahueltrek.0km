# Script para subir archivos a Hostinger vía FTP
# Reemplaza estos valores con tus credenciales de Hostinger

$ftpServer = "ftp.nahueltrek.0km.app"  # O tu servidor FTP de Hostinger
$ftpUsername = "TU_USUARIO_FTP"
$ftpPassword = "TU_PASSWORD_FTP"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Subir archivos a Hostinger" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Función para subir archivo
function Upload-File {
    param($localPath, $remotePath)
    
    try {
        $uri = "ftp://$ftpServer/$remotePath"
        Write-Host "📤 Subiendo: $localPath -> $remotePath" -ForegroundColor Yellow
        
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.UseBinary = $true
        $request.KeepAlive = $false
        
        $content = [System.IO.File]::ReadAllBytes($localPath)
        $request.ContentLength = $content.Length
        
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($content, 0, $content.Length)
        $requestStream.Close()
        
        $response = $request.GetResponse()
        Write-Host "✅ Subido: $remotePath" -ForegroundColor Green
        $response.Close()
        return $true
    }
    catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
        return $false
    }
}

# Función para crear directorio
function Create-Directory {
    param($remotePath)
    
    try {
        $uri = "ftp://$ftpServer/$remotePath"
        Write-Host "📁 Creando directorio: $remotePath" -ForegroundColor Yellow
        
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($ftpUsername, $ftpPassword)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        
        $response = $request.GetResponse()
        Write-Host "✅ Directorio creado: $remotePath" -ForegroundColor Green
        $response.Close()
        return $true
    }
    catch {
        Write-Host "⚠️ Directorio ya existe o error: $_" -ForegroundColor Yellow
        return $false
    }
}

Write-Host "IMPORTANTE: Edita este archivo y reemplaza:" -ForegroundColor Red
Write-Host "- TU_USUARIO_FTP" -ForegroundColor Red
Write-Host "- TU_PASSWORD_FTP" -ForegroundColor Red
Write-Host ""
Write-Host "Luego ejecuta: .\upload-to-hostinger.ps1" -ForegroundColor Cyan
Write-Host ""

if ($ftpUsername -eq "TU_USUARIO_FTP" -or $ftpPassword -eq "TU_PASSWORD_FTP") {
    Write-Host "❌ Debes configurar las credenciales FTP primero" -ForegroundColor Red
    exit
}

Write-Host "Iniciando subida de archivos..." -ForegroundColor Green
Write-Host ""

# Crear directorios necesarios
Create-Directory "public_html/api"
Create-Directory "public_html/uploads"

# Subir archivos del build (dist/)
Write-Host ""
Write-Host "📦 Subiendo archivos del build..." -ForegroundColor Cyan
$distFiles = Get-ChildItem -Path ".\dist" -Recurse -File

foreach ($file in $distFiles) {
    $relativePath = $file.FullName.Substring((Get-Location).Path.Length + 6)  # +6 para "\dist\"
    $remotePath = "public_html/" + $relativePath.Replace("\", "/")
    Upload-File $file.FullName $remotePath
}

# Subir endpoint PHP
Write-Host ""
Write-Host "🐘 Subiendo endpoint PHP..." -ForegroundColor Cyan
Upload-File ".\api\upload-image.php" "public_html/api/upload-image.php"
Upload-File ".\api\test-endpoint.html" "public_html/api/test-endpoint.html"

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  ✅ Proceso completado" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ve a https://nahueltrek.0km.app/api/test-endpoint.html" -ForegroundColor White
Write-Host "2. Haz clic en 'Test /api/upload-image.php'" -ForegroundColor White
Write-Host "3. Sube una imagen de prueba" -ForegroundColor White
Write-Host ""
Write-Host "Si hay errores de permisos:" -ForegroundColor Yellow
Write-Host "- Conecta por FTP o File Manager de Hostinger" -ForegroundColor White
Write-Host "- Cambia permisos de 'uploads/' a 755 o 777" -ForegroundColor White
