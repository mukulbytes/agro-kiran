import OpenAI from 'openai';
import Chat from '../models/Chat.js';
import Product from '../models/productModel.js';
import { catchAsync } from '../utils/catchAsync.js';

const openai = new OpenAI({
    baseURL: "https://models.inference.ai.azure.com",
    apiKey: process.env.OPENAI_API_KEY
});

// Cache for storing product knowledge base
let productKnowledgeBase = null;

// Function to load product knowledge base
const loadProductKnowledgeBase = async () => {
    if (productKnowledgeBase) return productKnowledgeBase;

    const products = await Product.find({ status: 'active' })
        .select('title shortDesc slug category.main');

    // Create product summaries for the system message
    const productSummaries = products.map(product =>
        `- ${product.title} (slug: ${product.slug}): ${product.longDesc}`
    ).join('\n');

    // Store products in a map for quick access
    productKnowledgeBase = {
        summaries: productSummaries,
        products: products.reduce((acc, product) => {
            acc[product.slug] = product;
            return acc;
        }, {})
    };

    return productKnowledgeBase;
};

// System message to set the AI's context and behavior
const getSystemMessage = async () => {
    const { summaries } = await loadProductKnowledgeBase();

    return {
        role: "system",
        content: `You are an AI assistant for Agro Kiran, an agricultural e-commerce platform specializing in fertilizers.
Your role is to:
1. Help farmers choose the right fertilizers based on their crops, soil conditions, and farming goals
2. Provide tips on sustainable farming practices
3. Recommend Agro Kiran products accurately based on the internal product knowledge
4. Explain how Agro Kiran's ordering and delivery process works

Available Products:
${summaries}

Important rules:
- ONLY recommend products from the above list.
- ALWAYS include the product slug when recommending a product using format: 'slug: product-slug'.
- ONLY answer questions related to Agro Kiran and agriculture.
- NEVER answer questions unrelated to farming or Agro Kiran products.
- When recommending products, explain why they are suitable for the user's needs.
- Keep answers brief, actionable, and farmer-friendly.`
    };
};

// Reload product knowledge base periodically (every 1 hour)
setInterval(async () => {
    try {
        productKnowledgeBase = null;
        await loadProductKnowledgeBase();
        console.log('Product knowledge base refreshed');
    } catch (error) {
        console.error('Error refreshing product knowledge base:', error);
    }
}, 60 * 60 * 1000);

// Send message and get AI response
export const sendMessage = catchAsync(async (req, res) => {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Get or create chat history
    let chat = await Chat.findOne({ userId });
    if (!chat) {
        chat = new Chat({ userId, messages: [] });
    }

    // Add user message to history
    chat.messages.push({
        content: message,
        role: 'user'
    });

    // Prepare conversation history for OpenAI
    const conversationHistory = [
        await getSystemMessage(),
        ...chat.messages.slice(-10).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }))
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: conversationHistory,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.6
    });

    const aiResponse = completion.choices[0].message.content;

    // Add AI response to history
    chat.messages.push({
        content: aiResponse,
        role: 'assistant'
    });

    // Save updated chat history
    await chat.save();

    // Get product slug if any product was recommended
    const slugMatch = aiResponse.match(/slug: ([a-z0-9-]+)/);
    const productSlug = slugMatch ? slugMatch[1] : null;

    res.json({
        message: aiResponse,
        chatId: chat._id,
        productSlug
    });
});

// Get chat history
export const getChatHistory = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const chat = await Chat.findOne({ userId }).sort({ 'messages.timestamp': -1 });

    if (!chat) {
        return res.json({ messages: [] });
    }

    res.json({
        messages: chat.messages
    });
}); 