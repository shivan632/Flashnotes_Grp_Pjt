// backend/src/controllers/roadmapController.js
import { generateRoadmapWithGemini } from '../services/roadmapGeminiService.js';
import { generateMermaidHTML, saveMermaidHTML } from '../services/graphvizService.js';
import { generateMermaidCode } from '../utils/roadmapHelpers.js';
import { supabase } from '../config/supabase.js';
import fs from 'fs';
import path from 'path';

/**
 * Generate a new roadmap (using Mermaid.js - No Graphviz needed)
 */
export const generateRoadmap = async (req, res) => {
    try {
        const { topic, difficulty = 'beginner', depth = 3 } = req.body;
        const userId = req.user.id;
        
        if (!topic || topic.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Topic is required'
            });
        }
        
        console.log(`🚀 Generating roadmap for: ${topic} (${difficulty}, depth: ${depth})`);
        console.log(`👤 User ID: ${userId}`);
        
        // Step 1: Generate roadmap with Gemini AI
        const roadmapData = await generateRoadmapWithGemini(topic, difficulty, depth);
        
        // Step 2: Generate Mermaid code
        const mermaidCode = generateMermaidCode(roadmapData);
        roadmapData.mermaid_code = mermaidCode;
        
        // Step 3: Generate HTML content (No Graphviz needed!)
        const htmlContent = generateMermaidHTML(roadmapData);
        
        // Step 4: Save to Supabase
        const { data: roadmap, error: insertError } = await supabase
            .from('roadmaps')
            .insert({
                user_id: userId,
                topic: roadmapData.topic,
                title: roadmapData.title,
                description: roadmapData.description,
                difficulty: roadmapData.difficulty,
                depth_level: roadmapData.depth_level,
                roadmap_data: roadmapData,
                mermaid_code: mermaidCode,
                roadmap_html: htmlContent,
                generated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (insertError) {
            console.error('Insert error:', insertError);
            throw new Error('Failed to save roadmap to database');
        }
        
        // Step 5: Save HTML to file (optional - for backup)
        const timestamp = Date.now();
        const outputFileName = `${userId}_${topic.replace(/\s/g, '_')}_${timestamp}`;
        const htmlPath = await saveMermaidHTML(roadmapData, outputFileName);
        
        // Step 6: Upload HTML to Supabase Storage (optional)
        let htmlUrl = null;
        if (fs.existsSync(htmlPath)) {
            const htmlBuffer = fs.readFileSync(htmlPath);
            const storagePath = `roadmaps/${userId}/${roadmap.id}/roadmap.html`;
            
            const { error: uploadError } = await supabase.storage
                .from('roadmaps')
                .upload(storagePath, htmlBuffer, {
                    contentType: 'text/html',
                    cacheControl: '3600'
                });
            
            if (!uploadError) {
                const { data: urlData } = supabase.storage
                    .from('roadmaps')
                    .getPublicUrl(storagePath);
                htmlUrl = urlData.publicUrl;
                
                await supabase
                    .from('roadmaps')
                    .update({
                        html_url: htmlUrl,
                        html_path: storagePath
                    })
                    .eq('id', roadmap.id);
            }
        }
        
        // Step 7: Save nodes to roadmap_nodes table
        if (roadmapData.nodes && roadmapData.nodes.length > 0) {
            const nodesToInsert = roadmapData.nodes.map(node => ({
                roadmap_id: roadmap.id,
                node_id: node.id,
                node_name: node.name,
                node_level: node.level || 0,
                parent_node_id: node.parent_id || null,
                description: node.description || null,
                estimated_time: node.estimated_time || null,
                resources: node.resources || []
            }));
            
            await supabase
                .from('roadmap_nodes')
                .insert(nodesToInsert);
        }
        
        // Step 8: Clean up temp file
        if (fs.existsSync(htmlPath)) {
            fs.unlinkSync(htmlPath);
        }
        
        console.log(`✅ Roadmap saved: ID ${roadmap.id}`);
        
        res.json({
            success: true,
            roadmapId: roadmap.id,
            htmlContent: htmlContent,  // Send HTML directly to frontend
            mermaidCode: mermaidCode,
            roadmap: roadmap
        });
        
    } catch (error) {
        console.error('Generate roadmap error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate roadmap'
        });
    }
};

/**
 * Get user's all roadmaps
 */
export const getUserRoadmaps = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 20, offset = 0 } = req.query;
        
        const { data: roadmaps, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
        
        if (error) throw error;
        
        res.json({
            success: true,
            roadmaps: roadmaps || [],
            count: roadmaps?.length || 0
        });
        
    } catch (error) {
        console.error('Get user roadmaps error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmaps'
        });
    }
};

/**
 * Get single roadmap by ID
 */
export const getRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const { data: roadmap, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Roadmap not found'
                });
            }
            throw error;
        }
        
        // Check if user has saved this roadmap
        const { data: saved } = await supabase
            .from('roadmap_saves')
            .select('*')
            .eq('user_id', userId)
            .eq('roadmap_id', id)
            .maybeSingle();
        
        // Get user progress
        const { data: progress } = await supabase
            .from('user_roadmap_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('roadmap_id', id)
            .maybeSingle();
        
        res.json({
            success: true,
            roadmap: {
                ...roadmap,
                is_saved: !!saved,
                user_progress: progress || null
            }
        });
        
    } catch (error) {
        console.error('Get roadmap error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmap'
        });
    }
};

/**
 * Delete roadmap
 */
export const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        // Get roadmap info
        const { data: roadmap } = await supabase
            .from('roadmaps')
            .select('html_path, image_path')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        
        // Delete from storage if exists
        if (roadmap?.html_path) {
            await supabase.storage
                .from('roadmaps')
                .remove([roadmap.html_path]);
        }
        if (roadmap?.image_path) {
            await supabase.storage
                .from('roadmaps')
                .remove([roadmap.image_path]);
        }
        
        // Delete from database (cascade will delete nodes and progress)
        const { error } = await supabase
            .from('roadmaps')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Roadmap deleted successfully'
        });
        
    } catch (error) {
        console.error('Delete roadmap error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete roadmap'
        });
    }
};

/**
 * Save roadmap to user's collection
 */
export const saveRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const { error } = await supabase
            .from('roadmap_saves')
            .insert({
                user_id: userId,
                roadmap_id: id,
                saved_at: new Date().toISOString()
            });
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: 'Roadmap saved successfully'
        });
        
    } catch (error) {
        console.error('Save roadmap error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save roadmap'
        });
    }
};

/**
 * Update user progress
 */
// backend/src/controllers/roadmapController.js

export const updateProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { completed_nodes } = req.body;
        
        console.log(`📊 Updating progress for roadmap ${id}, user ${userId}, completed: ${completed_nodes}`);
        
        // Get total nodes count
        let totalNodes = 0;
        
        // First try from roadmap_nodes table
        const { data: nodes, error: nodesError } = await supabase
            .from('roadmap_nodes')
            .select('id')
            .eq('roadmap_id', id);
        
        if (nodesError || !nodes || nodes.length === 0) {
            // Fallback: count nodes from roadmap_data
            const { data: roadmapData } = await supabase
                .from('roadmaps')
                .select('roadmap_data')
                .eq('id', id)
                .single();
            
            if (roadmapData?.roadmap_data?.nodes) {
                totalNodes = roadmapData.roadmap_data.nodes.length;
            }
        } else {
            totalNodes = nodes.length;
        }
        
        if (totalNodes === 0) {
            console.warn('No nodes found for roadmap:', id);
            return res.json({
                success: true,
                progress: null,
                message: 'No nodes to track'
            });
        }
        
        const percentage = (completed_nodes / totalNodes) * 100;
        
        // Use upsert with onConflict - FIXED
        const { data, error } = await supabase
            .from('user_roadmap_progress')
            .upsert({
                user_id: userId,
                roadmap_id: parseInt(id),
                completed_nodes: completed_nodes,
                total_nodes: totalNodes,
                percentage_complete: Math.round(percentage),
                last_accessed: new Date().toISOString(),
                completed_at: percentage === 100 ? new Date().toISOString() : null
            }, {
                onConflict: 'user_id, roadmap_id',  // ← KEY FIX
                ignoreDuplicates: false
            })
            .select();
        
        if (error) {
            console.error('Progress update error:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        
        console.log(`✅ Progress updated: ${completed_nodes}/${totalNodes} (${Math.round(percentage)}%)`);
        
        res.json({
            success: true,
            progress: data?.[0] || null
        });
        
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update progress'
        });
    }
};