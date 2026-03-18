export function WelcomeHero() {
    return `
        <section class="min-h-screen animated-bg flex items-center justify-center">
            <div class="container mx-auto px-4 text-center">
                <div class="mb-8">
                    <img src="/assets/icons/3d-icons/brain-3d.svg" alt="Flashnotes 3D Brain" class="w-32 h-32 mx-auto animate-bounce">
                </div>
                <h1 class="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome to Flashnotes
                </h1>
                <p class="text-2xl text-secondary mb-12">Your AI-Powered Learning Companion</p>
                <div class="flex gap-4 justify-center">
                    <a href="/register" class="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                        Get Started
                    </a>
                    <a href="#features" class="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-lg transition-all">
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    `;
}