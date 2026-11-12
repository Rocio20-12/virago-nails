# Conectar Google Calendar (una sola vez, con la cuenta de la dueña)
1. console.cloud.google.com > crear proyecto > "APIs y servicios" > habilitar **Google Calendar API**.
2. Pantalla de consentimiento OAuth: tipo Externo, agregar a la dueña como usuaria de prueba (después "Publicar app" para que el token no venza a los 7 días).
3. Credenciales > Crear ID de cliente OAuth > Aplicación web. Redirect URI: `https://developers.google.com/oauthplayground`. Copiar Client ID y Secret al .env.
4. developers.google.com/oauthplayground > engranaje > "Use your own OAuth credentials" > pegar ID/Secret. Autorizar el scope `https://www.googleapis.com/auth/calendar.events` + `https://www.googleapis.com/auth/calendar.freebusy`, iniciar sesión con la cuenta de la dueña, "Exchange authorization code" y copiar el **Refresh token** a `GOOGLE_REFRESH_TOKEN`.
5. Ajustá horarios en `lib/booking.ts` (HOURS) y duraciones (MINUTES).
Cómo funciona: la web lee la disponibilidad (freeBusy) de la agenda de la dueña, crea el evento ahí e invita al email de la clienta, que lo recibe en su Google Calendar.
