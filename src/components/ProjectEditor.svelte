<script>
    import MediaItem from './MediaItem.svelte'; 
    
    export let project;
    export let uniqueCategories;
    

    // NOTE: Removed getContext('ai-tools') dependency

    // --- CONSTANTS ---
    const TAILWIND_COLORS_MAP = [
        // ... (Define TAILWIND_COLORS_MAP here as before) ...
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

    // ... (Category state and functions remain the same) ...
    let enableClient = !!project.caseStudy.client;
    let enableRole = !!project.caseStudy.role;
    let enableDuration = !!project.caseStudy.duration;
    let isCustomCategory = !uniqueCategories.includes(project.category);
    let customCategoryValue = isCustomCategory ? project.category : '';

    $: if (!enableClient) project.caseStudy.client = '';
    $: if (!enableRole) project.caseStudy.role = '';
    $: if (!enableDuration) project.caseStudy.duration = '';

    function handleCategoryChange(e) {
        if (e.target.value === '--- Custom/New Category ---') {
            isCustomCategory = true;
            project.category = customCategoryValue || 'New Category';
        } else {
            isCustomCategory = false;
            project.category = e.target.value;
        }
    }
    $: if (isCustomCategory) {
        project.category = customCategoryValue || 'New Category';
    }

    // ... (Section management functions remain the same) ...
    function addSectionField() {
        const sections = project.caseStudy.sections;
        const newIndex = sections.length;
        const newSection = {
            id: `new-section-${newIndex + 1}`,
            title: `${String(newIndex + 1).padStart(2, '0')}. NEW SECTION`,
            content: 'Add new content here.',
            mediaItems: [] 
        };
        project.caseStudy.sections = [...sections, newSection];
    }

    function removeSection(indexToRemove) {
        if (confirm(`Are you sure you want to remove Section ${indexToRemove + 1}: ${project.caseStudy.sections[indexToRemove].title}?`)) {
            const sections = project.caseStudy.sections.filter((_, i) => i !== indexToRemove);
            
            sections.forEach((s, i) => {
                const newTitlePrefix = String(i + 1).padStart(2, '0') + ". ";
                const oldTitleSuffix = s.title.replace(/^\d{2}\. /, '').trim();
                s.title = newTitlePrefix + oldTitleSuffix;
                s.id = oldTitleSuffix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${i + 1}`;
            });

            project.caseStudy.sections = sections;
        }
    }

    function updateSectionTitle(section, index, inputTitle) {
        const titleSuffix = inputTitle.trim();
        const baseId = titleSuffix.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${index + 1}`;
        section.title = `${String(index + 1).padStart(2, '0')}. ${titleSuffix}`;
        section.id = baseId;
        project.caseStudy.sections = project.caseStudy.sections;
    }

    function getTitleSuffix(title) {
        return title.replace(/^\d{2}\. /, '').trim();
    }

</script>

<div class="mt-10 p-6 border border-gray-200 rounded-lg bg-white shadow-inner">
    <h2 class="text-2xl font-bold mb-4">Edit Project: <span class="text-indigo-600">{project.title}</span></h2>
    
    <form class="space-y-6">
        
        <h3 class="text-xl font-semibold border-b pb-2 mb-4">A. General Project Info</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">ID (Read-Only)</label>
                <input type="text" value={project.id} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 p-2" readonly>
            </div>
            <div>
                <label for="title" class="block text-sm font-medium text-gray-700">Project Title</label>
                <input type="text" id="title" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.title}>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label for="category" class="block text-sm font-medium text-gray-700">Category (Select or Type New)</label>
                <select id="category-select" 
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                        on:change={handleCategoryChange}
                        value={isCustomCategory ? '--- Custom/New Category ---' : project.category}
                >
                    {#each uniqueCategories as category}
                        <option value={category}>{category}</option>
                    {/each}
                    <option value="--- Custom/New Category ---">--- Custom/New Category ---</option>
                </select>
                {#if isCustomCategory}
                    <input type="text" id="category-custom" placeholder="Or enter new category..." class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={customCategoryValue}>
                {/if}
            </div>
            
            <div>
                <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
                <input type="number" id="year" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.year}>
            </div>
            
            <div>
                <label for="accentColor-select" class="block text-sm font-medium text-gray-700 mb-2">Accent Color (Tailwind Class)</label>
                <div class="flex items-center space-x-3">
                    <select id="accentColor-select" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.accentColor}>
                        {#each TAILWIND_COLORS_MAP as color}
                            <option value={color.class}>{color.name} ({color.class})</option>
                        {/each}
                    </select>
                    <div class="h-8 w-8 rounded-md border-2 border-gray-300 flex-shrink-0" class:bg-indigo-600={project.accentColor === 'bg-indigo-600'} class:bg-blue-600={project.accentColor === 'bg-blue-600'} class:bg-green-600={project.accentColor === 'bg-green-600'} class:bg-emerald-700={project.accentColor === 'bg-emerald-700'} class:bg-yellow-600={project.accentColor === 'bg-yellow-600'} class:bg-orange-600={project.accentColor === 'bg-orange-600'} class:bg-red-600={project.accentColor === 'bg-red-600'} class:bg-pink-600={project.accentColor === 'bg-pink-600'} class:bg-purple-600={project.accentColor === 'bg-purple-600'} class:bg-gray-700={project.accentColor === 'bg-gray-700'}></div>
                </div>
            </div>
        </div>

        <div>
            <label for="heroImage" class="block text-sm font-medium text-gray-700">Hero Image URL</label>
            <div class="flex space-x-2 mt-1">
                <input type="url" id="heroImage" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.heroImage}>
                </div>
            <div class="mt-2">
                <div class="preview-container border border-gray-300 rounded-md bg-gray-200 overflow-hidden">
                    {#if project.heroImage}
                        <img src={project.heroImage.trim()} class="w-full h-full object-cover" alt="Hero Preview" on:error={(e) => e.target.src='https://placehold.co/192x120/cc0000/ffffff?text=Load+Error'} />
                    {:else}
                        <div class="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Media URL</div>
                    {/if}
                </div>
            </div>
        </div>
        
        <div class="flex items-center space-x-3 p-3 border border-red-300 bg-red-50 rounded-md">
            <input type="checkbox" id="isHidden" class="rounded text-red-600 focus:ring-red-500" bind:checked={project.isHidden}>
            <label for="isHidden" class="text-base font-medium text-red-700">Hide Project (Draft Mode)</label>
            <p class="text-xs text-red-600">(If checked, this project will NOT appear on the live site.)</p>
        </div>
        
        <h3 class="text-xl font-semibold border-b pb-2 mb-4 pt-4">B. Modal Intro & Details</h3>

        <div>
            <label for="brief" class="block text-sm font-medium text-gray-700">Brief (Modal Intro Summary)</label>
            <div class="flex space-x-2 mt-1">
                <textarea id="brief" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.brief}></textarea>
                </div>
        </div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 border p-4 rounded-md bg-gray-50">
        <div class="flex flex-col">
            <div class="flex items-center space-x-2 mb-1">
                <input type="checkbox" id="enableClient" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableClient}>
                <label for="enableClient" class="text-sm font-medium text-gray-700">Client</label>
            </div>
            <input type="text" id="client" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.client} disabled={!enableClient}>
        </div>
        <div class="flex flex-col">
            <div class="flex items-center space-x-2 mb-1">
                <input type="checkbox" id="enableRole" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableRole}>
                <label for="enableRole" class="text-sm font-medium text-gray-700">Role</label>
            </div>
            <input type="text" id="role" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.role} disabled={!enableRole}>
        </div>
        <div class="flex flex-col">
            <div class="flex items-center space-x-2 mb-1">
                <input type="checkbox" id="enableDuration" class="rounded text-indigo-600 focus:ring-indigo-500" bind:checked={enableDuration}>
                <label for="enableDuration" class="text-sm font-medium text-gray-700">Duration</label>
            </div>
            <input type="text" id="duration" class="block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={project.caseStudy.duration} disabled={!enableDuration}>
        </div>
    </div>
        
        <h3 class="text-xl font-semibold border-b pb-2 mb-4 pt-4">C. Case Study Sections</h3>
        <div class="space-y-4">
            {#if project.caseStudy.sections.length === 0}
                <div class="p-6 text-center border-2 border-dashed border-indigo-300 rounded-lg bg-indigo-50">
                    <p class="text-indigo-800 font-semibold mb-2">This project has no case study sections yet.</p>
                    <p class="text-sm text-indigo-600">Click the '➕ Add New Section' button below to start building your case study!</p>
                </div>
            {/if}
            
            {#each project.caseStudy.sections as section, sectionIndex}
                <div class="section-card">
                    <div class="flex justify-between items-center mb-3 border-b pb-2">
                        <h4 class="font-bold text-lg text-indigo-800">Section {sectionIndex + 1}</h4>
                        <button type="button" on:click={() => removeSection(sectionIndex)} class="text-sm font-medium text-red-600 hover:text-red-800">
                            Remove
                        </button>
                    </div>
                    
                    <label class="block text-sm font-medium text-gray-700 mt-2">Section Title (e.g., 'The Problem & Goal')</label>
                    <input type="text" 
                           class="section-title-input mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" 
                           placeholder="Enter title without numbering"
                           value={getTitleSuffix(section.title)}
                           on:input={(e) => updateSectionTitle(section, sectionIndex, e.target.value)}
                    >
                    
                    <label class="block text-sm font-medium text-gray-700 mt-4">Section Copy</label>
                    <textarea rows="4" class="section-content-input mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" bind:value={section.content}></textarea>
                    
                    <h5 class="font-bold text-sm text-gray-700 mt-4 mb-2">Media Items:</h5>
                    <div class="media-items-list space-y-3 p-3 border border-dashed border-gray-300 rounded-lg">
                        {#each section.mediaItems as item, itemIndex}
                            <MediaItem bind:mediaItem={item} {sectionIndex} {itemIndex} />
                        {:else}
                            <p class="text-sm text-gray-500 italic">No media items in this section.</p>
                        {/each}
                    </div>
                    
                    <button type="button" 
                            on:click={() => section.mediaItems = [...section.mediaItems, { url: '', isVideo: false }]}
                            class="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600">
                        ➕ Add Media Item
                    </button>
                </div>
            {/each}
        </div>
        
        <button type="button" on:click={addSectionField} class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
            ➕ Add New Section
        </button>
        
    </form>
</div>