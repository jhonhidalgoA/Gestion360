from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
import base64

# Opcional: registrar fuente personalizada (ej. Open Sans)
# pdfmetrics.registerFont(TTFont('OpenSans', 'OpenSans-Regular.ttf'))

def generate_matricula_pdf(estudiante_data):
    print("🟢 Iniciando generación de PDF...")  # ← AÑADE ESTO
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=30,
        bottomMargin=30,
        leftMargin=40,
        rightMargin=40
    )
    elements = []

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=14,
        textColor=colors.HexColor("#F57C00"),  # naranja institucional
        alignment=TA_CENTER
    )
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Heading2'],
        fontSize=12,
        spaceAfter=10,
        alignment=TA_CENTER
    )
    normal_style = styles["Normal"]
    normal_style.fontSize = 10

    # Encabezado
    elements.append(Paragraph("COLEGIO STEM 360", title_style))
    elements.append(Paragraph("FICHA DE MATRÍCULA", ParagraphStyle('Subtitle', parent=styles['Heading2'], fontSize=12, alignment=TA_CENTER, spaceAfter=14)))
    elements.append(Spacer(1, 12))

    # Datos del estudiante
    student = estudiante_data["student"]
    foto_base64 = student.get("foto")

    # ✅ Añadir foto si existe
    if foto_base64:
        try:
            # Extraer datos base64 (eliminar prefijo)
            if foto_base64.startswith("data:image"):
                foto_base64 = foto_base64.split(",")[1]
            image_data = base64.b64decode(foto_base64)
            img_buffer = BytesIO(image_data)
            img = Image(img_buffer, width=1.5*inch, height=1.5*inch)
            img.hAlign = "CENTER"
            elements.append(img)
            elements.append(Spacer(1, 12))
        except Exception as e:
            # Opcional: loguear error, pero no detener PDF
            pass
    family = estudiante_data.get("family", {})
    madre = family.get("madre", {})
    padre = family.get("padre", {})

    # Sección: Datos Personales
    elements.append(Paragraph("<b>DATOS DEL ESTUDIANTE</b>", normal_style))
    elements.append(Spacer(1, 6))

    student_data = [
        ["Nombres:", student.get("nombres", "")],
        ["Apellidos:", student.get("apellidos", "")],
        ["Documento:", f"{student.get('tipo_documento', '')} {student.get('numero_documento', '')}"],
        ["Fecha Nac.:", str(student.get("fecha_nacimiento", ""))],
        ["Edad:", str(student.get("edad", ""))],
        ["Género:", student.get("genero", "")],
        ["Lugar Nac.:", student.get("lugar_nacimiento", "")],
        ["Teléfono:", student.get("telefono", "")],
        ["Correo:", student.get("correo", "")],
    ]

    student_table = Table(student_data, colWidths=[120, 300])
    student_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 2),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
    ]))
    elements.append(student_table)
    elements.append(Spacer(1, 12))

    # Sección: Datos Académicos
    elements.append(Paragraph("<b>DATOS ACADÉMICOS</b>", normal_style))
    elements.append(Spacer(1, 6))

    academic_data = [
        ["Grado:", student.get("grade", "")],
        ["Jornada:", student.get("jornada", "")],
        ["Grupo:", student.get("grupo", "")],
        ["Dirección:", student.get("direccion", "")],
        ["Barrio:", student.get("barrio", "")],
        ["Localidad:", student.get("localidad", "")],
        ["Zona:", student.get("zona", "")],
        ["EPS:", student.get("eps", "")],
        ["Tipo de Sangre:", student.get("tipo_sangre", "")],
    ]

    academic_table = Table(academic_data, colWidths=[120, 300])
    academic_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(academic_table)
    elements.append(Spacer(1, 12))

    # Sección: Datos Familiares
    elements.append(Paragraph("<b>DATOS DE LOS PADRES / ACUDIENTES</b>", normal_style))
    elements.append(Spacer(1, 6))

    madre_data = [
        ["Madre:", madre.get("nombres", "") + " " + madre.get("apellidos", "")],
        ["Documento:", madre.get("numero_documento", "")],
        ["Teléfono:", madre.get("telefono", "")],
        ["Correo:", madre.get("correo", "")],
        ["Ocupación:", madre.get("ocupacion", "")],
    ] if madre else [["Madre:", "No registrado"]]

    padre_data = [
        ["Padre:", padre.get("nombres", "") + " " + padre.get("apellidos", "")],
        ["Documento:", padre.get("numero_documento", "")],
        ["Teléfono:", padre.get("telefono", "")],
        ["Correo:", padre.get("correo", "")],
        ["Ocupación:", padre.get("ocupacion", "")],
    ] if padre else [["Padre:", "No registrado"]]

    family_table = Table(madre_data + padre_data, colWidths=[120, 300])
    family_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(family_table)

    # Construir PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer