<script>
    import { onMount } from 'svelte';
    import MediaItem from './MediaItem.svelte';
    import { projects } from '../store.js';

    // Accept projectId (App passes selectedProjectId)
    export let projectId;
    export let uniqueCategories = [];

    const TAILWIND_COLORS_MAP = [
        { class: 'bg-indigo-600', hex: '#4f46e5', name: 'Indigo' },
        { class: 'bg-blue-600', hex: '#2563eb', name: 'Blue' },
        { class: 'bg-green-600', hex: '#16a34a', name: 'Green' },
        { class: 'bg-emerald-700', hex: '#059669', name: 'Emerald' },
        { class: 'bg-yellow-600', hex: '#ca8a04', name: 'Yellow' },
        { class: 'bg-orange-600', hex: '#ea580c', name: 'Orange' },
        { class: 'bg-red-600', hex: '#dc2626', name: 'Red' },
        { class: 'bg-pink-600', hex: '#db2777', name: 'Pink' },
        { class: 'bg-purple-600', hex: '#9333ea', name: 'Purple' },
        { class: 'bg-gray-700', hex: '#374151', name: 'Gray' }
    ];

    // Derive the live project from the store
    $: project = $projects?.find(p => p.id === projectId) ?? null;

    // Local UI state derived from the live project (safe guards)
    $: enableClient = !!project?.caseStudy?.client;
    $: enableRole = !!project?.caseStudy?.role;
    $: enableDuration = !!project?.caseStudy?.duration;
    $: isCustomCategory = project ? !uniqueCategories.includes(project.category) : false;
    $: customCategoryValue = isCustomCategory && project ? project.category : '';

    onMount(() => {
        console.debug('[editor] mounted, projectId=', projectId);
    });

    $: if (projectId) {
        console.debug('[editor] reactive projectId changed:', projectId);
    }

    $: if (project) {
        console.debug('[editor] derived project loaded', { id: project.id, title: project.title, sections: (project.caseStudy?.sections || []).length });
    }

    // Replace project in the store to trigger reactivity
    function syncProjectToStore() {
        if (!project) {
            console.debug('[editor] syncProjectToStore skipped, no project');
            return;
        }

        // DEBUG: log when the editor writes back to the store
        console.debug('[editor] syncProjectToStore', {
            id: project.id,
            title: project.title,
            sections: project.caseStudy?.sections?.length ?? 0
        });

        // Robust update: replace the exact item in the array via projects.update
        projects.update(prev => {
            const idx = prev.findIndex(p => p.id === project.id);
            if (idx === -1) return prev;
            const copy = prev.slice();
            let cloned;
            try {
                cloned = typeof structuredClone === 'function' ? structuredClone(project) : JSON.parse(JSON.stringify(project));
            } catch (e) {
                cloned = JSON.parse(JSON.stringify(project));
            }
            copy[idx] = cloned;
            return copy;
        });
    }

    function handleCategoryChange(e) {
        if (!project) return;
        if (e.target.value === '--- Custom/New Category ---') {
            isCustomCategory = true;
            project.category = customCategoryValue || 'New Category';
        } else {
            isCustomCategory = false;
            project.category = e.target.value;
        }
        syncProjectToStore();
    }

    $: if (isCustomCategory && project) {
        project.category = customCategoryValue || 'New Category';
        syncProjectToStore();
    }

    function addSectionField() {
        if (!project) return;
        const sections = project.caseStudy?.sections || [];
        const newIndex = sections.length;
        const newSection = {
            id: `new-section-${newIndex + 1}`,
            title: `${String(newIndex + 1).padStart(2, '0')}. NEW SECTION`,
            content: 'Add new content here.',
            mediaItems: []
        };
        project.caseStudy.sections = [...sections, newSection];
        console.debug('[editor] addSectionField -> sections now', project.caseStudy.sections.length);
        syncProjectToStore();
    }

    function removeSection(indexToRemove) {
        if (!project || !project.caseStudy || !project.caseStudy.sections[indexToRemove]) {
            console.debug('[editor] removeSection skipped, invalid index', indexToRemove);
            return;
        }
        if (!confirm(`Are you sure you want to remove Section ${indexToRemove + 1}: ${project.caseStudy.sections[indexToRemove].title}?`)) {
            console.debug('[editor] removeSection cancelled by user');
            return;
        }

        const sections = project.caseStudy.sections.filter((_, i) => i !== indexToRemove);

        sections.forEach((s, i) => {
            const newTitlePrefix = String(i + 1).padStart(2, '0') + ". ";
            const oldTitleSuffix = s.title.replace(/^\d{2}\. /, '').trim();
            s.title = newTitlePrefix + oldTitleSuffix;
            s.id = oldTitleSuffix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${i + 1}`;
        });

        project.caseStudy.sections = sections;
        console.debug('[editor] removeSection -> sections now', project.caseStudy.sections.length);
        syncProjectToStore();
    }

    // Remove specific media item (used if MediaItem dispatches an event)
    function removeMediaItemAt(sectionIndex, itemIndex) {
        if (!project || !project.caseStudy || !project.caseStudy.sections[sectionIndex]) {
            console.debug('[editor] removeMediaItemAt skipped invalid', { sectionIndex, itemIndex });
            return;
        }
        const section = project.caseStudy.sections[sectionIndex];
        if (!section.mediaItems || !section.mediaItems[itemIndex]) {
            console.debug('[editor] removeMediaItemAt nothing to remove', { sectionIndex, itemIndex });
            return;
        }
        if (!confirm(`Remove media item ${itemIndex + 1} from section ${sectionIndex + 1}?`)) {
            return;
        }
        section.mediaItems = section.mediaItems.filter((_, i) => i !== itemIndex);

        // reassign to trigger binding in nested structures
        project.caseStudy.sections = project.caseStudy.sections;
        console.debug('[editor] removeMediaItemAt -> mediaCount', section.mediaItems.length);
        syncProjectToStore();
    }

    function updateSectionTitle(section, index, inputTitle) {
        if (!project) return;
        const titleSuffix = inputTitle.trim();
        const baseId = titleSuffix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${index + 1}`;
        section.title = `${String(index + 1).padStart(2, '0')}. ${titleSuffix}`;
        section.id = baseId;
        project.caseStudy.sections = project.caseStudy.sections;
        console.debug('[editor] updateSectionTitle', { index, title: section.title });
        syncProjectToStore();
    }

    function addMediaItemToSection(sectionIndex) {
        if (!project) return;
        const section = project.caseStudy.sections[sectionIndex];
        if (!section) return;
        section.mediaItems = [...(section.mediaItems || []), { url: '', isVideo: false }];
        project.caseStudy.sections = project.caseStudy.sections;
        console.debug('[editor] addMediaItemToSection', { sectionIndex, mediaCount: section.mediaItems.length });
        syncProjectToStore();
    }

    // Helper used by the template to show title without the leading "01. " prefix
    function getTitleSuffix(title) {
        if (!title) return '';
        return title.replace(/^\d{2}\. /, '').trim();
    }
</script>

{#if !project}
    <div class="p-6 text-center text-gray-500">
        Select a project to begin editing.
    </div>
{:else}
<div class="mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow-inner">
    <h2 id="project-editor-heading" class="text-2xl font-bold mb-4">Edit Project: <span class="text-indigo-600">{project.title}</span></h2>

    <form class="space-y-6" aria-labelledby="project-editor-heading" on:submit|preventDefault>
        <!-- A. General Project Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label for="project-id" class="block text-sm font-medium text-gray-700">ID (Read-Only)</label>
                <input id="project-id" name="project-id" type="text" value={project.id} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2" readonly>
            </div>

            <div>
                <label for="project-title" class="block text-sm font-medium text-gray-700">Project Title</label>
                <input id="project-title" name="project-title" type="text" bind:value={project.title} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" on:input={syncProjectToStore}>
            </div>
        </div>

        <!-- Category / Year / Accent -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="category-select" class="block text-sm font-medium text-gray-700">Category (Select or Type New)</label>
                <select id="category-select" name="category-select" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        on:change={handleCategoryChange}
                        value={isCustomCategory ? '--- Custom/New Category ---' : project.category}>
                    {#each uniqueCategories as category}
                        <option value={category}>{category}</option>
                    {/each}
                    <option value="--- Custom/New Category ---">--- Custom/New Category ---</option>
                </select>

                {#if isCustomCategory}
                    <label for="category-custom" class="sr-only">Custom category</label>
                    <input id="category-custom" name="category-custom" type="text" placeholder="Or enter new category..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={customCategoryValue} on:input={syncProjectToStore}>
                {/if}
            </div>

            <div>
                <label for="project-year" class="block text-sm font-medium text-gray-700">Year</label>
                <input id="project-year" name="project-year" type="number" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.year} on:input={syncProjectToStore}>
            </div>

            <div>
                <label for="accentColor-select" class="block text-sm font-medium text-gray-700 mb-2">Accent Color (Tailwind Class)</label>
                <div class="flex items-center space-x-3">
                    <select id="accentColor-select" name="accentColor-select" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.accentColor} on:change={syncProjectToStore}>
                        {#each TAILWIND_COLORS_MAP as color}
                            <option value={color.class}>{color.name} ({color.class})</option>
                        {/each}
                    </select>
                    <div aria-hidden class="h-8 w-8 rounded-md border-2 border-gray-300 flex-shrink-0" class:bg-indigo-600={project.accentColor === 'bg-indigo-600'}></div>
                </div>
            </div>
        </div>

        <!-- Hero image and hidden checkbox -->
        <div>
            <label for="heroImage" class="block text-sm font-medium text-gray-700">Hero Image URL</label>
            <div class="flex space-x-2 mt-1">
                <input id="heroImage" name="heroImage" type="url" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.heroImage} on:input={syncProjectToStore}>
            </div>

            <div class="mt-2">
                <div class="preview-container border border-gray-300 rounded-md bg-gray-200 overflow-hidden">
                    {#if project.heroImage}
                        <img src={project.heroImage.trim()} class="w-full h-full object-cover" alt="Hero Preview" on:error={(e) => e.target.src='https://placehold.co/192x120/cc0000/ffffff?text=Load+Error'}>
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Media URL</div>
                    {/if}
                </div>
            </div>
        </div>

        <div class="flex items-center space-x-3 p-3 border border-red-300 bg-red-50 rounded-md">
            <input id="isHidden" name="isHidden" type="checkbox" class="rounded text-red-600 focus:ring-red-500" bind:checked={project.isHidden} on:change={syncProjectToStore}>
            <label for="isHidden" class="text-base font-medium text-red-700">Hide Project (Draft Mode)</label>
            <p class="text-xs text-red-600">(If checked, this project will NOT appear on the live site.)</p>
        </div>

        <!-- Modal intro & details -->
        <div>
            <label for="brief" class="block text-sm font-medium text-gray-700">Brief (Modal Intro Summary)</label>
            <div class="flex space-x-2 mt-1">
                <textarea id="brief" name="brief" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.brief} on:input={syncProjectToStore}></textarea>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md bg-gray-50">
            <div class="flex flex-col">
                <div class="flex items-center space-x-2 mb-1">
                    <input id="enableClient" name="enableClient" type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableClient} on:change={() => { if(!enableClient) project.caseStudy.client=''; syncProjectToStore(); }}>
                    <label for="enableClient" class="text-sm font-medium text-gray-700">Client</label>
                </div>
                <input id="client" name="client" type="text" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.client} disabled={!enableClient} on:input={syncProjectToStore}>
            </div>

            <div class="flex flex-col">
                <div class="flex items-center space-x-2 mb-1">
                    <input id="enableRole" name="enableRole" type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableRole} on:change={() => { if(!enableRole) project.caseStudy.role=''; syncProjectToStore(); }}>
                    <label for="enableRole" class="text-sm font-medium text-gray-700">Role</label>
                </div>
                <input id="role" name="role" type="text" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.role} disabled={!enableRole} on:input={syncProjectToStore}>
            </div>

            <div class="flex flex-col">
                <div class="flex items-center space-x-2 mb-1">
                    <input id="enableDuration" name="enableDuration" type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableDuration} on:change={() => { if(!enableDuration) project.caseStudy.duration=''; syncProjectToStore(); }}>
                    <label for="enableDuration" class="text-sm font-medium text-gray-700">Duration</label>
                </div>
                <input id="duration" name="duration" type="text" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.duration} disabled={!enableDuration} on:input={syncProjectToStore}>
            </div>
        </div>

        <!-- Sections -->
        <h3 class="text-xl font-semibold border-b pb-2 mb-4 pt-4">C. Case Study Sections</h3>
        <div class="space-y-4">
            {#if (project.caseStudy.sections || []).length === 0}
                <div class="p-6 text-center border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50">
                    <p class="text-indigo-800 font-semibold mb-2">This project has no case study sections yet.</p>
                    <p class="text-sm text-indigo-600">Click the '➕ Add New Section' button below to start building your case study!</p>
                </div>
            {/if}

            {#each (project.caseStudy.sections || []) as section, sectionIndex}
                <div class="section-card" role="region" aria-labelledby={"section-title-"+project.id+"-"+sectionIndex}>
                    <div class="flex justify-between items-center mb-3 border-b pb-2">
                        <h4 id={"section-title-"+project.id+"-"+sectionIndex} class="font-bold text-lg text-indigo-800">Section {sectionIndex + 1}</h4>
                        <button type="button" on:click={() => removeSection(sectionIndex)} class="text-sm font-medium text-red-600 hover:text-red-800">
                            Remove
                        </button>
                    </div>

                    <label for={"section-title-input-"+project.id+"-"+sectionIndex} class="block text-sm font-medium text-gray-700 mt-2">Section Title (e.g., 'The Problem & Goal')</label>
                    <input
                        id={"section-title-input-"+project.id+"-"+sectionIndex}
                        name={"section-title-input-"+project.id+"-"+sectionIndex}
                        type="text"
                        class="section-title-input mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        placeholder="Enter title without numbering"
                        value={getTitleSuffix(section.title)}
                        on:input={(e) => updateSectionTitle(section, sectionIndex, e.target.value)}
                    >

                    <label for={"section-content-"+project.id+"-"+sectionIndex} class="block text-sm font-medium text-gray-700 mt-4">Section Copy</label>
                    <textarea id={"section-content-"+project.id+"-"+sectionIndex} name={"section-content-"+project.id+"-"+sectionIndex} rows="4" class="section-content-input mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={section.content} on:input={syncProjectToStore}></textarea>

                    <h5 class="font-bold text-sm text-gray-700 mt-4 mb-2">Media Items:</h5>
                    <div class="media-items-list space-y-3 p-3 border border-dashed border-gray-300 rounded-lg">
                        {#if (section.mediaItems || []).length > 0}
                            {#each section.mediaItems as item, itemIndex}
                                <MediaItem bind:mediaItem={item} {sectionIndex} {itemIndex} on:remove={() => removeMediaItemAt(sectionIndex, itemIndex)} on:change={syncProjectToStore} />
                            {/each}
                        {:else}
                            <p class="text-sm text-gray-500 italic">No media items in this section.</p>
                        {/if}
                    </div>

                    <button type="button" on:click={() => addMediaItemToSection(sectionIndex)} class="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600">
                        ➕ Add Media Item
                    </button>
                </div>
            {/each}
        </div>

        <button type="button" on:click={addSectionField} class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600">
            ➕ Add New Section
        </button>

    </form>
</div>
{/if}