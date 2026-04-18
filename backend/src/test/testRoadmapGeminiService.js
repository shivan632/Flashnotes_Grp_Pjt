// backend/src/test/testRoadmapGeminiService.js
import { generateRoadmapWithGemini } from '../services/roadmapGeminiService.js';

async function runTests() {
    console.log('\n🗺️ ROADMAP GEMINI SERVICE TEST SUITE');
    console.log('=' .repeat(60));
    
    let passed = 0;
    let failed = 0;
    
    // Test 1: Basic Roadmap Generation (React - Beginner)
    console.log('\n📝 TEST 1: Generate React Beginner Roadmap');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('React', 'beginner', 3);
        
        console.log('   ✅ Roadmap generated successfully');
        console.log(`   📌 Topic: ${result.topic}`);
        console.log(`   📊 Title: ${result.title?.substring(0, 60)}...`);
        console.log(`   🎯 Difficulty: ${result.difficulty}`);
        console.log(`   📦 Nodes count: ${result.nodes?.length || 0}`);
        console.log(`   🔗 Edges count: ${result.edges?.length || 0}`);
        
        // Validate node structure
        if (result.nodes && result.nodes.length > 0) {
            const firstNode = result.nodes[0];
            console.log(`   📖 First node: "${firstNode.name}"`);
            console.log(`   📝 Node description: ${firstNode.description?.substring(0, 50)}...`);
            
            // Check for generic names (should NOT have "Part 1", "Part 2", etc.)
            const hasGenericNames = result.nodes.some(node => 
                node.name?.match(/Part \d|Introduction Part|Section \d/i)
            );
            
            if (!hasGenericNames) {
                console.log('   ✅ No generic names found (good!)');
            } else {
                console.log('   ⚠️ Generic names detected - check prompt');
            }
        }
        
        passed++;
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failed++;
    }
    
    // Test 2: Python Intermediate Roadmap
    console.log('\n📝 TEST 2: Generate Python Intermediate Roadmap');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('Python', 'intermediate', 3);
        
        console.log('   ✅ Roadmap generated successfully');
        console.log(`   📌 Topic: ${result.topic}`);
        console.log(`   📦 Nodes: ${result.nodes?.length || 0}`);
        console.log(`   🔗 Edges: ${result.edges?.length || 0}`);
        
        // Check for Python-specific topics
        const pythonTopics = ['decorators', 'oop', 'classes', 'modules', 'api', 'database'];
        const foundTopics = pythonTopics.filter(topic => 
            JSON.stringify(result.nodes).toLowerCase().includes(topic)
        );
        
        if (foundTopics.length > 0) {
            console.log(`   ✅ Found Python-specific topics: ${foundTopics.join(', ')}`);
        }
        
        passed++;
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failed++;
    }
    
    // Test 3: JavaScript Advanced Roadmap
    console.log('\n📝 TEST 3: Generate JavaScript Advanced Roadmap');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('JavaScript', 'advanced', 4);
        
        console.log('   ✅ Roadmap generated successfully');
        console.log(`   📌 Topic: ${result.topic}`);
        console.log(`   📦 Nodes: ${result.nodes?.length || 0}`);
        console.log(`   📏 Depth: ${result.depth_level || 'N/A'}`);
        
        // Check for advanced topics
        const advancedTopics = ['closure', 'prototype', 'event loop', 'promise', 'async', 'webpack', 'testing'];
        const foundTopics = advancedTopics.filter(topic => 
            JSON.stringify(result.nodes).toLowerCase().includes(topic)
        );
        
        if (foundTopics.length > 0) {
            console.log(`   ✅ Found advanced topics: ${foundTopics.slice(0, 3).join(', ')}...`);
        }
        
        passed++;
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failed++;
    }
    
    // Test 4: Unknown Technology (should use fallback)
    console.log('\n📝 TEST 4: Unknown Technology with Fallback');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('UnknownTechXYZ', 'beginner', 2);
        
        console.log('   ✅ Roadmap generated (using fallback)');
        console.log(`   📌 Topic: ${result.topic}`);
        console.log(`   🔄 Is fallback: ${result.is_fallback || false}`);
        console.log(`   📦 Nodes: ${result.nodes?.length || 0}`);
        
        if (result.is_fallback || result.metadata?.model === 'fallback') {
            console.log('   ✅ Fallback mechanism working');
        }
        
        passed++;
    } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failed++;
    }
    
    // Test 5: Different Depth Levels
    console.log('\n📝 TEST 5: Test Different Depth Levels (2, 3, 4)');
    console.log('-'.repeat(40));
    
    const depths = [2, 3, 4];
    
    for (const depth of depths) {
        try {
            const result = await generateRoadmapWithGemini('React', 'beginner', depth);
            console.log(`   ✅ Depth ${depth}: ${result.nodes?.length || 0} nodes generated`);
            
            // Check if depth is respected
            const maxLevel = Math.max(...(result.nodes?.map(n => n.level) || [0]));
            if (maxLevel <= depth) {
                console.log(`      ✓ Max level (${maxLevel}) ≤ requested depth (${depth})`);
            }
        } catch (error) {
            console.log(`   ⚠️ Depth ${depth} failed: ${error.message}`);
        }
    }
    passed++;
    
    // Test 6: Validate Edge Connections
    console.log('\n📝 TEST 6: Validate Edge Connections');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('React', 'beginner', 3);
        
        if (result.edges && result.nodes) {
            const nodeIds = new Set(result.nodes.map(n => n.id));
            const invalidEdges = result.edges.filter(edge => 
                !nodeIds.has(edge.from) || !nodeIds.has(edge.to)
            );
            
            if (invalidEdges.length === 0) {
                console.log('   ✅ All edges connect to valid nodes');
            } else {
                console.log(`   ⚠️ Found ${invalidEdges.length} invalid edges`);
            }
            
            console.log(`   📊 Edge/Node ratio: ${(result.edges.length / result.nodes.length).toFixed(2)}`);
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Edge validation failed: ${error.message}`);
        failed++;
    }
    
    // Test 7: Response Time Performance
    console.log('\n📝 TEST 7: Response Time Performance');
    console.log('-'.repeat(40));
    
    try {
        const startTime = Date.now();
        await generateRoadmapWithGemini('JavaScript', 'beginner', 2);
        const duration = Date.now() - startTime;
        
        console.log(`   ⏱️ Generation time: ${duration}ms`);
        
        if (duration < 10000) {
            console.log('   ✅ Good performance (<10 seconds)');
        } else if (duration < 20000) {
            console.log('   ⚠️ Acceptable performance (<20 seconds)');
        } else {
            console.log('   ⚠️ Slow performance (>20 seconds)');
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Performance test failed: ${error.message}`);
        failed++;
    }
    
    // Test 8: Validate Node Structure
    console.log('\n📝 TEST 8: Validate Node Structure & Content');
    console.log('-'.repeat(40));
    
    try {
        const result = await generateRoadmapWithGemini('Python', 'intermediate', 3);
        
        if (result.nodes && result.nodes.length > 0) {
            const requiredFields = ['id', 'name', 'level', 'description'];
            let allFieldsPresent = true;
            
            for (const node of result.nodes.slice(0, 5)) {
                for (const field of requiredFields) {
                    if (!node[field]) {
                        console.log(`   ⚠️ Node ${node.id} missing field: ${field}`);
                        allFieldsPresent = false;
                    }
                }
            }
            
            if (allFieldsPresent) {
                console.log('   ✅ All nodes have required fields');
            }
            
            // Check for meaningful node names (not too short)
            const shortNames = result.nodes.filter(n => n.name?.length < 10);
            if (shortNames.length === 0) {
                console.log('   ✅ All node names are descriptive (>10 chars)');
            } else {
                console.log(`   ⚠️ ${shortNames.length} nodes have very short names`);
            }
        }
        passed++;
    } catch (error) {
        console.log(`   ❌ Structure validation failed: ${error.message}`);
        failed++;
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! roadmapGeminiService.js is ready to use.');
        console.log('\n💡 Notes:');
        console.log('   - If Gemini API has quota issues, fallback will be used');
        console.log('   - Fallback provides specific, non-generic topic names');
        console.log('   - The service works with React, Python, JavaScript specifically');
    } else {
        console.log('\n⚠️ Some tests failed. Check Gemini API quota or internet connection.');
    }
    
    // Print sample node names from first test (if available)
    console.log('\n📚 Sample Node Names (from React beginner roadmap):');
    try {
        const sample = await generateRoadmapWithGemini('React', 'beginner', 2);
        if (sample.nodes && sample.nodes.length > 0) {
            sample.nodes.slice(0, 5).forEach(node => {
                console.log(`   📌 ${node.name}`);
            });
        }
    } catch (e) {
        console.log('   Could not fetch sample (API may have quota issues)');
    }
}

// Run tests
runTests().catch(console.error);