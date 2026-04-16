#– Angular Login & Dashboard

Im Rahmen dieses Projekts wurde eine funktionale Angular-Basisanwendung entwickelt. Das Ziel der Umsetzung bestand darin, eine saubere, moderne Architektur mit Authentifizierung sowie einen internen Bereich bereitzustellen. 
##  Lokale Umgebung

Die Anwendung kann über die Angular CLI gestartet werden:

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Entwicklungsserver starten
npm start
```
Nach dem Start ist die App unter **http://localhost:4200** erreichbar.

###  Test-Accounts (Demo)
Da noch keine echte Backend-Anbindung existiert, wurden zwei Accounts hardcodiert. Für den Test des Logins können folgende Daten verwendet werden:

| Benutzername | Passwort   | Sichtbare Bereiche |
|---|---|---|
| `admin`      | `admin123` | Vollständiger Zugriff (inkl. Admin-Bereich) |
| `user`       | `user123`  | Dashboard, Profil & Einstellungen |

---

##  Projektstruktur

Die Architektur wurde logisch getrennt, um eine schnelle Einarbeitung zu ermöglichen:

* `src/app/core/` -> Beinhaltet die globale Logik und Typen.
  * `services/` -> Hier werden Services wie `auth.service.ts` (Login-Logik) und `theme.service.ts` (Dark Mode Steuerung) verwaltet.
  * `guards/` -> Die Routenabsicherung wurde über funktionale Guards (`authGuard` und `adminGuard`) umgesetzt.
* `src/app/features/` -> Hier sind die jeweiligen Hauptseiten gekapselt.
  * `login/` -> Beinhaltet die Login-Komponente.
  * `main/` -> Umfasst das Layout (Sidenav + Topbar) und die Sub-Routen (Dashboard, Profil, Einstellungen, Admin).

##  Integrierte Features

Folgende Kernfunktionen und Zusatz-Features wurden implementiert:

- **Sicheres Routing:** Die `/main`-Routen können nur im eingeloggten Zustand aufgerufen werden. 
- **Formular-Validierung:** Für Login und Profil wurde `ReactiveFormsModule` verwendet. Pflichtfelder und Mindestlängen (z.B. Passwort) werden geprüft.
- **Rollenkonzept:** Bestimmte Einträge, wie der "Admin-Bereich", werden nur gerendert, wenn die Rolle des Benutzers ausreicht.
- **Echter Dark Mode:** Ein Theme-Switching wurde über Angular Material und CSS Custom Properties eingebaut. 
- **Persistenz:** Durch die Nutzung von lokaler Speicherung (`localStorage`) gehen der Login-Status und die Theme-Auswahl bei einem Seiten-Reload nicht verloren.
- **Responsives Design:** Auf mobilen Endgeräten wird die Sidenav automatisch als Overlay (`over`-Mode) dargestellt und schließt sich bei Interaktion.
- **Unit-Tests:** Für die Guards und Services wurden Unit-Tests geschrieben. Als Test-Runner wurde **Vitest** etabliert (`npm test`).

##  Verwendete Angular-Technologien

Um modernen Best-Practices zu folgen, wurden folgende Konzepte angewendet:

- **Standalone Components:** Das gesamte Projekt wurde komponenten-basiert und ohne traditionelle `NgModules` aufgebaut.
- **Signals:** Für das State-Management (z.B. aktueller Benutzer, Dark-Mode-Status) wurden Angular Signals verwendet, wodurch auf kompexe RxJS-Konstrukte verzichtet werden konnte.
- **Dependency Injection:** Abhängigkeiten wurden konsequent über die `inject()`-Funktion injiziert, um die Konstruktoren übersichtlich zu halten.
- **Lazy Loading:** Die einzelnen Feature-Bereiche im internen Bereich werden asynchron nachgeladen (Lazy Loading über `app.routes.ts`).
