import { pipeline, env, SummarizationPipeline as XenovaSummarizationPipeline } from '@xenova/transformers';
import type { PretrainedOptions } from '@xenova/transformers';

/**
 * A singleton class to manage the text summarization pipeline from transformers.js.
 * This ensures the model is loaded only once.
 */
class SummarizationPipeline {
    static task = 'summarization' as const;
    // The best model for on-device chat summarization: smaller and faster.
    static model = 'Xenova/distilbart-cnn-6-6';
    static instance: XenovaSummarizationPipeline | null = null;

    /**
     * Get the singleton instance of the summarization pipeline.
     * If it doesn't exist, it will be created.
     * @param {Function} [progress_callback] - Optional callback to track model loading progress.
     * @returns {Promise<XenovaSummarizationPipeline>}
     */
    static async getInstance(progress_callback?: (progress: any) => void) {
        if (this.instance === null) {
            try {
                // Configure environment to fetch models from the Hugging Face Hub CDN.
                // This prevents the library from trying to load from a local path that doesn't exist.
                env.allowLocalModels = false;
                env.allowRemoteModels = true;

                console.log(`Loading summarization model: ${this.model}`);
                
                // Load the pipeline with the specified model and options
                this.instance = await pipeline(this.task, this.model, {
                    quantized: true, // Use quantized model for better performance
                    progress_callback,
                }) as XenovaSummarizationPipeline;
                
                console.log('Summarization model loaded successfully.');

            } catch (error) {
                console.error('Failed to load summarization model:', error);
                // Re-throw the error to be caught by the caller
                throw error;
            }
        }
        return this.instance;
    }
}

interface SummarizationResult {
    summary_text: string;
}

// Define the expected structure for a single message object
interface ChatMessage {
    Author: string;
    Body: string;
}

/**
 * Summarizes a given conversation using an on-device AI model.
 * @param {ChatMessage[]} messages - An array of message objects to be formatted and summarized.
 * @param {Function} [progress_callback] - Optional callback to track model loading progress.
 * @param {string} [conversationId] - Optional conversation ID to track which conversation is being summarized.
 * @returns {Promise<string | null>} The summarized text, or null if an error occurs.
 */
export async function summarize(
    messages: ChatMessage[], 
    progress_callback?: (progress: any) => void,
    conversationId?: string
): Promise<string | null> {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        console.warn('Summarization skipped: Input must be a non-empty array of messages.');
        return null;
    }

    try {
        // --- PROMPT ENGINEERING: Format the chat data into a structured transcript ---
        // This gives the model crucial context about who is speaking.
        const transcript = messages
            .map(msg => `${msg.Author}: ${msg.Body}`)
            .join('\n');

        // --- INSTRUCTIONAL PROMPT: Tell the model exactly what to do ---
        // This focuses the model on the desired task.
        const textToSummarize = `The following is a chat conversation. Please provide a summary of the topics discussed, the members involved in the discussion, and anything else noteworthy.\n\nCONVERSATION:\n${transcript}`;

        console.log(`Starting summarization for conversation ${conversationId || 'unknown'}, text length:`, textToSummarize.length);
        
        // Only proceed if we have a conversation ID (explicitly selected conversation)
        if (!conversationId) {
            console.log('Skipping summarization: No conversation ID provided');
            return null;
        }
        
        // Get the model instance
        const generator = await SummarizationPipeline.getInstance(progress_callback);
        if (!generator) {
            throw new Error('Failed to initialize summarization model.');
        }
        
        console.log(`Model ready, generating summary for conversation ${conversationId}...`);
        
        // Generate the summary with recommended parameters
        const output = await generator(textToSummarize, {
            max_length: 500, // Set a reasonable max length for a summary
            min_length: 30,  // Ensure the summary is not too short
            do_sample: false,
        }) as SummarizationResult[];
        
        if (!output || output.length === 0 || !output[0].summary_text) {
            throw new Error('Generated summary is empty or invalid.');
        }
        
        console.log('Summary generated successfully');
        return output[0].summary_text;
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Summarization error:', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : 'No stack trace',
            messagesCount: messages?.length,
        });
        return null;
    }
}
