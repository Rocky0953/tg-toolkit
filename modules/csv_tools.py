#!/usr/bin/env python3
"""
TG-TOOLKIT: Phase 10 — CSV Tools Module
General CSV validator, parser, filter, deduplicator, and JSON conversion utility.
"""

import os
import sys
import csv
import json
from typing import List, Dict, Any, Optional, Tuple

from .utils import (
    get_base_dir,
    print_banner,
    print_success,
    print_error,
    print_warning,
    print_info,
    Colors
)

def load_csv(filepath: str) -> Tuple[List[str], List[Dict[str, str]]]:
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"File {filepath} does not exist.")
    
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = [row for row in reader]
    return list(fieldnames), rows

def validate_csv(filepath: str) -> Dict[str, Any]:
    try:
        fields, rows = load_csv(filepath)
        size = os.path.getsize(filepath)
        has_credentials = any(k.lower() in ("api_hash", "hash", "password", "session", "otp") for k in fields)
        return {
            "valid": True,
            "rows_count": len(rows),
            "columns": fields,
            "file_size_bytes": size,
            "credential_warning": has_credentials
        }
    except Exception as e:
        return {
            "valid": False,
            "error": str(e)
        }

def deduplicate_csv(input_path: str, column_name: str, output_path: str) -> int:
    fields, rows = load_csv(input_path)
    seen = set()
    deduped = []
    
    for r in rows:
        val = r.get(column_name, "").strip().lower()
        if val not in seen:
            seen.add(val)
            deduped.append(r)

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(deduped)

    return len(rows) - len(deduped)

def csv_to_json(csv_path: str, json_path: str):
    fields, rows = load_csv(csv_path)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2)

def json_to_csv(json_path: str, csv_path: str):
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not data or not isinstance(data, list):
        raise ValueError("JSON file must contain a list of objects.")
    
    fieldnames = list(data[0].keys())
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

def run_csv_menu():
    while True:
        print_banner("CSV Data Utilities")
        print(f"[{Colors.BOLD}1{Colors.END}] 🔍 Validate CSV Integrity")
        print(f"[{Colors.BOLD}2{Colors.END}] 🧹 Deduplicate CSV Rows")
        print(f"[{Colors.BOLD}3{Colors.END}] 🔄 Convert CSV → JSON")
        print(f"[{Colors.BOLD}4{Colors.END}] 🔄 Convert JSON → CSV")
        print(f"[{Colors.BOLD}0{Colors.END}] 🔙 Back to Main Menu\n")

        choice = input("Select an option [0-4]: ").strip()

        if choice == "1":
            p = input("\nEnter CSV file path: ").strip()
            if p:
                res = validate_csv(p)
                if res["valid"]:
                    print_success(f"CSV is valid! Rows: {res['rows_count']}, Columns: {', '.join(res['columns'])}")
                    if res["credential_warning"]:
                        print_warning("Warning: Column names indicate possible credential tokens! Do not share publicly.")
                else:
                    print_error(f"Validation failed: {res.get('error')}")
            input("\nPress Enter to continue...")

        elif choice == "2":
            src = input("\nSource CSV path: ").strip()
            col = input("Key column name to deduplicate on: ").strip()
            dst = input("Output CSV path: ").strip()
            if src and col and dst:
                try:
                    removed = deduplicate_csv(src, col, dst)
                    print_success(f"Deduplication complete. Removed {removed} duplicate entries. Saved to {dst}")
                except Exception as e:
                    print_error(f"Error: {e}")
            input("\nPress Enter to continue...")

        elif choice == "3":
            src = input("\nCSV file path: ").strip()
            dst = input("Destination JSON path: ").strip()
            if src and dst:
                try:
                    csv_to_json(src, dst)
                    print_success(f"Converted CSV to JSON: {dst}")
                except Exception as e:
                    print_error(f"Failed: {e}")
            input("\nPress Enter to continue...")

        elif choice == "4":
            src = input("\nJSON file path: ").strip()
            dst = input("Destination CSV path: ").strip()
            if src and dst:
                try:
                    json_to_csv(src, dst)
                    print_success(f"Converted JSON to CSV: {dst}")
                except Exception as e:
                    print_error(f"Failed: {e}")
            input("\nPress Enter to continue...")

        elif choice == "0":
            break
        else:
            print_error("Invalid selection.")

if __name__ == "__main__":
    run_csv_menu()
