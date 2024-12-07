<?php
header('Content-Type: application/json');
$path = isset($_GET['path']) ? $_GET['path'] : '.';
$dir = rtrim($path, '/');
$files = array();

if (is_dir($dir)) {
    $items = scandir($dir);

    foreach ($items as $item) {
        if ($item != "." && $item != "..") {
            $filePath = $dir . '/' . $item;
            $fileInfo = pathinfo($filePath);
            $fileType = is_dir($filePath) ? 'folder' : 'file';

            $file = array(
                'name' => $item,
                'type' => $fileType,
                'extension' => isset($fileInfo['extension']) ? '.' . $fileInfo['extension'] : '',
                'size' => filesize($filePath) / 1024, // File size in KB
                'date' => date("F d Y H:i:s.", filemtime($filePath))
            );

            $files[] = $file;
        }
    }
}

echo json_encode(['files' => $files]);
?>
