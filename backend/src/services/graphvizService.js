// backend/src/services/graphvizService.js
import fs from 'fs';
import path from 'path';

export function generateMermaidCode(roadmapData) {
    const { nodes, edges, title } = roadmapData;
    
    let mermaid = `%%{init: {'theme': 'dark', 'themeVariables': { 'darkMode': true, 'background': '#111827', 'primaryColor': '#3B82F6', 'primaryBorderColor': '#60A5FA', 'primaryTextColor': '#F9FAFB', 'lineColor': '#3B82F6', 'secondaryColor': '#1F2937', 'tertiaryColor': '#374151' }}}%%\n`;
    mermaid += `graph TB\n`;
    mermaid += `    %% Styles\n`;
    mermaid += `    classDef root fill:#3B82F6,stroke:#60A5FA,stroke-width:2px,color:#fff,font-weight:bold,rx:10,ry:10\n`;
    mermaid += `    classDef level1 fill:#1F2937,stroke:#3B82F6,stroke-width:2px,color:#E5E7EB,rx:8,ry:8\n`;
    mermaid += `    classDef level2 fill:#111827,stroke:#60A5FA,stroke-width:1px,color:#9CA3AF,rx:6,ry:6\n\n`;
    
    nodes.forEach(node => {
        const nodeId = node.id.replace(/[.-]/g, '_');
        let nodeLabel = node.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 60);
        const icon = getIconForNode(node.name);
        nodeLabel = `${icon} ${nodeLabel}`;
        
        mermaid += `    ${nodeId}["${nodeLabel}"]\n`;
        
        if (node.level === 0) {
            mermaid += `    class ${nodeId} root\n`;
        } else if (node.level === 1) {
            mermaid += `    class ${nodeId} level1\n`;
        } else {
            mermaid += `    class ${nodeId} level2\n`;
        }
    });
    
    mermaid += `\n`;
    
    edges.forEach(edge => {
        const fromId = edge.from.replace(/[.-]/g, '_');
        const toId = edge.to.replace(/[.-]/g, '_');
        mermaid += `    ${fromId} --> ${toId}\n`;
    });
    
    return mermaid;
}

function getIconForNode(name) {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('intro') || nameLower.includes('what is')) return '📖';
    if (nameLower.includes('basic') || nameLower.includes('fundamental')) return '📘';
    if (nameLower.includes('advanced')) return '🚀';
    if (nameLower.includes('practice') || nameLower.includes('project')) return '💻';
    if (nameLower.includes('tool') || nameLower.includes('framework')) return '🛠️';
    if (nameLower.includes('concept')) return '🧠';
    if (nameLower.includes('data')) return '📊';
    if (nameLower.includes('function')) return '⚡';
    if (nameLower.includes('hook')) return '🎣';
    if (nameLower.includes('state')) return '📦';
    if (nameLower.includes('api')) return '🔌';
    if (nameLower.includes('test')) return '✅';
    if (nameLower.includes('deploy')) return '🚢';
    return '📌';
}

export function generateMermaidHTML(roadmapData) {
    const mermaidCode = generateMermaidCode(roadmapData);
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${roadmapData.topic} Roadmap</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            padding: 30px;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: rgba(31, 41, 55, 0.95);
            border-radius: 24px;
            padding: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(59, 130, 246, 0.3);
        }
        h1 {
            background: linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-align: center;
            margin-bottom: 12px;
            font-size: 2.5rem;
            font-weight: 800;
        }
        .subtitle {
            text-align: center;
            color: #9CA3AF;
            margin-bottom: 40px;
            font-size: 1.1rem;
        }
        .mermaid {
            background: #0F172A;
            padding: 30px;
            border-radius: 20px;
            overflow-x: auto;
            text-align: center;
            border: 1px solid #334155;
        }
        .footer {
            text-align: center;
            color: #6B7280;
            font-size: 0.8rem;
            margin-top: 32px;
            padding-top: 20px;
            border-top: 1px solid #334155;
        }
        .badge-container {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 0.8rem;
            background: #1E293B;
            color: #94A3B8;
            border: 1px solid #334155;
        }
        .badge-beginner { background: linear-gradient(135deg, #10B98120, #05966920); color: #34D399; border-color: #10B981; }
        .badge-intermediate { background: linear-gradient(135deg, #F59E0B20, #D9770620); color: #FBBF24; border-color: #F59E0B; }
        .badge-advanced { background: linear-gradient(135deg, #EF444420, #DC262620); color: #F87171; border-color: #EF4444; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗺️ ${roadmapData.title || `${roadmapData.topic} Learning Roadmap`}</h1>
        <div class="subtitle">
            ${roadmapData.description || `A ${roadmapData.difficulty} level roadmap to master ${roadmapData.topic}`}
        </div>
        <div class="badge-container">
            <span class="badge badge-${roadmapData.difficulty}">📊 ${roadmapData.difficulty.toUpperCase()}</span>
            <span class="badge">📏 Depth: Level ${roadmapData.depth_level}</span>
            <span class="badge">📚 ${roadmapData.nodes?.length || 0} Topics</span>
        </div>
        <div class="mermaid">
${mermaidCode}
        </div>
        <div class="footer">
            ✨ Generated by Flashnotes AI Roadmap Generator • Powered by Gemini AI
        </div>
    </div>
    <script>
        mermaid.initialize({ 
            startOnLoad: true, 
            theme: 'dark',
            themeVariables: {
                background: '#0F172A',
                primaryColor: '#3B82F6',
                primaryBorderColor: '#60A5FA',
                primaryTextColor: '#F9FAFB',
                lineColor: '#3B82F6',
                secondaryColor: '#1F2937',
                tertiaryColor: '#334155',
                fontSize: '14px',
                fontFamily: 'Segoe UI, sans-serif'
            }
        });
    </script>
</body>
</html>`;
}

// ADD THIS FUNCTION - Missing export
export async function saveMermaidHTML(roadmapData, outputFileName) {
    try {
        const htmlContent = generateMermaidHTML(roadmapData);
        
        const uploadsDir = path.join(process.cwd(), 'uploads', 'roadmaps');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        
        const outputPath = path.join(uploadsDir, `${outputFileName}.html`);
        fs.writeFileSync(outputPath, htmlContent);
        
        return outputPath;
        
    } catch (error) {
        console.error('Save Mermaid HTML error:', error);
        throw new Error('Failed to save roadmap HTML');
    }
}

export default { generateMermaidCode, generateMermaidHTML, saveMermaidHTML };