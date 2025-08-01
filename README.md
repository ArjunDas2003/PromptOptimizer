# Prompt Optimizer

Prompt Optimizer is a powerful web application designed to enhance your interaction with large language models. It offers a dual-feature interface: a specialized AI assistant that evaluates and refines your software project prompts for clarity and completeness, and a robust code generator that transforms your ideas into functional, single-file websites.

## Key Features

* **Prompt Analysis & Suggestions**: Get expert-level feedback on your ai prompts. The AI assistant, specialized in software project requirements, will analyze your input and provide actionable suggestions to improve clarity, define scope, and ensure feasibility.
* **Interactive Chat History**: Your conversation with the AI assistant is saved, allowing you to see the evolution of your prompt and the AI's suggestions over time.
* **Instant Code Generation**: Describe the website you want, and the code generator will produce a complete, ready-to-run HTML file with embedded CSS and JavaScript.
* **Live Preview**: Instantly see a live preview of the generated code in an embedded iframe, allowing for quick iteration and testing.
* **Modern, Responsive UI**: A clean and intuitive user interface built with a custom blue-themed color palette that works beautifully on all devices.

## Tech Stack

* **Backend**: Flask (Python)
* **AI Engine**: Google Gemini API (`gemini-1.5-flash`)
* **Frontend**: HTML, CSS, JavaScript
* **Dependencies**: A full list of Python dependencies is available in the `requirements.txt` file.

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

* Python 3.7+
* An active Google API Key with the Gemini API enabled.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/prompt-optimizer.git](https://github.com/your-username/prompt-optimizer.git)
    cd prompt-optimizer
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
     ```
    ```sh
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the required dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Set up your environment variables:**
    * Create a file named `.env` in the root directory of the project.
    * Add your Google API key to the `.env` file:
        ```
        GEMINI_API_KEY=AIzaSy...your...key...here
        ```

5.  **Run the Flask application:**
    ```sh
    flask run
    ```
    The application will now be running at `http://127.0.0.1:5000`.

## Usage

* **Option 1: Prompt + Suggestions**
    1.  Navigate to the website.
    2.  In the "Prompt optimiser" section, type a prompt for a software project.
    3.  Click "Send". The AI assistant will reply with an evaluation and suggestions. Your conversation history will be displayed below with the reply.

* **Option 2: Code Generator**
    1.  Navigate to the "Prompt Code Generator" section.
    2.  Enter a descriptive prompt for the website or component you want to create (e.g., "a simple portfolio page with a header, about me section, and contact form").
    3.  Click "Generate Code". The HTML code will appear in the code box, and a live preview will be rendered below.

