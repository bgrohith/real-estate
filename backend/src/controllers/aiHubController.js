import { searchWithFirecrawlAndAI } from '../services/aiHubService.js';

// @desc    Perform AI-powered natural language property search with Firecrawl
// @route   POST /api/ai-hub/search
// @access  Public
export const searchAIProperties = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search prompt describing your desired property.',
      });
    }

    // Support BYOK (Bring Your Own Key) via headers
    const firecrawlApiKey = req.headers['x-firecrawl-key'] || process.env.FIRECRAWL_API_KEY;
    const aiApiKey = req.headers['x-ai-key'] || process.env.AI_MODEL_API_KEY;

    const results = await searchWithFirecrawlAndAI({
      query: query.trim(),
      firecrawlApiKey,
      aiApiKey,
    });

    res.status(200).json({
      success: true,
      query: query.trim(),
      count: results.length,
      data: results,
      byokActive: Boolean(firecrawlApiKey),
    });
  } catch (error) {
    next(error);
  }
};
