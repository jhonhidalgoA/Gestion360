from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, 
    Spacer, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.units import inch, mm
from datetime import datetime
from io import BytesIO
import base64
from typing import Dict, List, Optional, Any
import qrcode
from PIL import Image as PilImage


class PDFStyles:
    """Clase para gestionar los estilos del documento PDF"""
    
    PRIMARY = colors.HexColor("#0D7DED")      # Azul oscuro elegante
    SECONDARY = colors.HexColor("#34495E")    # Azul oscuro secundario
    ACCENT = colors.HexColor("#1ABC9C")       # Verde azulado moderno
    BACKGROUND = colors.HexColor("#F8F9FA")   # Gris muy claro
    TEXT_DARK = colors.HexColor("#2C3E50")    # Texto oscuro
    TEXT_LIGHT = colors.HexColor("#7F8C8D")   # Texto gris
    BORDER = colors.HexColor("#E9ECEF")       # Borde suave
    SUCCESS = colors.HexColor("#27AE60")      # Verde éxito profesional
    
    @staticmethod
    def create_styles() -> Dict[str, ParagraphStyle]:
        base_styles = getSampleStyleSheet()
        
        return {
            'header': ParagraphStyle(
                'HeaderStyle',
                parent=base_styles['Heading1'],
                fontSize=20,
                textColor=colors.white,
                alignment=TA_CENTER,
                spaceAfter=6,
                spaceBefore=6,
                fontName='Helvetica-Bold',
                leading=22
            ),
            'institution': ParagraphStyle(
                'InstitutionStyle',
                parent=base_styles['Normal'],
                fontSize=14,
                textColor=colors.white,
                alignment=TA_CENTER,
                fontName='Helvetica',
                spaceAfter=4
            ),
            'student_name': ParagraphStyle(
                'StudentNameStyle',
                parent=base_styles['Heading2'],
                fontSize=18,
                textColor=PDFStyles.TEXT_DARK,
                alignment=TA_CENTER,
                spaceAfter=4,
                fontName='Helvetica-Bold'
            ),
            'student_code': ParagraphStyle(
                'StudentCodeStyle',
                parent=base_styles['Normal'],
                fontSize=12,
                textColor=PDFStyles.TEXT_LIGHT,
                alignment=TA_CENTER,
                fontName='Helvetica'
            ),
            'section_title': ParagraphStyle(
                'SectionTitleStyle',
                parent=base_styles['Heading3'],
                fontSize=11,
                textColor=colors.white,
                spaceBefore=8,
                spaceAfter=8,
                fontName='Helvetica-Bold',
                leftIndent=12
            ),
            'footer': ParagraphStyle(
                'FooterStyle',
                parent=base_styles['Normal'],
                fontSize=8,
                textColor=PDFStyles.TEXT_LIGHT,
                alignment=TA_CENTER,
                spaceBefore=10
            ),
            'footer_code': ParagraphStyle(
                'FooterCodeStyle',
                parent=base_styles['Normal'],
                fontSize=8,
                textColor=PDFStyles.TEXT_DARK,
                alignment=TA_CENTER,
                fontName='Helvetica-Bold'
            ),
            'label': ParagraphStyle(
                'LabelStyle',
                parent=base_styles['Normal'],
                fontSize=9,
                textColor=PDFStyles.TEXT_DARK,
                fontName='Helvetica-Bold'
            ),
            'value': ParagraphStyle(
                'ValueStyle',
                parent=base_styles['Normal'],
                fontSize=9,
                textColor=PDFStyles.TEXT_DARK,
                fontName='Helvetica'
            ),
            'status': ParagraphStyle(
                'StatusStyle',
                parent=base_styles['Normal'],
                fontSize=9,
                textColor=PDFStyles.SUCCESS,
                alignment=TA_CENTER,
                fontName='Helvetica-Bold'
            ),
            'qr_text': ParagraphStyle(
                'QRTextStyle',
                parent=base_styles['Normal'],
                fontSize=7,
                textColor=PDFStyles.TEXT_LIGHT,
                alignment=TA_CENTER,
                fontName='Helvetica'
            )
        }


class PDFDataFormatter:
    """Clase para formatear y procesar datos"""
    
    @staticmethod
    def format_document(tipo: str, numero: str) -> str:
        return f"{tipo} {numero}" if tipo and numero else "No registrado"
    
    @staticmethod
    def format_full_name(nombres: str, apellidos: str) -> str:
        return f"{nombres} {apellidos}".strip() or "No registrado"
    
    @staticmethod
    def format_date(date_str: str) -> str:
        if not date_str:
            return "No registrado"
        try:
            date_obj = datetime.strptime(str(date_str), "%Y-%m-%d")
            return date_obj.strftime("%Y-%m-%d")
        except:
            return str(date_str)
    
    @staticmethod
    def safe_get(data: Dict, key: str, default: str = "No registrado") -> str:
        value = data.get(key, "")
        return str(value) if value else default


class QRCodeGenerator:
    """Generador de códigos QR"""

    @staticmethod
    def generate_qr_code(data: str, size: int = 80) -> Optional[Image]:
        try:
            qr = qrcode.make(data)
            img_buffer = BytesIO()
            qr.save(img_buffer)
            img_buffer.seek(0)
            img = Image(img_buffer, width=size, height=size)
            img.hAlign = 'CENTER'
            return img
        except Exception as e:
            print(f"Error generando QR: {e}")
            return None


class MatriculaPDFGenerator:
    """Generador principal de PDF de matrícula"""
    
    def __init__(self, estudiante_data: Dict[str, Any]):
        self.data = estudiante_data
        self.student = estudiante_data.get("student", {})
        self.family = estudiante_data.get("family", {})
        self.styles = PDFStyles.create_styles()
        self.formatter = PDFDataFormatter()
        self.qr_generator = QRCodeGenerator()
        self.buffer = BytesIO()
        
    def _create_header(self) -> Table:
        institution = Paragraph("COLEGIO STEM 360", self.styles['institution'])
        title = Paragraph("REGISTRO MATRÍCULA ESTUDIANTE", self.styles['header'])
        header_data = [[institution], [title]]
        header_table = Table(header_data, colWidths=[6.5*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.PRIMARY),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        return header_table
    
    def _create_student_photo(self) -> Optional[Image]:
        foto_base64 = self.student.get("foto")
        if not foto_base64:
            return None
        try:
            if foto_base64.startswith("data:image"):
                foto_base64 = foto_base64.split(",")[1]
            image_data = base64.b64decode(foto_base64)
            img_buffer = BytesIO(image_data)
            img = Image(img_buffer, width=1.6*inch, height=1.6*inch)
            img.hAlign = 'CENTER'
            return img
        except Exception as e:
            print(f"Error procesando imagen: {e}")
            return None
    
    def _create_student_header(self) -> List:
        elements = []
        photo = self._create_student_photo()
        if photo:
            elements.append(Spacer(1, 12))
            elements.append(photo)
            elements.append(Spacer(1, 12))
        full_name = self.formatter.format_full_name(
            self.student.get("nombres", ""),
            self.student.get("apellidos", "")
        )
        elements.append(Paragraph(full_name, self.styles['student_name']))
        student_code = f"SGAPA-{self.student.get('numero_documento', 'N/A')}"
        elements.append(Paragraph(student_code, self.styles['student_code']))
        elements.append(Spacer(1, 20))
        return elements
    
    def _create_info_section(self, title: str, data: List[tuple]) -> List:
        elements = []
        title_table = Table(
            [[Paragraph(title, self.styles['section_title'])]],
            colWidths=[6.5*inch]
        )
        title_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.PRIMARY),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(title_table)
        elements.append(Spacer(1, 8))
        formatted_data = []
        for label, value in data:
            if label and value:
                formatted_data.append([
                    Paragraph(f"{label}", self.styles['label']), 
                    Paragraph(value, self.styles['value'])
                ])
        if formatted_data:
            data_table = Table(formatted_data, colWidths=[2.2*inch, 4.3*inch])
            data_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('LINEBELOW', (0, 0), (-1, -1), 0.5, PDFStyles.BORDER),
                ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ]))
            elements.append(data_table)
        elements.append(Spacer(1, 15))
        return elements
    
    def _get_personal_data(self) -> List[tuple]:
        return [
            ("Documento:", self.formatter.format_document(
                self.student.get('tipo_documento', ''),
                self.student.get('numero_documento', '')
            )),
            ("Edad:", self.formatter.safe_get(self.student, 'edad')),
            ("Género:", self.formatter.safe_get(self.student, 'genero')),
            ("Fecha Nacimiento:", self.formatter.format_date(
                self.student.get('fecha_nacimiento', '')
            )),
            ("Lugar Nacimiento:", self.formatter.safe_get(
                self.student, 'lugar_nacimiento'
            )),
        ]
    
    def _get_academic_data(self) -> List[tuple]:
        return [
            ("Grado:", self.formatter.safe_get(self.student, 'grade')),
            ("Jornada:", self.formatter.safe_get(self.student, 'jornada')),
            ("Grupo:", self.formatter.safe_get(self.student, 'grupo')),
            ("Dirección:", self.formatter.safe_get(self.student, 'direccion')),
            ("Barrio:", self.formatter.safe_get(self.student, 'barrio')),
            ("Localidad:", self.formatter.safe_get(self.student, 'localidad')),
            ("Zona:", self.formatter.safe_get(self.student, 'zona')),
            ("EPS:", self.formatter.safe_get(self.student, 'eps')),
            ("Tipo de Sangre:", self.formatter.safe_get(self.student, 'tipo_sangre')),
        ]
    
    def _get_family_data(self) -> List[tuple]:
        madre = self.family.get("madre", {})
        padre = self.family.get("padre", {})
        data = []
        if madre and madre.get("nombres"):
            data.extend([
                ("Madre:", self.formatter.format_full_name(madre.get("nombres", ""), madre.get("apellidos", ""))),
                ("Documento Madre:", self.formatter.safe_get(madre, 'numero_documento')),
                ("Teléfono Madre:", self.formatter.safe_get(madre, 'telefono')),
                ("Correo Madre:", self.formatter.safe_get(madre, 'correo')),
                ("Ocupación Madre:", self.formatter.safe_get(madre, 'ocupacion')),
            ])
        if padre and padre.get("nombres"):
            if data:
                data.append(("", ""))
            data.extend([
                ("Padre:", self.formatter.format_full_name(padre.get("nombres", ""), padre.get("apellidos", ""))),
                ("Documento Padre:", self.formatter.safe_get(padre, 'numero_documento')),
                ("Teléfono Padre:", self.formatter.safe_get(padre, 'telefono')),
                ("Correo Padre:", self.formatter.safe_get(padre, 'correo')),
                ("Ocupación Padre:", self.formatter.safe_get(padre, 'ocupacion')),
            ])
        if not data:
            data = [("Información Familiar:", "No hay datos de padres registrados")]
        return data
    
    def _create_footer(self) -> List:
        elements = []
        status_table = Table(
            [[Paragraph("✓ Información Completa", self.styles['status'])]],
            colWidths=[6.5*inch]
        )
        status_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(status_table)
        elements.append(Spacer(1, 8))
        student_code = self.student.get('numero_documento', 'N/A')
        qr_data = f"SGAPA-{student_code}|{self.student.get('nombres', '')} {self.student.get('apellidos', '')}|{datetime.now().strftime('%Y-%m-%d')}"
        qr_image = self.qr_generator.generate_qr_code(qr_data, size=150)
        if qr_image:
            elements.append(qr_image)
            elements.append(Spacer(1, 5))
            qr_text = Paragraph("Código de verificación - SGAPA", self.styles['qr_text'])
            elements.append(qr_text)
            elements.append(Spacer(1, 8))
        current_date = datetime.now().strftime("%d de %B, %Y")
        footer_text = f"""
        <para alignment="center">
            Documento generado automáticamente el: {current_date}<br/>
            Sistema de Gestión Administrativa y Procesos Académicos (SGAPA) - Versión 1.0
        </para>
        """
        elements.append(Paragraph(footer_text, self.styles['footer']))
        elements.append(Spacer(1, 6))
        code_text = f"Código Único: SGAPA-{student_code}"
        code_table = Table(
            [[Paragraph(code_text, self.styles['footer_code'])]],
            colWidths=[6.5*inch]
        )
        code_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.BACKGROUND),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(code_table)
        return elements
    
    def generate(self) -> BytesIO:
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            topMargin=15*mm,
            bottomMargin=15*mm,
            leftMargin=15*mm,
            rightMargin=15*mm,
            title=f"Matrícula - {self.student.get('numero_documento', 'N/A')}",
            author="SGAPA"
        )
        elements = []
        elements.append(self._create_header())
        elements.extend(self._create_student_header())
        elements.extend(self._create_info_section("Información Personal", self._get_personal_data()))
        elements.extend(self._create_info_section("Información Académica", self._get_academic_data()))
        elements.extend(self._create_info_section("Datos Familiares", self._get_family_data()))
        elements.extend(self._create_footer())
        doc.build(elements)
        self.buffer.seek(0)
        return self.buffer


class DocentePDFGenerator:
    """Generador principal de PDF de ficha de docente"""
    
    def __init__(self, docente_data: Dict[str, Any]):
        self.data = docente_data
        self.docente = docente_data.get("docente", {})
        self.styles = PDFStyles.create_styles()
        self.formatter = PDFDataFormatter()
        self.qr_generator = QRCodeGenerator()
        self.buffer = BytesIO()
        
    def _create_header(self) -> Table:
        institution = Paragraph("COLEGIO STEM 360", self.styles['institution'])
        title = Paragraph("FICHA DE DOCENTE", self.styles['header'])
        header_data = [[institution], [title]]
        header_table = Table(header_data, colWidths=[6.5*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.PRIMARY),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        return header_table
    
    def _create_student_photo(self) -> Optional[Image]:
   
        photo_base64 = self.docente.get("photo") 
        if not photo_base64:
            return None
        try:
            if photo_base64.startswith("data:image"):
                photo_base64 = photo_base64.split(",")[1]
            image_data = base64.b64decode(photo_base64)
            img_buffer = BytesIO(image_data)
            img = Image(img_buffer, width=1.2*inch, height=1.2*inch)
            img.hAlign = 'CENTER'
            return img
        except Exception as e:
            print(f"Error cargando foto: {e}")
            return None
    
    def _create_student_header(self) -> List:
        elements = []
        photo = self._create_student_photo()
        if photo:
            elements.append(Spacer(1, 12))
            elements.append(photo)
            elements.append(Spacer(1, 12))
        full_name = self.formatter.format_full_name(
            self.docente.get("teacherName", ""),
            self.docente.get("teacherLastname", "")
        )
        elements.append(Paragraph(full_name, self.styles['student_name']))
        student_code = f"DOC-{self.docente.get('codigo', 'N/A')}"
        elements.append(Paragraph(student_code, self.styles['student_code']))
        elements.append(Spacer(1, 20))
        return elements
    
    def _create_info_section(self, title: str, data: List[tuple]) -> List:
        elements = []
        title_table = Table(
            [[Paragraph(title, self.styles['section_title'])]],
            colWidths=[6.5*inch]
        )
        title_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.PRIMARY),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(title_table)
        elements.append(Spacer(1, 8))
        formatted_data = []
        for label, value in data:
            if label and value:
                formatted_data.append([
                    Paragraph(f"{label}", self.styles['label']), 
                    Paragraph(value, self.styles['value'])
                ])
        if formatted_data:
            data_table = Table(formatted_data, colWidths=[2.2*inch, 4.3*inch])
            data_table.setStyle(TableStyle([
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 12),
                ('RIGHTPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('LINEBELOW', (0, 0), (-1, -1), 0.5, PDFStyles.BORDER),
                ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ]))
            elements.append(data_table)
        elements.append(Spacer(1, 15))
        return elements
    
    def _get_personal_data(self) -> List[tuple]:
        return [
            ("Documento:", self.formatter.format_document(
                self.docente.get('teacherDocument', ''),
                self.docente.get('teacherDocumentNumber', '')
            )),
            ("Edad:", self.formatter.safe_get(self.docente, 'teacherAge')),
            ("Género:", self.formatter.safe_get(self.docente, 'teacherGender')),
            ("Fecha Nacimiento:", self.formatter.format_date(
                self.docente.get('teacherBirthDate', '')
            )),
            ("Lugar Nacimiento:", self.formatter.safe_get(
                self.docente, 'teacherBirthPlace'
            )),
            ("Teléfono:", self.formatter.safe_get(self.docente, 'teacherPhone')),
            ("Correo Electrónico:", self.formatter.safe_get(self.docente, 'teacherEmail')),
        ]
    
    def _get_professional_data(self) -> List[tuple]:
        return [
            ("Profesión:", self.formatter.safe_get(self.docente, 'teacherProfession')),
            ("Área de Especialización:", self.formatter.safe_get(self.docente, 'teacherArea')),
            ("Número de Resolución:", self.formatter.safe_get(self.docente, 'teacherResolutionNumber')),
            ("Escalafón Docente:", self.formatter.safe_get(self.docente, 'teacherScale')),
        ]
    
    def _create_footer(self) -> List:
        elements = []
        status_table = Table(
            [[Paragraph("✓ Información Completa", self.styles['status'])]],
            colWidths=[6.5*inch]
        )
        status_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(status_table)
        elements.append(Spacer(1, 8))
        docente_code = self.docente.get('codigo', 'N/A')
        qr_data = f"DOC-{docente_code}|{self.docente.get('teacherName', '')} {self.docente.get('teacherLastname', '')}|{datetime.now().strftime('%Y-%m-%d')}"
        qr_image = self.qr_generator.generate_qr_code(qr_data, size=150)
        if qr_image:
            elements.append(qr_image)
            elements.append(Spacer(1, 5))
            qr_text = Paragraph("Código de verificación - SGAPA", self.styles['qr_text'])
            elements.append(qr_text)
            elements.append(Spacer(1, 8))
        current_date = datetime.now().strftime("%d de %B, %Y")
        footer_text = f"""
        <para alignment="center">
            Documento generado automáticamente el: {current_date}<br/>
            Sistema de Gestión Administrativa y Procesos Académicos (SGAPA) - Versión 1.0
        </para>
        """
        elements.append(Paragraph(footer_text, self.styles['footer']))
        elements.append(Spacer(1, 6))
        code_text = f"Código Único: DOC-{docente_code}"
        code_table = Table(
            [[Paragraph(code_text, self.styles['footer_code'])]],
            colWidths=[6.5*inch]
        )
        code_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.BACKGROUND),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        elements.append(code_table)
        return elements
    
    def generate(self) -> BytesIO:
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            topMargin=15*mm,
            bottomMargin=15*mm,
            leftMargin=15*mm,
            rightMargin=15*mm,
            title=f"Ficha Docente - {self.docente.get('codigo', 'N/A')}",
            author="SGAPA"
        )
        elements = []
        elements.append(self._create_header())
        elements.extend(self._create_student_header())
        elements.extend(self._create_info_section("Información Personal", self._get_personal_data()))
        elements.extend(self._create_info_section("Información Profesional", self._get_professional_data()))
        elements.extend(self._create_footer())
        doc.build(elements)
        self.buffer.seek(0)
        return self.buffer


# === FUNCIONES PÚBLICAS ===

def generate_matricula_pdf(estudiante_data: Dict[str, Any]) -> BytesIO:
    generator = MatriculaPDFGenerator(estudiante_data)
    return generator.generate()

def generate_docente_pdf(docente_data: Dict[str, Any]) -> BytesIO:
    generator = DocentePDFGenerator(docente_data)
    return generator.generate()