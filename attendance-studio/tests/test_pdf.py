import base64
import io
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle

from backend.engine import records, inspect



def pdf_fixture(style='table', pages=2):
    stream = io.BytesIO()
    pdf = canvas.Canvas(stream)
    for number in range(pages):
        if style == 'table':
            table = Table([['Roll Number', 'Batch Code', 'Branch', 'Status'], [f'00{number + 1}', 'BT26', 'IT', 'P' if number == 0 else 'A']], colWidths=[120, 100, 80, 80])
            table.setStyle(TableStyle([('GRID', (0, 0), (-1, -1), 1, (0, 0, 0))]))
            table.wrapOn(pdf, 500, 700)
            table.drawOn(pdf, 50, 700)
        elif style == 'text':
            pdf.drawString(50, 750, 'Roll Number Batch Code Branch Status')
            pdf.drawString(50, 730, f'00{number + 1} BT26 IT P')
        elif style == 'list':
            pdf.drawString(50, 750, 'Roll Number')
            pdf.drawString(50, 730, f'00{number + 1}')
        elif style == 'bad':
            pdf.drawString(50, 750, 'Roll Number Batch Code Branch Status')
            pdf.drawString(50, 730, '001 BT26 IT P extra')
        # Blank page simulates the absence of a usable text layer.
        pdf.showPage()
    pdf.save()
    return stream.getvalue()


class PDFTests(unittest.TestCase):
    def test_pdf_table_all_pages(self):
        result, info = records(pdf_fixture(), 'register.pdf', {})
        self.assertEqual(set(result), {'001', '002'})
        self.assertEqual(result['002']['status'], 'Absent')
        self.assertEqual(info['rows'], 2)

    def test_plain_text_and_absentee_pdf(self):
        result, _ = records(pdf_fixture('text'), 'register.pdf', {})
        self.assertEqual(len(result), 2)
        result, _ = records(pdf_fixture('list'), 'absentees.pdf', {'mode':'absentees'})
        self.assertEqual(result['001']['status'], 'Absent')

    def test_unreadable_or_ambiguous_pdf_rejected(self):
        for style in ['blank', 'bad']:
            with self.assertRaises(ValueError):
                inspect(pdf_fixture(style), 'bad.pdf')
        with self.assertRaisesRegex(ValueError, 'OCR'):
            inspect(pdf_fixture('blank'), 'scan.pdf')



if __name__ == '__main__':
    unittest.main()
