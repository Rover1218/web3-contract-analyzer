from flask import Flask, request, render_template, jsonify, send_from_directory
from werkzeug.exceptions import HTTPException
import re
import os

app = Flask(__name__, 
    static_url_path='',
    static_folder='static',
    template_folder='templates')

VULNERABILITIES = {
    "Reentrancy": {
        "pattern": r"call\(.*\).value\(.*\)|send\(.*\)|transfer\(.*\)",
        "severity": "High",
        "description": "Functions that could potentially call back into the contract should implement reentrancy guards."
    },
    "Unchecked External Call": {
        "pattern": r"call\{.*\}|call\(.*\)",
        "severity": "Medium",
        "description": "External calls should check return values or use require statements."
    },
    "tx.origin Usage": {
        "pattern": r"tx\.origin",
        "severity": "High",
        "description": "Using tx.origin for authentication is vulnerable to phishing attacks."
    },
    "Unprotected Self-Destruct": {
        "pattern": r"selfdestruct\(|suicide\(",
        "severity": "Critical",
        "description": "Self-destruct functionality should be properly protected."
    },
    "Integer Overflow/Underflow": {
        "pattern": r"\+\+|\-\-|[\+\-\*\/]=",
        "severity": "Medium",
        "description": "Arithmetic operations should use SafeMath or Solidity 0.8+ built-in checks."
    },
    "Timestamp Dependence": {
        "pattern": r"block\.timestamp|now",
        "severity": "Low",
        "description": "Timestamps can be manipulated by miners within certain bounds."
    },
    "Uninitialized Storage Pointer": {
        "pattern": r"mapping\(.*\) (?!private)",
        "severity": "High",
        "description": "Storage variables should be properly initialized."
    }
}

def scan_smart_contract(code):
    findings = []
    stats = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
    
    for vuln_name, info in VULNERABILITIES.items():
        matches = re.finditer(info["pattern"], code)
        lines = [(i+1, line.strip()) for i, line in enumerate(code.split('\n'))]
        
        for match in matches:
            line_no = code[:match.start()].count('\n') + 1
            line_content = next((line for n, line in lines if n == line_no), "")
            
            finding = {
                "name": vuln_name,
                "severity": info["severity"],
                "description": info["description"],
                "line": line_no,
                "code": line_content
            }
            findings.append(finding)
            stats[info["severity"]] += 1
    
    return {
        "findings": findings,
        "stats": stats,
        "total": len(findings)
    }

# Add static file handling
@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route("/", methods=["GET", "POST"])
def index():
    try:
        if request.method == "POST":
            contract_code = request.form.get("contract_code", "")
            if not contract_code.strip():
                return render_template("index.html", error="Please provide contract code")
            
            results = scan_smart_contract(contract_code)
            return render_template("index.html",
                                contract_code=contract_code,
                                results=results,
                                error=None)
        
        return render_template("index.html", contract_code="", results=None, error=None)
    except Exception as e:
        return render_template("index.html", error=str(e))

# Add CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Accept')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

@app.route('/', methods=['OPTIONS'])
def handle_options():
    return '', 200

@app.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return render_template("index.html", 
                         contract_code="", 
                         results=[], 
                         error=str(e)), code

@app.errorhandler(405)
def method_not_allowed(e):
    return render_template("index.html", contract_code="", results=[], error="Method not allowed"), 405

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
