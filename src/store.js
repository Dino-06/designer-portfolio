import { writable } from 'svelte/store';
// CRITICAL FIX: Ensure this is the relative path, not an absolute project alias
import initialProjects from './data/projects.json'; 

// Create a writable store initialized with your data
export const projects = writable(initialProjects);

// Function to call the local Node.js endpoint
// FIX: The function must accept the current data to be saved
export async function saveProjectsToDisk(currentProjectsData) {
    const projectsData = JSON.stringify(currentProjectsData, null, 4);
    
    try {
        const response = await fetch('/save-projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: projectsData
        });

        if (response.ok) {
            console.log('Data successfully saved to projects.json');
            return true;
        } else {
            const errorText = await response.text();
            console.error('Server failed to save data:', errorText);
            return false;
        }
    } catch (error) {
        console.error('Network error during save:', error);
        return false;
    }
}