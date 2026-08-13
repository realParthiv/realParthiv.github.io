---
title: Invoice Extractor
stack: [Django, Python, pdfplumber, PyMuPDF, Poppler, pandas, Docker]
year: 2025
status: "VERIFIED — SHIPPED"
order: 7
---
# Automated Document Intelligence and Bounding-Box Extraction

Enterprise accounts payable teams deal with thousands of heterogeneous invoice formats daily. Processing these documents manually is slow, error-prone, and expensive. While OCR and standard text extraction exist, corporate invoices suffer from varying spatial layouts, multi-page tabular structures, and unpredictable field positioning, rendering static text parsers ineffective.

**Invoice Extractor** was engineered as an intelligent PDF parsing and data extraction platform. It combines template-driven spatial region targeting, regex-based token matching, and automatic fallback table extraction to ingest unformatted invoices into structured JSON payloads.

## Spatial Bounding-Box and Regex Extraction Pipeline

To support diverse vendor formats, the system implements a dual-layer extraction engine built on **Poppler (`pdftotext`)**, **`pdfplumber`**, and **`PyMuPDF`**:

1. **Spatial Region Targeting:** Allows administrators to define bounding-box coordinates ($x, y, \text{width}, \text{height}$) on vendor sample PDFs to isolate precise graphical regions for header values (e.g., Invoice Number, Tax ID, Total Amount).
2. **Regex Pattern Matching:** Supports fallback field parsing using compiled regular expression patterns and capture groups across extracted document text streams.

## Automatic Table Fallback Engine

Line-item table extraction is often the hardest part of document processing due to varying column alignment and page breaks. 

When vendor templates do not explicitly configure a table bounding box, Invoice Extractor triggers an automated fallback mechanism using **`pdfplumber`** and **`pandas`**. The engine detects implicit column boundaries, extracts structured tabular arrays, cleans numerical data streams via **`numpy`**, and formats items into standardized line-item dictionaries.

## Containerized Django Microservice

The platform is packaged as a lightweight **Django 5.2** microservice containerized with **Docker** and **Docker Compose**. It provides an interactive web interface for vendor template configuration alongside asynchronous REST/AJAX endpoints for seamless integration into enterprise ERP systems and automated accounts payable pipelines.
