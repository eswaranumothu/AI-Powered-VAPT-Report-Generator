from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, Spacer


class CoverPage:
    @staticmethod
    def build(report, story):
        story.append(Spacer(1, 40 * mm))
        heading = ParagraphStyle("CoverHeading", fontName="Helvetica", fontSize=11, leading=16)
        title = ParagraphStyle("CoverTitle", fontName="Helvetica-Bold", fontSize=20, leading=26)
        link = ParagraphStyle("CoverLink", parent=heading, textColor="#1d4ed8")
        story.append(Paragraph(f"{report.project_type.replace('_', ' ').title()} Security Assessment Report", title))
        story.append(Spacer(1, 6 * mm))
        story.append(Paragraph("Target", heading))
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph(report.application_url or report.application_name, link))
        story.append(Spacer(1, 90 * mm))
        detail = ParagraphStyle("CoverDetail", fontName="Helvetica", fontSize=9, leading=13, alignment=TA_CENTER)
        story.append(Paragraph("Prepared by: Security Assessment Team", detail))
        story.append(Spacer(1, 4 * mm))
        story.append(Paragraph(f"Report Generation Date: {report.generated_at or '-'}", detail))
        story.append(Spacer(1, 4 * mm))
        story.append(Paragraph("Confidential", detail))
