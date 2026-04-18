// backend/src/test/testVoiceNotesAPI.js
import dotenv from 'dotenv';
import { supabaseAdmin } from '../config/supabase.js';

dotenv.config();

// Test user ID (replace with an actual user ID from your database)
const TEST_USER_ID = 'ea8cdf59-a699-4fec-960e-517d5edcea5e'; 

async function runTests() {
    console.log('\n🎤 VOICE NOTES API TEST SUITE');
    console.log('=' .repeat(60));
    
    let passed = 0;
    let failed = 0;
    let testNoteId = null;
    
    // Check if Supabase is connected
    console.log('\n📡 Checking Supabase connection...');
    try {
        const { data, error } = await supabaseAdmin
            .from('voice_notes')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        console.log('   ✅ Supabase connected successfully');
    } catch (error) {
        console.log('   ❌ Supabase connection failed:', error.message);
        console.log('   ⚠️ Make sure your .env file has correct Supabase credentials');
        return;
    }
    
    // Test 1: Save Voice Note
    console.log('\n📝 TEST 1: Save Voice Note (POST /api/voice-notes/save)');
    console.log('-'.repeat(40));
    
    try {
        const testText = "This is a test voice note about JavaScript promises. They are used for asynchronous operations.";
        
        const response = await fetch('http://localhost:10000/api/voice-notes/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getTestToken()}`
            },
            body: JSON.stringify({
                text: testText,
                source: 'voice'
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.note) {
            testNoteId = data.note.id;
            console.log('   ✅ Voice note saved successfully');
            console.log(`   📌 Note ID: ${testNoteId}`);
            console.log(`   📝 Text preview: ${data.note.text.substring(0, 50)}...`);
            console.log(`   📊 Word count: ${data.note.word_count}`);
            console.log(`   📊 Char count: ${data.note.char_count}`);
            passed++;
        } else {
            console.log('   ❌ Failed to save:', data.message);
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        failed++;
    }
    
    // Test 2: Get All Voice Notes
    console.log('\n📝 TEST 2: Get All Voice Notes (GET /api/voice-notes)');
    console.log('-'.repeat(40));
    
    try {
        const response = await fetch('http://localhost:10000/api/voice-notes?limit=10&offset=0', {
            headers: {
                'Authorization': `Bearer ${getTestToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.notes)) {
            console.log(`   ✅ Retrieved ${data.notes.length} voice notes`);
            console.log(`   📊 Total count: ${data.count}`);
            
            if (data.notes.length > 0) {
                console.log('   📋 First note preview:');
                console.log(`      ID: ${data.notes[0].id}`);
                console.log(`      Text: ${data.notes[0].text.substring(0, 40)}...`);
                console.log(`      Created: ${data.notes[0].created_at}`);
            }
            passed++;
        } else {
            console.log('   ❌ Failed to get notes:', data.message);
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        failed++;
    }
    
    // Test 3: Get Single Voice Note
    console.log('\n📝 TEST 3: Get Single Voice Note (GET /api/voice-notes/:id)');
    console.log('-'.repeat(40));
    
    if (testNoteId) {
        try {
            const response = await fetch(`http://localhost:10000/api/voice-notes/${testNoteId}`, {
                headers: {
                    'Authorization': `Bearer ${getTestToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success && data.note) {
                console.log('   ✅ Retrieved single note successfully');
                console.log(`   📌 Note ID: ${data.note.id}`);
                console.log(`   📝 Content: ${data.note.text.substring(0, 60)}...`);
                console.log(`   ⭐ Favorite: ${data.note.is_favorite}`);
                passed++;
            } else {
                console.log('   ❌ Failed to get note:', data.message);
                failed++;
            }
        } catch (error) {
            console.log('   ❌ Error:', error.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ Skipping - no test note ID available');
    }
    
    // Test 4: Update Voice Note
    console.log('\n📝 TEST 4: Update Voice Note (PUT /api/voice-notes/:id)');
    console.log('-'.repeat(40));
    
    if (testNoteId) {
        try {
            const updatedText = "UPDATED: This voice note has been modified. JavaScript promises have three states: pending, resolved, and rejected.";
            
            const response = await fetch(`http://localhost:10000/api/voice-notes/${testNoteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getTestToken()}`
                },
                body: JSON.stringify({
                    text: updatedText
                })
            });
            
            const data = await response.json();
            
            if (data.success && data.note) {
                console.log('   ✅ Voice note updated successfully');
                console.log(`   📝 Updated text: ${data.note.text.substring(0, 60)}...`);
                console.log(`   📊 New word count: ${data.note.word_count}`);
                passed++;
            } else {
                console.log('   ❌ Failed to update:', data.message);
                failed++;
            }
        } catch (error) {
            console.log('   ❌ Error:', error.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ Skipping - no test note ID available');
    }
    
    // Test 5: Toggle Favorite
    console.log('\n📝 TEST 5: Toggle Favorite (PATCH /api/voice-notes/:id/favorite)');
    console.log('-'.repeat(40));
    
    if (testNoteId) {
        try {
            const response = await fetch(`http://localhost:10000/api/voice-notes/${testNoteId}/favorite`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getTestToken()}`
                },
                body: JSON.stringify({ is_favorite: true })
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('   ✅ Added to favorites successfully');
                console.log(`   ⭐ Favorite status: ${data.is_favorite}`);
                passed++;
            } else {
                console.log('   ❌ Failed to toggle favorite:', data.message);
                failed++;
            }
        } catch (error) {
            console.log('   ❌ Error:', error.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ Skipping - no test note ID available');
    }
    
    // Test 6: Get Voice Notes Stats
    console.log('\n📝 TEST 6: Get Voice Notes Stats (GET /api/voice-notes/stats)');
    console.log('-'.repeat(40));
    
    try {
        const response = await fetch('http://localhost:10000/api/voice-notes/stats', {
            headers: {
                'Authorization': `Bearer ${getTestToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.stats) {
            console.log('   ✅ Statistics retrieved successfully');
            console.log(`   📊 Total notes: ${data.stats.total_notes}`);
            console.log(`   ⭐ Favorite notes: ${data.stats.favorite_notes}`);
            console.log(`   📝 Total words: ${data.stats.total_words}`);
            console.log(`   📝 Total characters: ${data.stats.total_chars}`);
            console.log(`   📊 Avg words/note: ${data.stats.avg_words_per_note}`);
            passed++;
        } else {
            console.log('   ❌ Failed to get stats:', data.message);
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        failed++;
    }
    
    // Test 7: Filter by Favorite
    console.log('\n📝 TEST 7: Filter Notes by Favorite (GET /api/voice-notes?favorite=true)');
    console.log('-'.repeat(40));
    
    try {
        const response = await fetch('http://localhost:10000/api/voice-notes?favorite=true&limit=10', {
            headers: {
                'Authorization': `Bearer ${getTestToken()}`
            }
        });
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.notes)) {
            console.log(`   ✅ Retrieved ${data.notes.length} favorite notes`);
            const favoriteCount = data.notes.filter(n => n.is_favorite).length;
            console.log(`   ⭐ All returned notes are favorites: ${favoriteCount === data.notes.length}`);
            passed++;
        } else {
            console.log('   ❌ Failed to filter favorites:', data.message);
            failed++;
        }
    } catch (error) {
        console.log('   ❌ Error:', error.message);
        failed++;
    }
    
    // Test 8: Delete Voice Note
    console.log('\n📝 TEST 8: Delete Voice Note (DELETE /api/voice-notes/:id)');
    console.log('-'.repeat(40));
    
    if (testNoteId) {
        try {
            const response = await fetch(`http://localhost:10000/api/voice-notes/${testNoteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getTestToken()}`
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                console.log('   ✅ Voice note deleted successfully');
                passed++;
            } else {
                console.log('   ❌ Failed to delete:', data.message);
                failed++;
            }
        } catch (error) {
            console.log('   ❌ Error:', error.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ Skipping - no test note ID available');
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 All tests passed! Voice Notes API is ready to use.');
        console.log('\n💡 Next steps:');
        console.log('   1. Update TEST_USER_ID with a real user ID');
        console.log('   2. Make sure backend server is running on port 10000');
        console.log('   3. Integrate with frontend components');
    } else {
        console.log('\n⚠️ Some tests failed. Check:');
        console.log('   1. Backend server is running (npm run dev)');
        console.log('   2. Database table "voice_notes" exists');
        console.log('   3. Valid authentication token is being used');
        console.log('   4. TEST_USER_ID is set to a real user ID');
    }
}

// Helper function to get a test token
// Note: You need to login first to get a valid token
function getTestToken() {
    // Option 1: Use a real token from login
    // return 'your-actual-jwt-token-here';
    
    // Option 2: For testing without auth (temporarily disable auth middleware)
    // Return a dummy token - but auth middleware will reject it
    console.log('   ⚠️ Make sure to update getTestToken() with a real JWT token');
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNncnByZ2Nzdnl5aHFsdXd0c3p6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzgxNTEwMywiZXhwIjoyMDg5MzkxMTAzfQ.AYScFSvTc1TV1tjJXUkP9Q6vozFztzcgT6_l8LXnUr4';
}

// Instructions before running
console.log('\n🔧 SETUP INSTRUCTIONS:');
console.log('=' .repeat(60));
console.log('1. Make sure backend server is running:');
console.log('   npm run dev  or  node server.js');
console.log('');
console.log('2. Update TEST_USER_ID with a real user ID from your database');
console.log('   Look in supabase auth.users table');
console.log('');
console.log('3. Update getTestToken() with a valid JWT token');
console.log('   Login first via API or frontend to get a token');
console.log('');
console.log('4. Make sure "voice_notes" table exists in Supabase');
console.log('   Run the SQL migration provided earlier');
console.log('');

// Run tests
runTests().catch(console.error);