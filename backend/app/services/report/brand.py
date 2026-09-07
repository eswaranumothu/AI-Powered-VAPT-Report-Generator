from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate


NAVY = colors.HexColor("#1f2937")
BLUE = colors.HexColor("#2563eb")
PALE_BLUE = colors.HexColor("#eef2f7")
LIGHT_GRAY = colors.HexColor("#e6e6e6")
RED = colors.HexColor("#b91c1c")
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 18 * mm
MARGIN_Y = 18 * mm


def report_styles():
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle("ReportTitle", parent=base["Title"], fontName="Helvetica-Bold", fontSize=18, leading=23, alignment=TA_LEFT, textColor=colors.black),
        "section": ParagraphStyle("Section", parent=base["Heading1"], fontName="Helvetica-Bold", fontSize=14, leading=18, spaceAfter=8, textColor=colors.black),
        "subsection": ParagraphStyle("Subsection", parent=base["Heading2"], fontName="Helvetica-Bold", fontSize=10, leading=13, spaceBefore=9, spaceAfter=4, textColor=colors.black),
        "body": ParagraphStyle("ReportBody", parent=base["BodyText"], fontName="Helvetica", fontSize=8.7, leading=12, alignment=TA_LEFT, spaceAfter=4),
        "small": ParagraphStyle("Small", parent=base["BodyText"], fontName="Helvetica", fontSize=7.2, leading=9),
        "table": ParagraphStyle("Table", parent=base["BodyText"], fontName="Helvetica", fontSize=7.4, leading=9),
        "table_head": ParagraphStyle("TableHead", parent=base["BodyText"], fontName="Helvetica-Bold", fontSize=7, leading=8.2, textColor=colors.white, alignment=TA_CENTER),
        "cover": ParagraphStyle("Cover", parent=base["BodyText"], fontName="Helvetica", fontSize=10, leading=15, alignment=TA_LEFT),
        "end": ParagraphStyle("End", parent=base["BodyText"], fontName="Helvetica-Bold", fontSize=12, leading=16, alignment=TA_CENTER),
    }


def _header_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#c7c7c7"))
    canvas.setLineWidth(0.45)
    canvas.line(MARGIN_X, PAGE_HEIGHT - 13 * mm, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 13 * mm)
    canvas.line(MARGIN_X, 11 * mm, PAGE_WIDTH - MARGIN_X, 11 * mm)
    canvas.setFont("Helvetica", 5.5)
    canvas.setFillColor(colors.HexColor("#888888"))
    canvas.drawString(MARGIN_X, PAGE_HEIGHT - 10.5 * mm, "Confidential")
    canvas.drawString(MARGIN_X, 7.5 * mm, "Security Assessment Report")
    canvas.drawRightString(PAGE_WIDTH - MARGIN_X, 7.5 * mm, f"Page {doc.page}")
    canvas.restoreState()


def _cover(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#c7c7c7"))
    canvas.setLineWidth(0.45)
    canvas.line(MARGIN_X, PAGE_HEIGHT - 13 * mm, PAGE_WIDTH - MARGIN_X, PAGE_HEIGHT - 13 * mm)
    canvas.line(MARGIN_X, 11 * mm, PAGE_WIDTH - MARGIN_X, 11 * mm)
    canvas.setFont("Helvetica", 5.5)
    canvas.setFillColor(colors.HexColor("#888888"))
    canvas.drawString(MARGIN_X, PAGE_HEIGHT - 10.5 * mm, "Confidential")
    canvas.drawString(MARGIN_X, 7.5 * mm, "Confidential")
    canvas.restoreState()


class BrandedDocTemplate(BaseDocTemplate):
    def __init__(self, filename):
        frame = Frame(MARGIN_X, 15 * mm, PAGE_WIDTH - (2 * MARGIN_X), PAGE_HEIGHT - 31 * mm, id="body")
        super().__init__(filename, pagesize=A4, leftMargin=MARGIN_X, rightMargin=MARGIN_X, topMargin=16 * mm, bottomMargin=14 * mm)
        self.addPageTemplates([
            PageTemplate(id="cover", frames=[frame], onPage=_cover),
            PageTemplate(id="body", frames=[frame], onPage=_header_footer),
        ])
