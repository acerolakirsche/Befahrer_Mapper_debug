<?php
/**
 * getProjects.php
 * ===============
 * This PHP script returns a JSON list of available projects
 * by scanning the Projects directory.
 */

header('Content-Type: application/json');

try {
  // Define the path to the Projects directory
  $projectsDir = '../Projects';
  
  // Verify directory exists
  if (!is_dir($projectsDir)) {
    throw new Exception('Projects directory not found');
  }
  
  // Get all directories in the Projects folder
  $projects = array_filter(glob($projectsDir . '/*'), 'is_dir');
  
  // Extract just the folder names
  $projectNames = array_map('basename', $projects);
  
  // Return the project names as JSON
  echo json_encode($projectNames);
} catch (Exception $e) {
  // Return error message
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
?>
