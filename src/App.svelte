<script>
    import { projects, saveProjectsToDisk } from './store.js';
    import ProjectList from './components/ProjectList.svelte'; 
    import ProjectEditor from './components/ProjectEditor.svelte'; 
    // NOTE: Removed GeminiTools import as requested.

    // --- STATE ---
    let selectedProjectId = $projects[0]?.id;
    
    // Derived list of unique categories
    $: uniqueCategories = Array.from(new Set($projects.map(p => p.category))).sort();

    // FIX: Reactive statement to get the mutable project object. This replaces the crashing binding.
    $: selectedProjectObject = $projects.find(p => p.id === selectedProjectId);

    // --- UTILITY/STATE MANAGEMENT FUNCTIONS (REQUIRED) ---

    function reorderProject(projectId, direction) {
        projects.update(currentProjects => {
            const index = currentProjects.findIndex(p => p.id === projectId);
            if (index === -1) return currentProjects;

            const newIndex = index + direction;
            if (newIndex < 0 || newIndex >= currentProjects.length) return currentProjects;

            const [project] = currentProjects.splice(index, 1);
            currentProjects.splice(newIndex, 0, project);
            return currentProjects;
        });
    }

    function deleteProject(projectId) {
        if (confirm("Are you sure you want to permanently delete this project? This cannot be undone.")) {
            projects.update(currentProjects => {
                const indexToDelete = currentProjects.findIndex(p => p.id === projectId);
                if (indexToDelete === -1) return currentProjects;

                currentProjects.splice(indexToDelete, 1);

                if (selectedProjectId === projectId) {
                    selectedProjectId = currentProjects[0]?.id;
                }
                return currentProjects;
            });
            alert('Project deleted successfully.');
        }
    }

    function duplicateProject(projectId) {
        projects.update(currentProjects => {
            const originalProject = currentProjects.find(p => p.id === projectId);
            if (!originalProject) return currentProjects;

            const duplicatedProject = JSON.parse(JSON.stringify(originalProject));
            
            const newId = `project-${crypto.randomUUID()}`;
            duplicatedProject.id = newId;
            duplicatedProject.title = `${originalProject.title} (COPY)`;
            duplicatedProject.isHidden = true;
            
            const originalIndex = currentProjects.findIndex(p => p.id === projectId);
            currentProjects.splice(originalIndex + 1, 0, duplicatedProject);
            
            selectedProjectId = newId;
            alert(`Project "${duplicatedProject.title}" duplicated successfully. Now editing the copy (DRAFT).`);
            return currentProjects;
        });
    }

    function createNewProject() {
        const newId = `project-${crypto.randomUUID()}`;
        const newProject = {
            id: newId, 
            title: 'NEW PROJECT TITLE', 
            category: uniqueCategories[0] || 'New Category',
            year: (new Date()).getFullYear().toString(),
            heroImage: 'https://placehold.co/800x600/cccccc/333333?text=New+Project', 
            accentColor: 'bg-indigo-600', 
            isHidden: true,
            caseStudy: {
                client: '', 
                role: '', 
                duration: '',
                brief: 'This is a new project waiting for your custom brief. Check the "Hide Project" box to make it visible on the live site.',
                sections: [
                    { 
                        id: 'getting-started', 
                        title: '01. Getting Started', 
                        content: 'Describe the challenge here.',
                        mediaItems: []
                    }
                ],
            }
        };

        projects.update(currentProjects => {
            currentProjects.push(newProject);
            return currentProjects;
        });
        selectedProjectId = newId;
    }
    
    // --- DATA HANDLING AND OUTPUT ---

    function handleSaveAndCopy() {
        // FIX: Pass the current store state ($projects) to the save function
        saveProjectsToDisk($projects).then(success => {
            if (success) {
                alert('Projects saved locally to projects.json! Please copy the code below into projects_data.js.');
            } else {
                alert('ERROR: Failed to save to disk. Check your console for details.');
            }
        });
    }
    
    // Function to generate the JavaScript output string
    function updateJSOutput(data) {
        let rawArrayString = JSON.stringify(data, null, 4);
        const keysToUnquote = ['id', 'title', 'category', 'year', 'heroImage', 'accentColor', 'isHidden', 'caseStudy', 'client', 'role', 'duration', 'brief', 'sections', 'content', 'mediaItems', 'url', 'isVideo']; 
        
        keysToUnquote.forEach(key => {
            const regex = new RegExp(`"${key}":`, 'g');
            rawArrayString = rawArrayString.replace(regex, `${key}:`);
        });
        
        const finalOutput = `const ALL_PROJECTS = ${rawArrayString};`;
        return finalOutput;
    }

    $: jsOutput = updateJSOutput($projects);

    function copyGeneratedCode() {
        const outputTextarea = document.getElementById('js-output');
        if (outputTextarea) {
            outputTextarea.select();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(outputTextarea.value)
                    .then(() => alert('Generated JavaScript code has been copied to your clipboard. Replace the entire content of projects_data.js.'))
                    .catch(err => console.error('Modern copy failed', err));
            } else {
                 document.execCommand('copy');
            }
        }
    }
</script>

<main>
    <div class="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        <h1 class="text-4xl font-black text-indigo-700 mb-2">Portfolio Content Editor</h1>
        <p class="text-gray-600 mb-8">Edit your project data below. When done, click **Save to Disk** and copy the generated code into **`projects_data.js`**.</p>
        
        <ProjectList 
            bind:selectedProjectId={selectedProjectId} 
            {reorderProject}
            {deleteProject}
            {duplicateProject}
            {createNewProject}
            projects={$projects}
        />

        <hr class="my-8" />

        {#if selectedProjectObject}
            <ProjectEditor 
                bind:project={selectedProjectObject} 
                {uniqueCategories}
            />
        {:else}
            <div class="text-center p-12 text-gray-500">
                Select a project to begin editing, or click '➕ Add New Project'.
            </div>
        {/if}

        <hr class="my-8" />
        
        <div class="sticky-actions bg-white p-4 mb-6 border-b border-gray-200 shadow-lg -mx-10 px-10">
            <div class="flex space-x-3">
                <button on:click={handleSaveAndCopy} class="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-grow">
                    💾 Save to Disk & Update Code Output
                </button>
                <button on:click={copyGeneratedCode} class="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 shadow-sm text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none flex-grow">
                    📋 Copy Generated Code
                </button>
            </div>
        </div>

        <div class="mt-10 p-6 border-t pt-8">
            <h2 class="text-3xl font-bold mb-4">Generated Project Data (Copy/Paste OVER WHOLE FILE)</h2>
            <p class="text-sm text-red-600 mb-4">🚨 **CRITICAL STEP:** Copy ALL text below and **REPLACE THE ENTIRE CONTENTS** of your **`projects_data.js`** file with it.</p>
            <textarea id="js-output" rows="20" class="w-full rounded-md border-gray-300 shadow-sm p-3 border font-mono text-xs bg-gray-800 text-green-300" readonly bind:value={jsOutput}></textarea>
        </div>
    </div>
</main>