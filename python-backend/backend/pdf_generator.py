from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, 
    Spacer, Image, PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.units import inch, mm
from datetime import datetime
from io import BytesIO
import base64
from typing import Dict, List, Optional, Any


class PDFStyles:
    """Clase para gestionar los estilos del documento PDF"""
    
    # Paleta de colores moderna
    PRIMARY = colors.HexColor("#1E40AF")      # Azul profundo
    SECONDARY = colors.HexColor("#3B82F6")    # Azul medio
    ACCENT = colors.HexColor("#60A5FA")       # Azul claro
    BACKGROUND = colors.HexColor("#F8FAFC")   # Gris muy claro
    TEXT_DARK = colors.HexColor("#1E293B")    # Gris oscuro
    TEXT_LIGHT = colors.HexColor("#64748B")   # Gris medio
    BORDER = colors.HexColor("#E2E8F0")       # Gris claro
    SUCCESS = colors.HexColor("#10B981")      # Verde
    
    @staticmethod
    def create_styles() -> Dict[str, ParagraphStyle]:
        """Crea y retorna todos los estilos personalizados"""
        base_styles = getSampleStyleSheet()
        
        return {
            'header': ParagraphStyle(
                'HeaderStyle',
                parent=base_styles['Heading1'],
                fontSize=22,
                textColor=colors.white,
                alignment=TA_CENTER,
                spaceAfter=8,
                spaceBefore=8,
                fontName='Helvetica-Bold',
                leading=26
            ),
            'subheader': ParagraphStyle(
                'SubheaderStyle',
                parent=base_styles['Heading2'],
                fontSize=16,
                textColor=PDFStyles.PRIMARY,
                alignment=TA_CENTER,
                spaceAfter=12,
                fontName='Helvetica-Bold'
            ),
            'section_title': ParagraphStyle(
                'SectionTitleStyle',
                parent=base_styles['Heading3'],
                fontSize=13,
                textColor=PDFStyles.PRIMARY,
                spaceBefore=8,
                spaceAfter=8,
                fontName='Helvetica-Bold',
                leftIndent=10
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
                fontSize=11,
                textColor=PDFStyles.TEXT_LIGHT,
                alignment=TA_CENTER,
                fontName='Helvetica'
            ),
            'footer': ParagraphStyle(
                'FooterStyle',
                parent=base_styles['Normal'],
                fontSize=8,
                textColor=PDFStyles.TEXT_LIGHT,
                alignment=TA_CENTER,
                spaceBefore=15
            ),
            'label': ParagraphStyle(
                'LabelStyle',
                parent=base_styles['Normal'],
                fontSize=10,
                textColor=PDFStyles.TEXT_LIGHT,
                fontName='Helvetica-Bold'
            ),
            'value': ParagraphStyle(
                'ValueStyle',
                parent=base_styles['Normal'],
                fontSize=10,
                textColor=PDFStyles.TEXT_DARK,
                fontName='Helvetica'
            )
        }


class PDFDataFormatter:
    """Clase para formatear y procesar datos del estudiante"""
    
    @staticmethod
    def format_document(tipo: str, numero: str) -> str:
        """Formatea el documento de identidad"""
        return f"{tipo} {numero}" if tipo and numero else "No registrado"
    
    @staticmethod
    def format_full_name(nombres: str, apellidos: str) -> str:
        """Formatea el nombre completo"""
        return f"{nombres} {apellidos}".strip() or "No registrado"
    
    @staticmethod
    def format_date(date_str: str) -> str:
        """Formatea una fecha"""
        if not date_str:
            return "No registrado"
        try:
            date_obj = datetime.strptime(str(date_str), "%Y-%m-%d")
            return date_obj.strftime("%d de %B de %Y")
        except:
            return str(date_str)
    
    @staticmethod
    def safe_get(data: Dict, key: str, default: str = "No registrado") -> str:
        """Obtiene un valor de forma segura"""
        value = data.get(key, "")
        return str(value) if value else default


class MatriculaPDFGenerator:
    """Generador principal de PDF de matrícula"""
    
    def __init__(self, estudiante_data: Dict[str, Any]):
        self.data = estudiante_data
        self.student = estudiante_data.get("student", {})
        self.family = estudiante_data.get("family", {})
        self.styles = PDFStyles.create_styles()
        self.formatter = PDFDataFormatter()
        self.buffer = BytesIO()
        
    def _create_header(self) -> Table:
        """Crea el encabezado del documento"""
        institution_name = Paragraph(
            "INSTITUCIÓN EDUCATIVA SGAPA",
            self.styles['subheader']
        )
        
        doc_title = Paragraph(
            "REGISTRO DE MATRÍCULA ESTUDIANTE",
            self.styles['header']
        )
        
        header_data = [[institution_name], [doc_title]]
        header_table = Table(header_data, colWidths=[6.5*inch])
        
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BACKGROUND', (0, 1), (0, 1), PDFStyles.PRIMARY),
            ('ROUNDEDCORNERS', [6, 6, 6, 6]),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ]))
        
        return header_table
    
    def _create_student_photo(self) -> Optional[Image]:
        """Procesa y crea la imagen del estudiante"""
        foto_base64 = self.student.get("foto")
        
        if not foto_base64:
            return None
            
        try:
            if foto_base64.startswith("data:image"):
                foto_base64 = foto_base64.split(",")[1]
            
            image_data = base64.b64decode(foto_base64)
            img_buffer = BytesIO(image_data)
            
            img = Image(img_buffer, width=1.5*inch, height=1.5*inch)
            img.hAlign = 'CENTER'
            return img
        except Exception as e:
            print(f"Error procesando imagen: {e}")
            return None
    
    def _create_student_header(self) -> List:
        """Crea la sección de encabezado del estudiante con foto y nombre"""
        elements = []
        
        # Foto
        photo = self._create_student_photo()
        if photo:
            elements.append(photo)
            elements.append(Spacer(1, 12))
        
        # Nombre
        full_name = self.formatter.format_full_name(
            self.student.get("nombres", ""),
            self.student.get("apellidos", "")
        )
        elements.append(Paragraph(full_name, self.styles['student_name']))
        
        # Código
        student_code = f"SGAPA-{self.student.get('numero_documento', 'N/A')}"
        elements.append(Paragraph(student_code, self.styles['student_code']))
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _create_info_section(self, title: str, data: List[tuple]) -> List:
        """Crea una sección de información con título y tabla"""
        elements = []
        
        # Título de sección con barra lateral decorativa
        title_table = Table(
            [[Paragraph(title, self.styles['section_title'])]],
            colWidths=[6.5*inch]
        )
        title_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), PDFStyles.BACKGROUND),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('LINEABOVE', (0, 0), (-1, 0), 3, PDFStyles.PRIMARY),
            ('ROUNDEDCORNERS', [4, 4, 0, 0]),
        ]))
        
        elements.append(title_table)
        elements.append(Spacer(1, 2))
        
        # Tabla de datos
        formatted_data = [
            [Paragraph(f"<b>{label}</b>", self.styles['label']), 
             Paragraph(value, self.styles['value'])]
            for label, value in data
        ]
        
        data_table = Table(formatted_data, colWidths=[2*inch, 4.5*inch])
        data_table.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 15),
            ('RIGHTPADDING', (0, 0), (-1, -1), 15),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, PDFStyles.BACKGROUND]),
            ('LINEBELOW', (0, 0), (-1, -2), 0.5, PDFStyles.BORDER),
            ('LINEBELOW', (0, -1), (-1, -1), 1, PDFStyles.BORDER),
        ]))
        
        elements.append(data_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _get_personal_data(self) -> List[tuple]:
        """Obtiene los datos personales formateados"""
        return [
            ("Documento de Identidad:", self.formatter.format_document(
                self.student.get('tipo_documento', ''),
                self.student.get('numero_documento', '')
            )),
            ("Edad:", self.formatter.safe_get(self.student, 'edad')),
            ("Género:", self.formatter.safe_get(self.student, 'genero')),
            ("Fecha de Nacimiento:", self.formatter.format_date(
                self.student.get('fecha_nacimiento', '')
            )),
            ("Lugar de Nacimiento:", self.formatter.safe_get(
                self.student, 'lugar_nacimiento'
            )),
            ("Teléfono:", self.formatter.safe_get(self.student, 'telefono')),
            ("Correo Electrónico:", self.formatter.safe_get(self.student, 'correo')),
        ]
    
    def _get_academic_data(self) -> List[tuple]:
        """Obtiene los datos académicos formateados"""
        return [
            ("Grado:", self.formatter.safe_get(self.student, 'grade')),
            ("Jornada:", self.formatter.safe_get(self.student, 'jornada')),
            ("Grupo:", self.formatter.safe_get(self.student, 'grupo')),
            ("Dirección de Residencia:", self.formatter.safe_get(
                self.student, 'direccion'
            )),
            ("Barrio:", self.formatter.safe_get(self.student, 'barrio')),
            ("Localidad:", self.formatter.safe_get(self.student, 'localidad')),
            ("Zona:", self.formatter.safe_get(self.student, 'zona')),
            ("EPS:", self.formatter.safe_get(self.student, 'eps')),
            ("Tipo de Sangre:", self.formatter.safe_get(self.student, 'tipo_sangre')),
        ]
    
    def _get_family_data(self) -> List[tuple]:
        """Obtiene los datos familiares formateados"""
        madre = self.family.get("madre", {})
        padre = self.family.get("padre", {})
        
        data = []
        
        if madre:
            data.extend([
                ("Nombre de la Madre:", self.formatter.format_full_name(
                    madre.get("nombres", ""),
                    madre.get("apellidos", "")
                )),
                ("Documento Madre:", self.formatter.safe_get(
                    madre, 'numero_documento'
                )),
                ("Teléfono Madre:", self.formatter.safe_get(madre, 'telefono')),
                ("Correo Madre:", self.formatter.safe_get(madre, 'correo')),
                ("Ocupación Madre:", self.formatter.safe_get(madre, 'ocupacion')),
            ])
        
        if padre:
            if data:  # Añadir separador si ya hay datos de madre
                data.append(("", ""))
            
            data.extend([
                ("Nombre del Padre:", self.formatter.format_full_name(
                    padre.get("nombres", ""),
                    padre.get("apellidos", "")
                )),
                ("Documento Padre:", self.formatter.safe_get(
                    padre, 'numero_documento'
                )),
                ("Teléfono Padre:", self.formatter.safe_get(padre, 'telefono')),
                ("Correo Padre:", self.formatter.safe_get(padre, 'correo')),
                ("Ocupación Padre:", self.formatter.safe_get(padre, 'ocupacion')),
            ])
        
        if not data:
            data = [("Información Familiar:", "No hay datos de padres registrados")]
        
        return data
    
    def _create_footer(self) -> Paragraph:
        """Crea el pie de página del documento"""
        current_date = datetime.now().strftime("%d de %B de %Y")
        student_code = self.student.get('numero_documento', 'N/A')
        
        footer_text = f"""
        <para alignment="center">
            Documento generado automáticamente el {current_date}<br/>
            <b>Sistema de Gestión Administrativa y Procesos Académicos (SGAPA)</b><br/>
            Versión 1.0 | Código Único: <b>SGAPA-{student_code}</b>
        </para>
        """
        
        return Paragraph(footer_text, self.styles['footer'])
    
    def generate(self) -> BytesIO:
        """Genera el PDF completo y retorna el buffer"""
        doc = SimpleDocTemplate(
            self.buffer,
            pagesize=A4,
            topMargin=25*mm,
            bottomMargin=25*mm,
            leftMargin=20*mm,
            rightMargin=20*mm,
            title=f"Matrícula - {self.student.get('numero_documento', 'N/A')}",
            author="SGAPA"
        )
        
        elements = []
        
        # Construir documento
        elements.append(self._create_header())
        elements.append(Spacer(1, 20))
        
        elements.extend(self._create_student_header())
        
        elements.extend(self._create_info_section(
            "📋 Información Personal",
            self._get_personal_data()
        ))
        
        elements.extend(self._create_info_section(
            "🎓 Información Académica",
            self._get_academic_data()
        ))
        
        elements.extend(self._create_info_section(
            "👨‍👩‍👧‍👦 Datos Familiares",
            self._get_family_data()
        ))
        
        elements.append(Spacer(1, 10))
        elements.append(self._create_footer())
        
        # Construir PDF
        doc.build(elements)
        self.buffer.seek(0)
        
        return self.buffer


def generate_matricula_pdf(estudiante_data: Dict[str, Any]) -> BytesIO:
    """
    Función principal para generar el PDF de matrícula.
    
    Args:
        estudiante_data: Diccionario con los datos del estudiante y familia
        
    Returns:
        BytesIO: Buffer con el PDF generado
    """
    generator = MatriculaPDFGenerator(estudiante_data)
    return generator.generate()


# Ejemplo de uso
if __name__ == "__main__":
    # Datos de ejemplo
    ejemplo_data = {
        "student": {
            "nombres": "Juan Pablo",
            "apellidos": "García Rodríguez",
            "tipo_documento": "TI",
            "numero_documento": "1234567890",
            "edad": 15,
            "genero": "Masculino",
            "fecha_nacimiento": "2009-03-15",
            "lugar_nacimiento": "Medellín, Antioquia",
            "telefono": "3001234567",
            "correo": "juan.garcia@email.com",
            "grade": "10°",
            "jornada": "Mañana",
            "grupo": "10-A",
            "direccion": "Calle 50 # 20-30",
            "barrio": "El Poblado",
            "localidad": "Medellín",
            "zona": "Urbana",
            "eps": "Sura EPS",
            "tipo_sangre": "O+",
        },
        "family": {
            "madre": {
                "nombres": "María",
                "apellidos": "Rodríguez",
                "numero_documento": "43123456",
                "telefono": "3009876543",
                "correo": "maria.rodriguez@email.com",
                "ocupacion": "Ingeniera"
            },
            "padre": {
                "nombres": "Carlos",
                "apellidos": "García",
                "numero_documento": "70123456",
                "telefono": "3007654321",
                "correo": "carlos.garcia@email.com",
                "ocupacion": "Médico"
            }
        }
    }
    
    # Generar PDF
    pdf_buffer = generate_matricula_pdf(ejemplo_data)
    
    # Guardar en archivo
    with open("matricula_estudiante.pdf", "wb") as f:
        f.write(pdf_buffer.getvalue())
    
    print("PDF generado exitosamente: matricula_estudiante.pdf")