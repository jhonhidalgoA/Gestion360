# backend/pdf_calificaciones.py
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.units import inch
from io import BytesIO

def generar_calificaciones_pdf_en_memoria(buffer, datos_estudiante, notas, asignatura, periodo):
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        topMargin=0.5*inch,
        bottomMargin=0.5*inch,
        leftMargin=0.75*inch,
        rightMargin=0.75*inch
    )
    
    elementos = []
    estilos = getSampleStyleSheet()
    
    titulo_estilo = ParagraphStyle(
        'Titulo',
        parent=estilos['Heading1'],
        fontSize=14,
        alignment=TA_CENTER,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    normal = ParagraphStyle(
        'Normal',
        parent=estilos['Normal'],
        fontSize=10,
        alignment=TA_LEFT,
        spaceAfter=6
    )
    
    elementos.append(Paragraph("INSTITUCIÓN EDUCATIVA LA PRESENTACIÓN", titulo_estilo))
    elementos.append(Paragraph("REPORTE DE CALIFICACIONES", titulo_estilo))
    elementos.append(Spacer(1, 0.2*inch))
    
    elementos.append(Paragraph(f"<b>Estudiante:</b> {datos_estudiante['nombre_completo']}", normal))
    elementos.append(Paragraph(f"<b>Grado:</b> {datos_estudiante['grado']}", normal))
    elementos.append(Paragraph(f"<b>Asignatura:</b> {asignatura}", normal))
    elementos.append(Paragraph(f"<b>Periodo:</b> {periodo}", normal))
    elementos.append(Spacer(1, 0.2*inch))
    
    # Tabla: Columna | Nota
    data_tabla = [["Columna", "Nota"]]
    for i, nota in enumerate(notas, 1):
        data_tabla.append([f"Nota {i}", nota if nota != "" else "—"])

    if len(data_tabla) > 1:
        tabla = Table(data_tabla, colWidths=[1.5*inch, 1*inch])
        tabla.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        elementos.append(tabla)
    else:
        elementos.append(Paragraph("No hay calificaciones registradas.", normal))
    
    elementos.append(Spacer(1, 0.3*inch))
    elementos.append(Paragraph("Firma del docente: _________________________", normal))
    
    doc.build(elementos)