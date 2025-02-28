# Smart Contract Vulnerability Scanner

A web-based tool that analyzes Solidity smart contracts for common security vulnerabilities and potential issues.

## Features

- Detects 7 common smart contract vulnerabilities:
  - Reentrancy
  - Unchecked External Calls
  - tx.origin Usage
  - Unprotected Self-Destruct
  - Integer Overflow/Underflow
  - Timestamp Dependence
  - Uninitialized Storage Pointer
- Provides severity levels (Critical, High, Medium, Low)
- Line-specific vulnerability detection
- Detailed descriptions of found vulnerabilities

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install flask
```
3. Run the application:
```bash
python app.py
```
4. Open http://127.0.0.1:5000 in your browser

## Usage

1. Paste your Solidity smart contract code into the text area
2. Click "Analyze"
3. View the analysis results including:
   - Total number of findings
   - Severity statistics
   - Detailed vulnerability descriptions
   - Line numbers and affected code

## Tech Stack

- Python
- Flask
- Regular Expressions
- HTML/CSS/JavaScript

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
