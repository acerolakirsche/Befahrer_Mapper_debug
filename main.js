/**
 * main.js
 * =======
 * This is the main script that initializes and controls the application.
 * It handles:
 * - Map initialization
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

// Set up drag and drop handlers for the map
const dropArea = document.getElementById('map');

// Handle drag over event
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = '#f0f0f0'; // Visual feedback
});

// Handle drag leave event
dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = ''; // Reset background
});

// Handle drop event
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = ''; // Reset background

  // Get dropped files
  const files = e.dataTransfer.files;

  // Process KML files and get results
  const { ignoredFiles, addedFiles } = processKMLFiles(files, map, kmlItems, layers);

  // Show messages for ignored and added files
  let ignoreMessageElement = null;
  if (ignoredFiles.length > 0) {
    const message = `<b>Ignored (duplicates):</b>\n${ignoredFiles.join('\n')}`;
    ignoreMessageElement = showTempMessage(message, '#ffa500'); // Orange for ignored
  }

  if (addedFiles.length > 0) {
    const message = `<b>Successfully added:</b>\n${addedFiles.join('\n')}`;
    setTimeout(() => {
      // Position success message below ignore message if it exists
      const offset = ignoreMessageElement ? ignoreMessageElement.offsetHeight + 20 : 0;
      showTempMessage(message, '#4CAF50', 5000, offset); // Green for success
    }, 100);
  }
});

// Global variables for KML layers and list items
const layers = []; // Stores information about all KML layers
const kmlItems = document.getElementById('kml-items'); // Container for KML list items
const projectSelector = document.getElementById('project-selector');
const selectedProjectDisplay = document.getElementById('selected-project-display');
let currentProject = null; // Track currently selected project

/**
 * Loads KML files from selected project folder
 * @param {string} projectName - Name of the project folder
 */
async function loadProjectKMLs(projectName) {
  if (projectName === currentProject) return; // Skip if same project selected
  
  // Clear existing layers and list
  layers.forEach(layerInfo => {
    map.removeLayer(layerInfo.mainLayer);
    map.removeLayer(layerInfo.shadowLayer);
  });
  layers.length = 0;
  kmlItems.innerHTML = '';
  
  try {
    // Fetch directory listing
    const response = await fetch(`Befahrungsprojekte/${projectName}/`);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    
    // Extract KML files from directory listing
    const kmlFiles = Array.from(doc.querySelectorAll('a'))
      .map(a => a.textContent)
      .filter(name => name.endsWith('.kml'))
      .map(name => new File([], name));
    
    if (kmlFiles.length > 0) {
      // Process each KML file from the server
      for (const file of kmlFiles) {
        await processKMLFile(file, map, kmlItems, layers);
      }
    }
    
    currentProject = projectName;
    selectedProjectDisplay.textContent = projectName;
  } catch (error) {
    console.error('Error loading project KMLs:', error);
    showTempMessage('Error loading project KMLs', '#ff4444');
  }
}

// Fetch and populate the project dropdown
fetch('getProjects.php')
  .then(response => response.json())
  .then(projects => {
    projects.forEach(project => {
      const option = document.createElement('option');
      option.value = project;
      option.textContent = project;
      projectSelector.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching projects:', error);
  });

// Add event listener to the project selector
projectSelector.addEventListener('change', function() {
  const selectedProject = this.value;
  if (selectedProject) {
    loadProjectKMLs(selectedProject);
  }
});
