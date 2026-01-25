from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from io import BytesIO


def generate_report_pdf(report_text: str) -> BytesIO:
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()
    story = []

    for line in report_text.split("\n"):
        safe_line = (
            line.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
        )
        story.append(Paragraph(safe_line, styles["Normal"]))
        story.append(Spacer(1, 0.15 * inch))

    doc.build(story)
    buffer.seek(0)
    return buffer
