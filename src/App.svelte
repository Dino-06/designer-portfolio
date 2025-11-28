<script>
    import { projects, saveProjectsToDisk } from './store.js';
    import ProjectList from './components/ProjectList.svelte'; 
    import ProjectEditor from './components/ProjectEditor.svelte'; 

    // --- STATE ---
    let selectedProjectId = $projects[0]?.id;
    
    // Derived list of unique categories
    $: uniqueCategories = Array.from(new Set($projects.map(p => p.category))).sort();

    // Reactive object for the selected project
    $: selectedProjectObject = $projects.find(p => p.id === selectedProjectId);

    // --- UTILITY/STATE MANAGEMENT FUNCTIONS ---

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
                brief: 'This is a new project waiting for your custom brief.',
                sections: [
                    {
                        id: 'getting-started',
                        title: '01. Getting Started',
                        content: 'Describe the challenge here.',
                        mediaItems: []
                    }
                ]
            }
        };

        projects.update(currentProjects => {
            currentProjects.push(newProject);
            return currentProjects;
        });
        selectedProjectId = newId;
    }

    // --- DATA HANDLING AND OUTPUT (JSON only) ---

    function handleSaveAndCopy() {
        saveProjectsToDisk($projects).then(success => {
            if (success) {
                alert('Projects saved locally to projects.json. Use the output area below to copy/download the JSON.');
            } else {
                alert('ERROR: Failed to save to disk. Check your console for details.');
            }
        });
    }

    function generateJSON(data) {
        return JSON.stringify(data, null, 4);
    }

    $: jsOutput = generateJSON($projects);

    async function copyGeneratedCode() {
        try {
            await navigator.clipboard.writeText(jsOutput);
            alert('Generated JSON copied to clipboard. Replace the contents of projects.json with it.');
        } catch (err) {
            // Fallback: select textarea so user can copy manually
            const ta = document.getElementById('js-output');
            if (ta) {
                ta.select();
                document.execCommand('copy');
                alert('Copied using fallback selection. If that failed, please select and copy manually.');
            } else {
                alert('Copy failed. Please select and copy the output manually.');
            }
            console.error('Copy failed', err);
        }
    }

    function downloadJSON() {
        const blob = new Blob([jsOutput], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'projects.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
</script>

<main>
    <div class="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        <h1 class="text-4xl font-black text-indigo-700 mb-2">Portfolio Content Editor</h1>
        <p class="text-gray-600 mb-8">Edit projects and export a JSON file for use on the site. Only JSON output is produced by this editor.</p>

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
            <ProjectEditor bind:project={selectedProjectObject} {uniqueCategories} />
        {:else}
            <div class="text-center p-12 text-gray-500">
                Select a project to begin editing, or click '➕ Add New Project'.
            </div>
        {/if}

        <hr class="my-8" />

        <div class="sticky-actions bg-white p-4 mb-6 border-b border-gray-200 shadow-lg -mx-10 px-10">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div class="flex space-x-3">
                    <button on:click={handleSaveAndCopy} class="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                        💾 Save to Disk
                    </button>
                    <button on:click={copyGeneratedCode} class="px-4 py-2 rounded-md border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50">
                        📋 Copy JSON
                    </button>
                    <button on:click={downloadJSON} class="px-4 py-2 rounded-md border bg-white hover:bg-gray-50">
                        ⤓ Download JSON
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-10 p-6 border-t pt-8">
            <h2 class="text-3xl font-bold mb-4">Generated JSON (Replace projects.json)</h2>
            <p class="text-sm text-red-600 mb-4">Copy ALL text below and replace the entire contents of your projects.json file.</p>
            <textarea id="js-output" rows="20" class="w-full rounded-md border-gray-300 shadow-sm p-3 border font-mono text-xs bg-gray-800 text-green-300" readonly bind:value={jsOutput}></textarea>
        </div>
    </div>
</main>