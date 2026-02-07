
const API_URL = process.env.VUE_APP_API_BASE_URL || 'https://iazenix.com/api';

export const StrategiesService = {
    async getStrategy(strategyId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/strategies/${strategyId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch strategy: ${strategyId}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('[StrategiesService] Error fetching strategy:', error);
            throw error;
        }
    },

    async getAllStrategies() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/strategies`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch strategies list');
            }

            const result = await response.json();
            // result.data is an array of filenames like ['apollo', 'atlas', ...]

            // Fetch content for each strategy
            const strategies = await Promise.all(
                result.data.map(id => this.getStrategy(id))
            );

            return strategies;
        } catch (error) {
            console.error('[StrategiesService] Error fetching all strategies:', error);
            throw error;
        }
    }
};
