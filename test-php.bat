@echo off
echo Iniciando servidor PHP en puerto 8000...
echo.
echo El endpoint estara disponible en: http://localhost:8000/api/upload-image.php
echo La carpeta uploads/ estara en: %CD%\uploads\
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
php -S localhost:8000 -t .
