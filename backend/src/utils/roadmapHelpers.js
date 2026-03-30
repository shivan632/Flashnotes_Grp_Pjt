// backend/src/utils/roadmapHelpers.js

/**
 * Generate Mermaid code for roadmap visualization
 */
export function generateMermaidCode(roadmapData) {
    const { nodes, edges, title } = roadmapData;
    
    let mermaid = `graph TD\n`;
    mermaid += `    %% ${title || roadmapData.topic}\n`;
    mermaid += `    classDef root fill:#3B82F6,stroke:#fff,stroke-width:2px,color:#fff\n`;
    mermaid += `    classDef level1 fill:#1F2937,stroke:#3B82F6,stroke-width:1px,color:#fff\n`;
    mermaid += `    classDef level2 fill:#111827,stroke:#60A5FA,stroke-width:1px,color:#fff\n\n`;
    
    // Add nodes
    nodes.forEach(node => {
        const nodeId = node.id.replace(/[.-]/g, '_');
        const nodeLabel = node.name.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 40);
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
    
    // Add edges
    edges.forEach(edge => {
        const fromId = edge.from.replace(/[.-]/g, '_');
        const toId = edge.to.replace(/[.-]/g, '_');
        mermaid += `    ${fromId} --> ${toId}\n`;
    });
    
    return mermaid;
}

/**
 * Validate roadmap data structure
 */
export function validateRoadmapData(data) {
    if (!data.nodes || !Array.isArray(data.nodes)) {
        throw new Error('Invalid roadmap: nodes array missing');
    }
    if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Invalid roadmap: edges array missing');
    }
    if (data.nodes.length === 0) {
        throw new Error('Invalid roadmap: no nodes');
    }
    return true;
}

export default { generateMermaidCode, validateRoadmapData };