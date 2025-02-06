import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure the API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable in the .env file.")

genai.configure(api_key=api_key)

# Initialize the model
model = genai.GenerativeModel('gemini-pro')
chat = model.start_chat(history=[])

# Function to get the Gemini response
def get_gemini_response(question):
    response = chat.send_message(question, stream=True)
    
    # Resolve the response to ensure it's fully processed
    response.resolve()  # This will block until the response is complete
    return response

# Function to process input and summarize the content
def process_and_summarize(txt_file):
    """Reads content from output.txt, generates a summary, and prints it."""
    try:
        with open(txt_file, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Error reading the TXT file: {e}")
        return

    # Generate the prompt for summarization
    prompt = f"Summarize this to 2 lines: '{content}'"

    # Get the response from the Gemini API
    try:
        response = get_gemini_response(prompt)
        if response:
            print("Summary: ")
            for chunk in response.parts:
                print(chunk.text)
            print("_" * 80)
        else:
            print("Unable to generate a valid summary.")
    except Exception as e:
        print(f"Error processing the content: {e}")

def main():
    # Path to the output.txt file
    txt_file = r'output.txt'  # Make sure the path is correct
    process_and_summarize(txt_file)

if __name__ == "__main__":
    main()