<?php
// Define the directory path to scan
$directory = '../../Files/Photos';

// Array to store photo information
$photos = array();

// Check if the directory exists
if (is_dir($directory)) {
    // Scan the directory for image files
    $files = scandir($directory);

    foreach ($files as $file) {
        // Only include image files with specific extensions
        if (preg_match('/\.(png|jpg|jpeg|gif|webp)$/i', $file)) {
            $filePath = $directory . '/' . $file;

            // Get file modification time and format it
            $fileDate = date("Y-m-d", filemtime($filePath));

            // Add the photo details to the array
            $photos[] = array(
                'name' => $file,
                'src' => $filePath,
                'date' => $fileDate
            );
        }
    }
}

// Send the photo data as a JSON response
header('Content-Type: application/json');
echo json_encode($photos);
?>
