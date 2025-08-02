from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import markdown
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        new_prompt = data.get('prompt', '').strip()
        history = data.get('history', [])
        
        if not new_prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # Reconstruct conversation for Gemini
        conversation_context = ""
        for item in history:
            if item['type'] == 'user':
                conversation_context += f"User: {item['content']}\n"
            elif item['type'] == 'ai':
                conversation_context += f"Assistant: {item['content']}\n"
        
        # Add current prompt
        conversation_context += f"User: {new_prompt}\n"
        
        # System prompt for suggestions and improvements
        system_prompt = """
            You are a helpful AI assistant specialized in evaluating user prompts related to software projects.
            Your task is to carefully analyze the given prompt and determine if it is clear, complete, and well-optimized for initiating a successful software project.
            Identify any areas where the prompt could be improved—such as missing details, ambiguous requirements, or lack of scope definition—and provide actionable suggestions to refine and optimize the prompt for better project clarity, feasibility, and outcome.
            Keep your evaluation objective, clear, and focused on practical improvements.
            Keep your response concise: limit it to 4–5 key suggestions with minimum 2 line explanation each.
            give an example prompt with the changes in the end
            """
        
        # Combine system prompt with conversation
        full_prompt = f"{system_prompt}\n\nConversation History:\n{conversation_context}\n\nProvide a helpful response to the user's latest message:"
        
        # Send to Gemini
        response = model.generate_content(full_prompt)
        ai_response = response.text.strip()
        
        # Update history
        updated_history = history.copy()
        updated_history.append({
            'type': 'user',
            'content': new_prompt,
            'timestamp': data.get('timestamp', '')
        })
        updated_history.append({
            'type': 'ai',
            'content': markdown.markdown(ai_response),
            'timestamp': ''
        })
        
        return jsonify({
            'success': True,
            'history': updated_history,
            'latest_reply': ai_response
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing request: {str(e)}'}), 500

@app.route('/generate-code', methods=['POST'])
def generate_code():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '').strip()
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        # System prompt for code generation
        system_prompt = """You are a code generator that creates complete, functional websites. 
        Return ONLY the HTML code with embedded CSS and JavaScript. Do not include any explanations, 
        comments, or markdown formatting. The code should be complete and ready to run in a browser.
        
        Requirements:
        - Include all necessary HTML structure
        - Embed CSS in <style> tags in the <head>
        - Embed JavaScript in <script> tags before closing </body>
        - Ensure all functionality works without external dependencies when possible
        
        Return only the raw HTML code, nothing else."""
        
        full_prompt = f"{system_prompt}\n\nUser Request: {prompt}"
        
        # Send to Gemini
        response = model.generate_content(full_prompt)
        generated_code = response.text.strip()
        
        # Clean up any markdown formatting that might slip through
        if generated_code.startswith('```'):
            generated_code = generated_code[7:]
        if generated_code.startswith('```'):
            generated_code = generated_code[3:]
        if generated_code.endswith('```'):
            generated_code = generated_code[:-3]
        
        return jsonify({
            'success': True,
            'code': generated_code.strip()
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating code: {str(e)}'}), 500

@app.route('/optimize-prompt', methods=['POST'])
def optimize_prompt():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '').strip()

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        system_prompt = """You are an AI assistant that refines and optimizes user prompts.
        Your task is to take a user's prompt and rewrite it to be clearer, more concise, and better structured for a large language model.
        Provide only the optimized prompt, without any additional explanations or text.
        """

        full_prompt = f"{system_prompt}\n\nUser Prompt: {prompt}"

        response = model.generate_content(full_prompt)
        optimized_prompt = response.text.strip()

        return jsonify({
            'success': True,
            'optimized_prompt': optimized_prompt
        })

    except Exception as e:
        return jsonify({'error': f'Error optimizing prompt: {str(e)}'}), 500

@app.route('/clear-history', methods=['POST'])
def clear_history():
    return jsonify({'success': True, 'message': 'History cleared'})

if __name__ == '__main__':
    app.run(debug=True)


