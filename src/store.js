import { writable } from 'svelte/store';
import initialProjects from './data/projects.json';

// Create a writable store initialized with your data
export const projects = writable(initialProjects);

// DEBUG: log whenever the projects store updates
projects.subscribe(value => {
  // Log small summary to avoid huge dumps
  console.debug('[store] projects updated — count:', (value && value.length) || 0, 'firstId:', value?.[0]?.id);
});

// Function to call the local Node.js endpoint
// The function must accept the current data to be saved
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