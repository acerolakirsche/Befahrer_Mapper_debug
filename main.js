/**
 * main.js
 * =======
 * This is the main script that initializes and controls the application.
 * It handles:
 * - Map initialization
 * - Project selection and overlay display
 * - Drag and drop functionality for KML files
 * - Layer management
 * - Global variables and state
 */

// Initialize the map with focus on Germany
const map = L.map('map').setView([51.1657, 10.4515], 6);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Global variables
const layers = []; // Stores information about all KML layers
const kmlItems = document.getElementById('kml-items'); // Container for KML list items
let selectedProject = null; // Currently selected project
let projectOverlay = null; // Project name overlay

// Initialize project selection
const projectSelect = document.getElementById('project-select');

/**
 * Fetches available projects from the server
 */
async function fetchProjects() {
  try {
    const response = await fetch('getProjects.php');
    if (!response.ok) throw new Error('Network response was not ok');
    
    const projects = await response.json();
    
    // Clear existing options
    projectSelect.innerHTML = '<option value="">-- Please select a project --</option>';
    
    // Add new options
    projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project;
      option.textContent = project;
      projectSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    showTempMessage('Error loading projects', '#ff0000');
  }
}

/**
 * Updates the project name overlay
 * @param {string} projectName - The name of the selected project
 */
function updateProjectOverlay(projectName) {
  // Remove existing overlay if present
  if (projectOverlay) {
    map.removeControl(projectOverlay);
    projectOverlay = null;
  }
  
  // Create new overlay if a project is selected
  if (projectName) {
    projectOverlay = L.control({position: 'topleft'});
    projectOverlay.onAdd = () => {
      const div = L.DomUtil.create('div', 'project-name-overlay');
      div.innerHTML = `Selected Project: ${projectName}`;
      return div;
    };
    projectOverlay.addTo(map);
  }
}

// Handle project selection change
projectSelect.addEventListener('change', (e) => {
  selectedProject = e.target.value;
  updateProjectOverlay(selectedProject);
});

// Initialize project list on page load
fetchProjects();

// Rest of the existing code remains unchanged
/* ... (previous code remains unchanged) ... */
