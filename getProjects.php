<?php
/**
 * getProjects.php
 * ===============
 * This PHP script returns a JSON list of available projects
 * by scanning the Projects directory. Includes detailed error logging and execution check.
 */

header('Content-Type: application/json');

// Log the start of the script execution and the current directory
error_log('getProjects.php: Script execution started.');
error_log('getProjects.php: __DIR__ value: ' . __DIR__);

$response = ['status' => 'error', 'message' => 'Unknown error']; // Default error response

try {
    // Define the path to the Projects directory
    $projectsDir = __DIR__ . '/Projects'; // Korrigierter Pfad

    // Log the directory path being used
    error_log('getProjects.php: Checking directory: ' . $projectsDir);

    // Verify directory exists
    if (!is_dir($projectsDir)) {
        throw new Exception('Projects directory not found at: ' . $projectsDir);
    }

    // Get all directories in the Projects folder
    $projects = array_filter(glob($projectsDir . '/*'), 'is_dir');

    // Extract just the folder names
    $projectNames = array_map('basename', $projects);

    // Log the found project names
    error_log('getProjects.php: Found projects: ' . implode(', ', $projectNames));

    // Verify we found some projects
    if (empty($projectNames)) {
        throw new Exception('No projects found in directory: ' . $projectsDir);
    }

    $response = [
        'status' => 'success',
        'projects' => $projectNames
    ];

} catch (Exception $e) {
    // Log the exception message and the directory
    error_log('getProjects.php: Exception: ' . $e->getMessage() . ' in directory: ' . $projectsDir);
    $response = [
        'status' => 'error',
        'message' => $e->getMessage(),
        'directory' => $projectsDir
    ];
    http_response_code(500); // Ensure the 500 status code is sent
}

echo json_encode($response);
?>
