const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');
const { promisify } = require('util');
const fetch = require('node-fetch');

const MODEL_NAME = 'Xenova/distilbart-cnn-6-6-fp16';
const MODEL_FILES = [
    'onnx/decoder_model.onnx',
    'onnx/decoder_with_past_model.onnx',
    'onnx/encoder_model.onnx',
    'onnx/model.onnx',
    'onnx/quantized/decoder_model_quantized.onnx',
    'onnx/quantized/decoder_with_past_model_quantized.onnx',
    'onnx/quantized/encoder_model_quantized.onnx',
    'onnx/quantized/model_quantized.onnx',
    'config.json',
    'tokenizer.json',
    'tokenizer_config.json',
    'vocab.json',
    'special_tokens_map.json',
    'generation_config.json'
];

const OUTPUT_DIR = path.join(__dirname, '../public/models/Xenova/distilbart-cnn-6-6-fp16');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadFile(url, outputPath) {
    console.log(`Downloading ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Skipping ${url}: ${response.statusText}`);
            return false;
        }
        
        // Ensure directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const fileStream = fs.createWriteStream(outputPath);
        await pipeline(response.body, fileStream);
        console.log(`Downloaded ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.warn(`Error downloading ${url}:`, error.message);
        return false;
    }
}

async function main() {
    try {
        let successCount = 0;
        for (const file of MODEL_FILES) {
            const url = `https://huggingface.co/${MODEL_NAME}/resolve/main/${file}`;
            const outputPath = path.join(OUTPUT_DIR, file);
            
            // Skip if file already exists
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${file} (already exists)`);
                successCount++;
                continue;
            }
            
            const success = await downloadFile(url, outputPath);
            if (success) successCount++;
        }
        
        if (successCount === 0) {
            throw new Error('Failed to download any model files');
        }
        
        console.log('\nAll files downloaded successfully!');
        console.log(`Model files saved to: ${OUTPUT_DIR}`);
    } catch (error) {
        console.error('Error downloading model files:', error);
        process.exit(1);
    }
}

main();
