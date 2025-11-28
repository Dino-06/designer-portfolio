<script>
    import { projects } from '../store.js';

    export let mediaItem;
    export let sectionIndex;
    export let itemIndex;

    // NOTE: Removed getContext dependency

    // Function to remove this media item
    function removeMediaItem() {
        if (confirm("Are you sure you want to remove this Media Item?")) {
            projects.update(currentProjects => {
                // Find the project object that contains this media item
                const project = currentProjects.find(p => p.caseStudy.sections[sectionIndex]?.mediaItems[itemIndex] === mediaItem);
                
                if (project && project.caseStudy.sections[sectionIndex]) {
                    project.caseStudy.sections[sectionIndex].mediaItems.splice(itemIndex, 1);
                }
                return currentProjects;
            });
        }
    }

    // Function to check if the URL is likely a video based on extension
    function isVideoUrl(url) {
        return /\.(mp4|webm|ogg|mov|avi)$/i.test(url) || url.includes('youtube.com') || url.includes('vimeo.com') || url.includes('youtu.be');
    }

    // Reactive statement to automatically set isVideo if the URL looks like a video
    $: {
        if (mediaItem.url && isVideoUrl(mediaItem.url) && !mediaItem.isVideo) {
            mediaItem.isVideo = true;
        }
    }
</script>

<div class="media-item-container p-3 border border-gray-200 rounded-md bg-white shadow-sm">
    <div class="flex justify-between items-start mb-2">
        <h5 class="text-sm font-bold text-gray-800">Media Item {itemIndex + 1}</h5>
        <button type="button" on:click={removeMediaItem} class="text-red-500 hover:text-red-700 text-xs">
            Remove Item
        </button>
    </div>

    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label class="block text-xs font-medium text-gray-700 mt-2">Media URL (Image or Video)</label>
    <div class="flex space-x-2 mt-1">
        <input type="url" 
               class="media-item-url-input block w-full rounded-md border-gray-300 shadow-sm p-2 border text-sm" 
               placeholder="Paste URL here" 
               bind:value={mediaItem.url}>
        </div>
    
    <div class="flex items-center space-x-2 mt-2">
        <input type="checkbox" 
               class="media-item-isvideo-checkbox rounded text-indigo-600 focus:ring-indigo-500" 
               bind:checked={mediaItem.isVideo}>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="text-xs text-gray-700">Treat as Video (e.g., YouTube/MP4)</label>
    </div>

    <div class="mt-2">
        <div class="preview-container border border-gray-300 rounded-md bg-gray-200 overflow-hidden">
            {#if mediaItem.url}
                {#if mediaItem.isVideo}
                    <div class="w-full h-full flex items-center justify-center text-gray-500 text-xs bg-gray-300">
                        Video URL entered (Preview not supported)
                    </div>
                {:else}
                    <img src={mediaItem.url.trim()} class="w-full h-full object-cover" alt="Media Preview" on:error={(e) => e.target.src='https://placehold.co/192x120/cc0000/ffffff?text=Load+Error'} />
                {/if}
            {:else}
                <div class="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Media URL</div>
            {/if}
        </div>
    </div>
</div>