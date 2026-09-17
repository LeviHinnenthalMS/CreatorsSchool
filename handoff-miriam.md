# Creators School — Handbuch für Miriam

Willkommen! Dieses Dokument ist dein persönliches Handbuch für die neue Website der Creators School. Du findest hier:

- Wie die Website aufgebaut ist (einfach erklärt)
- Deine Zugangsdaten für alle Dienste
- Schritt-für-Schritt-Anleitungen für alles, was du regelmässig machen wirst

Du brauchst **keine technischen Vorkenntnisse**. Wenn etwas unklar ist, melde dich einfach.

---

## 1. Wie deine Website aufgebaut ist

Deine Website besteht aus zwei Teilen, die zusammenarbeiten:

### 1.1 Die öffentliche Website
Das ist das, was deine Besucher sehen, wenn sie **[https://DEINE-DOMAIN.de]** aufrufen. Diese Seite läuft bei **Vercel** — das ist der Anbieter, der die Website im Internet verfügbar macht (wie ein Hausmeister, der sicherstellt, dass die Türen immer offen sind).

### 1.2 Das Backend (Sanity Studio)
Das ist dein **Redaktions-Bereich**, wo du alle Inhalte bearbeitest — Texte, Bilder, Angebote, Termine, Blog-Beiträge. Du findest es unter:

> **[https://DEINE-DOMAIN.de/admin]**

Wenn du dort etwas änderst und auf **"Publish"** klickst, erscheint die Änderung wenige Sekunden später auf der öffentlichen Website. Alles, was du siehst, wird aus diesem Backend geladen — du musst niemals eine technische Datei anfassen.

### 1.3 Die Sprachen
Deine Website gibt es in **Deutsch** (Standard) und **Englisch**:

- Deutsche Seiten liegen unter `deine-domain.de/...`
- Englische Seiten liegen unter `deine-domain.de/en/...`

Im Backend hat **jedes Dokument eine eigene Sprachversion**. Das heisst: die deutsche Startseite und die englische Startseite sind zwei getrennte Dokumente, die miteinander verknüpft sind.

### 1.4 Weitere Dienste im Hintergrund
Diese arbeiten automatisch — du musst dich normalerweise nicht darum kümmern:

| Dienst | Wofür | Wann du ihn brauchst |
|---|---|---|
| **Vercel** | Hosting der Website | Nur, wenn die Seite offline ist |
| **Sanity** | Inhalte (dein Backend) | Täglich |
| **Resend** | Verschickt E-Mails vom Kontaktformular | Nur bei Zustell-Problemen |
| **CookieYes** | Cookie-Banner / DSGVO | Nur, wenn du das Banner anpassen willst |
| **Google Tag Manager** | Statistik / Tracking | Nur mit Support |
| **Domain-Anbieter** | Deine Web-Adresse | Nur bei Verlängerung/Umzug |

---

## 2. Deine Zugangsdaten

**Wichtig:** Bewahre dieses Blatt sicher auf. Am besten in einem Passwort-Manager (z. B. 1Password, Bitwarden oder LastPass).

### 2.1 Sanity Studio (dein Backend)

| Feld | Wert |
|---|---|
| URL | https://DEINE-DOMAIN.de/admin |
| E-Mail | [DEINE-E-MAIL] |
| Passwort | [PASSWORT] |
| Login-Methode | [z. B. Google / E-Mail + Passwort] |

### 2.2 Vercel (Hosting)

| Feld | Wert |
|---|---|
| URL | https://vercel.com |
| E-Mail | [DEINE-E-MAIL] |
| Passwort | [PASSWORT] |
| Team/Projekt | [TEAM-NAME] |

### 2.3 Resend (E-Mail-Versand)

| Feld | Wert |
|---|---|
| URL | https://resend.com |
| E-Mail | [DEINE-E-MAIL] |
| Passwort | [PASSWORT] |
| Empfangs-Adresse Kontaktformular | [z. B. info@creators-school.de] |
| Absender-Adresse | [z. B. Creators School <noreply@creators-school.de>] |

### 2.4 CookieYes (Cookie-Banner)

| Feld | Wert |
|---|---|
| URL | https://app.cookieyes.com |
| E-Mail | [DEINE-E-MAIL] |
| Passwort | [PASSWORT] |

### 2.5 Google Tag Manager

| Feld | Wert |
|---|---|
| URL | https://tagmanager.google.com |
| Google-Konto | [DEINE-E-MAIL] |
| Container-ID | [GTM-XXXXXXX] |

### 2.6 Domain

| Feld | Wert |
|---|---|
| Anbieter | [z. B. IONOS / GoDaddy / Namecheap] |
| URL | [LOGIN-URL] |
| Kunden-Nr. / E-Mail | [DEINE-DATEN] |
| Passwort | [PASSWORT] |
| Domain | [deine-domain.de] |
| Verlängerung fällig am | [DATUM] |

---

## 3. Einloggen im Backend

1. Öffne einen Browser (Chrome, Safari, Firefox — egal).
2. Gehe zu **https://DEINE-DOMAIN.de/admin**
3. Es erscheint ein Login-Fenster. Melde dich mit deiner E-Mail und deinem Passwort an (oder mit dem Google-Konto, das für Sanity hinterlegt wurde).
4. Du landest im **Studio** — dem Bereich, wo du alles bearbeitest.

**Tipp:** Speichere die Adresse `https://DEINE-DOMAIN.de/admin` als Lesezeichen in deinem Browser. So kommst du mit einem Klick hin.

---

## 4. Übersicht: Was findest du wo?

Links im Studio siehst du eine Liste — das ist dein **Navigationsbereich**. Hier eine kurze Erklärung, was jeder Eintrag bedeutet:

| Eintrag | Was ist das? |
|---|---|
| **Site settings** | Grundeinstellungen der Website (Name, Standard-Bild fürs Teilen auf Facebook, Fallback-Texte) |
| **Footer** | Der untere Bereich, der auf allen Seiten erscheint (Kontakt, Öffnungszeiten, Links) |
| **Navigation** | Das Menü ganz oben (welche Seiten sind verlinkt?) |
| **Redirects** | Weiterleitungen (falls sich eine URL ändert) |
| **Homepage** | Die Startseite |
| **Pages** | Alle anderen Seiten (Über uns, Kontakt, Angebote-Übersicht …) |
| **Global modules** | Bausteine, die auf mehreren Seiten gleichzeitig eingebunden sind |
| **Blog posts** | Blog-Beiträge |
| **Offerings** | Kurse und Angebote |
| **Schedule** | Stundenplan / Termine |
| **Gallery** | Bildergalerie |
| **Performances** | Aufführungen / Events |
| **Teachers** | Lehrer:innen-Profile |
| **Jobs** | Stellenausschreibungen |
| **Contact submissions** | Nachrichten aus dem Kontaktformular (nur zum Lesen) |
| **Testimonials** | Zitate zufriedener Kund:innen |
| **Logos** | Partner-Logos / "Bekannt aus"-Bereich |
| **People** | Personen-Profile (allgemein, z. B. für Zitate oder Beiträge) |
| **Announcements** | Ankündigungen / Banner |
| **Newsletter subscribers** | Alle, die sich für den Newsletter angemeldet haben |

Wenn ein Bereich mehrere Sprachen hat, siehst du beim Anklicken **"All / Deutsch / English"** — so kannst du nach Sprache filtern.

---

## 5. Anleitungen — Schritt für Schritt

### 5.1 Eine bestehende Seite bearbeiten

1. Klicke im linken Menü auf **"Pages"** (oder **"Homepage"**, wenn du die Startseite bearbeiten willst).
2. Wähle **"Deutsch"** (oder "English", je nachdem, was du ändern willst).
3. Klicke auf die Seite, die du bearbeiten möchtest.
4. Rechts öffnet sich das Bearbeitungs-Fenster. Du siehst oben zwei Reiter:
   - **Stage** — der grosse obere Bereich (Hero-Banner)
   - **Page builder** — alle weiteren Inhalts-Bausteine
5. Klicke auf einen Baustein, um ihn zu bearbeiten. Änderungen werden **automatisch gespeichert** (aber noch nicht veröffentlicht — siehe nächster Schritt).

### 5.2 Änderungen veröffentlichen

Nach dem Bearbeiten siehst du unten rechts einen **blauen "Publish"-Button**.

1. Klicke auf **"Publish"**.
2. Warte ca. 10–30 Sekunden.
3. Rufe die öffentliche Website in einem neuen Tab auf, um zu prüfen, ob die Änderung sichtbar ist.

**Wichtig:** Solange du nicht auf "Publish" klickst, ist deine Änderung nur ein **Entwurf** und für Besucher unsichtbar. Das ist Absicht — so kannst du in Ruhe schreiben, ohne dass halbfertige Sachen live gehen.

**Änderungen rückgängig machen:** Über den Reiter **"History"** oben rechts kannst du frühere Versionen ansehen und wiederherstellen.

### 5.3 Ein Bild austauschen oder hochladen

1. Klicke im Bearbeitungs-Fenster auf das Bild-Feld.
2. Wähle **"Upload"** und ziehe eine Datei rein — oder **"Select"**, um ein Bild aus deiner Mediathek auszuwählen.
3. Wichtig: Trage einen **Alt-Text** ein! Das ist eine kurze Beschreibung des Bildes für blinde Besucher und für Google. Beispiel: *"Kinder tanzen in einem sonnendurchfluteten Studio"*.
4. Speichern erfolgt automatisch. Vergiss nicht "Publish" am Ende.

**Tipp:** Bilder sollten mindestens **1200 Pixel breit** sein, damit sie auf grossen Bildschirmen scharf aussehen. Kleinere Grössen werden automatisch berechnet.

### 5.4 Eine neue Seite anlegen

1. Klicke im linken Menü auf **"Pages" → "Deutsch"**.
2. Klicke oben rechts auf das **"+"-Symbol** (oder "Create new").
3. Fülle die Grundfelder aus:
   - **Title** — der Seitentitel (z. B. "Über uns")
   - **Slug** — die URL (z. B. `ueber-uns` → wird zu `deine-domain.de/ueber-uns`)
   - **Language** — steht automatisch auf "Deutsch"
4. Wechsle zum Reiter **"Stage"** und füge einen Hero-Baustein hinzu (oberer Banner).
5. Wechsle zum Reiter **"Page builder"** und füge die gewünschten Inhalts-Bausteine hinzu (z. B. Text, Bilder, Team-Liste, …).
6. Wechsle zum Reiter **"Metadata"** und trage einen SEO-Titel und eine kurze Beschreibung ein (das erscheint bei Google).
7. Klicke auf **"Publish"**.

**Englische Version anlegen:** Oben rechts findest du den Bereich **"Translations"**. Klicke auf **"English" → "Create"**. Sanity legt automatisch eine verknüpfte englische Kopie an, in der du den Inhalt übersetzen kannst.

### 5.5 Die Navigation ändern (Menü oben)

1. Klicke im linken Menü auf **"Navigation"**.
2. Wähle die Sprache (in der Regel Deutsch).
3. Du siehst eine Liste von Menü-Einträgen. Du kannst:
   - Neue Einträge hinzufügen (Klick auf "+")
   - Einträge per Drag & Drop sortieren
   - Bestehende Einträge bearbeiten (Klick drauf)
4. Jeder Eintrag hat einen **Titel** (was der Besucher sieht) und ein **Ziel** (welche Seite geöffnet wird).
5. **"Publish"** nicht vergessen.

### 5.6 Einen Blog-Beitrag schreiben

1. Klicke im linken Menü auf **"Blog posts" → "Deutsch"**.
2. Klicke auf **"+"** oben rechts.
3. Fülle aus:
   - **Title** — der Titel des Beitrags
   - **Slug** — wird meist automatisch aus dem Titel erzeugt
   - **Cover image** — Hauptbild (mit Alt-Text!)
   - **Excerpt** — kurzer Anrisstext für die Übersicht
   - **Body** — der Fliesstext. Hier kannst du formatieren, Bilder einfügen, Zitate machen etc.
   - **Author** — wähle eine Person aus (oder lege eine neue an unter "People")
   - **Published at** — Veröffentlichungsdatum
4. Fülle den Reiter **"Metadata"** aus (SEO-Titel + Beschreibung).
5. Klicke **"Publish"**.

### 5.7 Ein Angebot (Kurs) bearbeiten

1. Klicke im linken Menü auf **"Offerings" → "Deutsch"**.
2. Wähle das Angebot aus, das du bearbeiten willst — oder lege ein neues an.
3. Fülle Titel, Beschreibung, Bilder, Preis, Zielgruppe etc. aus.
4. Speichern ist automatisch. **"Publish"** nicht vergessen.

### 5.8 Einen Termin im Stundenplan eintragen

1. Klicke auf **"Schedule" → "Deutsch"**.
2. Klicke auf **"+"** für einen neuen Termin.
3. Trage Wochentag, Uhrzeit, Kurs, Raum, Lehrer:in ein.
4. **"Publish"**.

### 5.9 Ein Testimonial hinzufügen

1. Klicke auf **"Testimonials" → "Deutsch"**.
2. Klicke auf **"+"**.
3. Trage Zitat, Person (aus "People" wählen) und optional ein Foto ein.
4. **"Publish"**.

### 5.10 Nachrichten aus dem Kontaktformular ansehen

1. Klicke im linken Menü auf **"Contact submissions"**.
2. Du siehst alle eingegangenen Nachrichten, neueste zuerst.
3. Diese Einträge sind **nur zum Lesen** — du kannst sie nicht bearbeiten (das ist Absicht, damit nichts versehentlich geändert wird).

Zusätzlich bekommst du **jede neue Nachricht per E-Mail** an: [z. B. info@creators-school.de]

### 5.11 Newsletter-Anmeldungen einsehen

1. Klicke im linken Menü auf **"Newsletter subscribers"**.
2. Du siehst alle E-Mail-Adressen, die sich angemeldet haben — mit Datum.
3. Um einen Newsletter zu verschicken, exportiere die Liste und importiere sie in dein Newsletter-Tool (z. B. Mailchimp, Brevo, CleverReach).

---

## 6. Kleiner Sprach-Hinweis

- Wenn du auf Deutsch schreibst, bearbeite nur die deutsche Version.
- Wenn du auf Englisch schreibst, bearbeite nur die englische Version.
- Beide Versionen sind **verknüpft**, aber der Text wird **nicht automatisch übersetzt** — du (oder ein Übersetzer) müsst das manuell tun.
- Neue Seite nur auf Deutsch nötig? Kein Problem — die englische Version ist optional. Ohne englische Version ist die Seite unter `/en/...` einfach nicht sichtbar.

---

## 7. Was tun, wenn etwas nicht funktioniert?

### Die Website ist offline / lädt nicht
→ Prüfe: [https://www.vercel-status.com](https://www.vercel-status.com). Wenn dort etwas rot ist, ist es ein Vercel-Problem, das sich von selbst löst.
→ Wenn Vercel grün ist, aber deine Seite trotzdem nicht lädt: **[NAME DEINES ENTWICKLERS]** kontaktieren.

### Ich habe etwas versehentlich gelöscht
→ Im Studio: klicke auf die betroffene Seite. Oben rechts findest du **"History"** — dort kannst du frühere Versionen wiederherstellen.

### Meine Änderungen erscheinen nicht auf der Website
→ Hast du **"Publish"** geklickt? Der graue Button "Save" reicht nicht.
→ Warte 30 Sekunden und lade die Seite mit **Strg+F5** (Windows) oder **Cmd+Shift+R** (Mac) neu — das umgeht den Browser-Cache.

### Das Kontaktformular schickt keine E-Mails
→ **[NAME DEINES ENTWICKLERS]** kontaktieren — das ist ein technisches Problem mit Resend.

### Ich brauche eine neue Funktion
→ **[NAME DEINES ENTWICKLERS]** kontaktieren mit einer Beschreibung, was du dir vorstellst.

---

## 8. Kontakt bei Fragen

**Technischer Support:**
- Name: [DEIN NAME]
- E-Mail: [DEINE E-MAIL]
- Telefon: [DEINE NUMMER]
- Verfügbar: [z. B. Mo–Fr, 9–18 Uhr]

**Notfall (Website offline):**
- [NAME + KONTAKT]

---

*Viel Spass beim Redigieren!*
