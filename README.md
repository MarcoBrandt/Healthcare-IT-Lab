# Healthcare IT & Medical Systems Lab — v3.0

**[Open the live Healthcare IT Lab →](https://marcobrandt.github.io/Healthcare-IT-Lab/)**

Independent professional portfolio by Marco Brandt, software specialist working with healthcare information systems. The project demonstrates clinical interoperability, imaging workflows, troubleshooting, operational resilience and systems engineering in a fictional healthcare environment.

## Interactive modules

| ID | Core lab | ID | Advanced engineering |
| --- | --- | --- | --- |
| 00 | Overview | 08 | System architecture |
| 01 | Imaging workflow | 09 | DICOM network lab |
| 02 | HL7 message lab | 10 | MWL query lab |
| 03 | DICOM explorer | 11 | HL7 ACK & mapping |
| 04 | Troubleshooting (8 scenarios) | 12 | FHIR R4 resource lab |
| 05 | Medical device security | 13 | Study reconciliation |
| 06 | Operations dashboard | 14 | Incident command |
| 07 | Process development | 15 | Risk register |
|  |  | 16 | Capacity & monitoring |
|  |  | 17 | Knowledge base |

### Version 3.0 — Clinical edition
- Apple-inspired bento overview and light clinical workspace.
- Interactive 3D-projected hospital cutaway with four selectable departments, rotation, zoom, reset and top-down floor plan. Built from local SVG geometry; no external 3D library.
- Room-specific shortcuts to all 17 learning exercises, searchable module catalogue and the same interactive model in System Architecture.
- Preserves all 18 existing numbered modules and adds seven deterministic geometry and navigation checks.

### Version 2.1
- Consistent module numbering (00–17) in navigation, module headings and overview cards.

### Version 2.0
- 18 modules, including 10 advanced modules.
- DICOM association and verification simulations, exact-match worklist queries, HL7 acknowledgement examples and FHIR JSON inspection.
- Study reconciliation, five-phase incident exercise, editable risk register with CSV export, and deterministic backlog modelling.
- Downloadable simulation traces and decision logs, searchable technical references, responsive interface, and session-level module progress.
- Built-in deterministic checks: run `healthcareLabSelfTest()` in the browser console.

## Scope and limitations

All data and endpoints are synthetic. No real clinical connections, patient information, production architecture, diagnostic advice or employer endorsement. The application does not implement network protocols or formally validate HL7, FHIR or DICOM conformance. Simulations, sample identifiers and risk scores are educational only. Session state resets on reload. No data is sent to a server by the application; external reference links are optional.

## Run locally

Open `index.html` alongside `advanced.js`, `advanced.css`, `hospital.js` and `clinical.css` in a modern browser. No dependencies, build step, API keys or backend are required. GitHub Pages serves the root directory from the main branch.

## References
- [DICOM standard](https://www.dicomstandard.org/current)
- [HL7 standards](https://www.hl7.org/implement/standards/)
- [FHIR R4](https://hl7.org/fhir/R4/)

[Cybersecurity portfolio](https://marcobrandt.github.io/Linux-Course/)
