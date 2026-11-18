# Founder Journey + QGShield

## Archivos
- `index.html`: selector de las dos áreas.
- `desarrollo.html`: servicios, portafolio, proceso, FAQ y formulario de Founder Journey.
- `ciberseguridad.html`: servicios QGShield, metodología, confidencialidad, FAQ y formulario.
- `api/contact.js`: endpoint serverless de Vercel para enviar ambos formularios por correo usando Resend.
- `assets/qgshield-logo.jpeg`: logo proporcionado.

## Configuración obligatoria del correo
Los formularios envían a `/api/contact`. Para activar el envío:

1. Crea/verifica un dominio de envío en Resend: https://resend.com/
2. En Vercel > Project > Settings > Environment Variables, agrega:
   - `RESEND_API_KEY`: API key de Resend.
   - `CONTACT_EMAIL`: correo que recibirá las solicitudes.
   - `FROM_EMAIL`: remitente verificado en Resend, por ejemplo `Website <contacto@tudominio.com>`.
3. Haz un redeploy del proyecto.

Los dos formularios llegan al correo definido en `CONTACT_EMAIL`; el asunto identifica si la consulta es de Founder Journey o QGShield. Al responder, el correo del visitante aparece como Reply-To.

## Publicación
Sube el contenido de esta carpeta a la raíz del repositorio conectado a Vercel. Mantén `api/` y `assets/` en la raíz. No es necesario instalar un framework.

## Antes de publicar
- Sustituye `https://1founder.vercel.app/...` en las etiquetas canonical si el dominio final es otro.
- Añade la URL real del Manual de IA de Bolsillo y de Hostel Viajeros Arequipa cuando estén disponibles.
- Las tarjetas visuales del portafolio son composiciones tipográficas, no capturas de pantalla. Puedes reemplazarlas por screenshots reales en `assets/`.
- Revisa los servicios de QGShield para que reflejen exactamente el alcance profesional que ofreces.
- Configura protección anti-spam/rate limiting adicional si el formulario recibe abuso.

## Nota
No se incluyen promesas de seguridad absoluta. No solicites contraseñas, códigos 2FA ni claves privadas por formulario o correo.
