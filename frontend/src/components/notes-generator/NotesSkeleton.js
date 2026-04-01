export function NotesSkeleton() {
    return `
        <div class="bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl p-6 border border-[#374151] shadow-xl">
            <div class="animate-pulse">
                <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#374151]">
                    <div class="flex items-center gap-3">
                        <div class="w-11 h-11 bg-[#374151] rounded-xl"></div>
                        <div>
                            <div class="h-5 bg-[#374151] rounded w-32 mb-2"></div>
                            <div class="h-3 bg-[#374151] rounded w-24"></div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <div class="w-9 h-9 bg-[#374151] rounded-lg"></div>
                        <div class="w-9 h-9 bg-[#374151] rounded-lg"></div>
                        <div class="w-9 h-9 bg-[#374151] rounded-lg"></div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="h-4 bg-[#374151] rounded w-3/4"></div>
                    <div class="h-4 bg-[#374151] rounded w-full"></div>
                    <div class="h-4 bg-[#374151] rounded w-5/6"></div>
                    <div class="h-32 bg-[#374151] rounded-xl"></div>
                    <div class="h-24 bg-[#374151] rounded-xl"></div>
                </div>
            </div>
        </div>
    `;
}