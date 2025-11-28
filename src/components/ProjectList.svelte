<script>
    import { createEventDispatcher } from 'svelte';
    // Import the global store for reactive list rendering
    import { projects } from '../store.js'; 

    export let selectedProjectId;
    export let reorderProject;
    export let deleteProject;
    export let duplicateProject;
    export let createNewProject;

    // Tailwind map for consistent colors
    const TAILWIND_COLORS_MAP = [
        { class: 'bg-indigo-600', hex: '#4f46e5', name: 'Indigo' },
        // ... (Define all the colors from OLD_admin.html here for completeness)
    ];

    // Function for jump-to-project select box
    function selectProject(projectId) {
        if (projectId) {
            selectedProjectId = projectId;
        }
    }
</script>

<div class="sticky-actions bg-white p-4 mb-6 border-b border-gray-200 shadow-lg -mx-10 px-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
        
        <div class="flex items-center space-x-2 flex-grow">
            <label for="quick-select-project" class="text-sm font-medium text-gray-700">Jump to Project:</label>
            <select id="quick-select-project" on:change={(e) => selectProject(e.target.value)} class="py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full md:w-auto" bind:value={selectedProjectId}>
                <option value="">-- Select Project --</option>
                {#each $projects as project, index}
                    <option value={project.id}>
                        {index + 1}. {project.title} {project.isHidden ? '(DRAFT)' : ''}
                    </option>
                {/each}
            </select>
        </div>
        
        <div class="flex space-x-3 flex-shrink-0">
            <button on:click={createNewProject} class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                ➕ Add New Project
            </button>
        </div>
    </div>
</div>



<div class="space-y-2">
    <h2 class="text-2xl font-bold mb-4">Select Project to Edit (or create a new one):</h2>
    
    {#each $projects as project, index}
        {@const isHiddenClass = project.isHidden ? 'border-red-500 bg-red-100 text-red-700' : 'border-gray-300 text-gray-700 bg-white'}
        {@const selectedClass = selectedProjectId === project.id ? ' project-selected border-indigo-600 ring-4 ring-indigo-100' : ''}

        <div class="flex items-center space-x-3 mb-2">
            <button type="button" 
                    class="text-gray-500 hover:text-indigo-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={index === 0}
                    on:click={() => reorderProject(project.id, -1)}
                    title="Move Up">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" /></svg>
            </button>
            <button type="button" 
                    class="text-gray-500 hover:text-indigo-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={index === $projects.length - 1}
                    on:click={() => reorderProject(project.id, 1)}
                    title="Move Down">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>
            
            <button type="button" 
                    class="text-gray-500 hover:text-orange-600 p-1 rounded"
                    on:click={() => duplicateProject(project.id)}
                    title="Duplicate Project">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v4m0 0v4m0-4h4m-4 0H4m8 8h.01M12 11h.01M12 7h.01M16 11h.01M16 7h.01M16 15h.01M16 19h.01M16 19v-4m0 4l4-4M16 19l-4-4"/></svg>
            </button>

            
            <button 
                class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 flex-grow {isHiddenClass}{selectedClass}"
                on:click={() => selectProject(project.id)}
            >
                {index + 1}. {project.title} {project.isHidden ? ' (DRAFT)' : ''}
            </button>
            
            <button type="button" 
                    class="text-gray-500 hover:text-red-600 p-1 rounded"
                    on:click={() => deleteProject(project.id)}
                    title="Delete Project">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    {/each}
</div>

<style>
    /* Class for highlighting the selected project (from OLD_admin.html) */
    .project-selected {
        border: 2px solid #4f46e5 !important; /* Indigo-600 */
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    }
</style>