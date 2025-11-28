<script>
    import { createEventDispatcher } from 'svelte';
    import { projects } from '../store.js'; 
    export let selectedProjectId;
    export let reorderProject;
    export let deleteProject;
    export let duplicateProject;
    export let createNewProject;

    const dispatch = createEventDispatcher();

    // Dispatch a selection event to the parent. Parent will set selectedProjectId.
    function selectProject(projectId) {
        if (projectId) {
            // Also update local value so the select control reflects the choice
            selectedProjectId = projectId;
            dispatch('select', projectId);
        }
    }
</script>

<div class="sticky-actions bg-white p-4 mb-6 border-b border-gray-200 shadow-lg -mx-10 px-10">
    <div class="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0 md:space-x-4">
        <div class="flex items-center space-x-2 flex-grow">
            <label for="quick-select-project" class="text-sm font-medium text-gray-700">Jump to Project:</label>
            <select id="quick-select-project" bind:value={selectedProjectId} on:change={(e) => selectProject(e.target.value)} class="py-2 px-3 border border-gray-300 rounded-md shadow-sm w-full md:w-auto">
                <option value="">-- Select Project --</option>
                {#each $projects as project, index}
                    <option value={project.id}>
                        {index + 1}. {project.title} {project.isHidden ? '(DRAFT)' : ''}
                    </option>
                {/each}
            </select>
        </div>
        
        <div class="flex space-x-3 flex-shrink-0">
            <button on:click={createNewProject} class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600">
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
            <button type="button" class="text-gray-500 hover:text-indigo-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed" disabled={index === 0} on:click={() => reorderProject(project.id, -1)} title="Move Up">
                ▲
            </button>
            <button type="button" class="text-gray-500 hover:text-indigo-600 p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed" disabled={index === $projects.length - 1} on:click={() => reorderProject(project.id, 1)} title="Move Down">
                ▼
            </button>
            
            <button type="button" class="text-gray-500 hover:text-orange-600 p-1 rounded" on:click={() => duplicateProject(project.id)} title="Duplicate Project">
                ⧉
            </button>

            <button class="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm hover:bg-gray-50 flex-grow {isHiddenClass}{selectedClass}" on:click={() => selectProject(project.id)}>
                {index + 1}. {project.title} {project.isHidden ? ' (DRAFT)' : ''}
            </button>
            
            <button type="button" class="text-gray-500 hover:text-red-600 p-1 rounded" on:click={() => deleteProject(project.id)} title="Delete Project">
                🗑
            </button>
        </div>
    {/each}
</div>

<style>
    .project-selected {
        border: 2px solid #4f46e5 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
    }
</style>