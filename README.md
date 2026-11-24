# Healthcare IT & Medical Systems Lab — v2.0

**[Open the live Healthcare IT Lab →](https://marcobrandt.github.io/Healthcare-IT-Lab/)**

Independent professional portfolio by Marco Brandt, software specialist working with healthcare information systems. The project demonstrates clinical interoperability, imaging workflows, troubleshooting, operational resilience and systems engineering in a fictional healthcare environment.

## Interactive modules

| Core lab | Advanced engineering |
| --- | --- |
| Overview | System architecture |
| Imaging workflow | DICOM network lab |
| HL7 message lab | MWL query lab |
| DICOM explorer | HL7 ACK & mapping |
| Troubleshooting (8 scenarios) | FHIR R4 resource lab |
| Medical device security | Study reconciliation |
| Operations dashboard | Incident command |
| Process development | Risk register |
| | Capacity & monitoring |
| | Knowledge base |

### Version 2.0
- 18 modules, including 10 advanced modules.
- DICOM association and verification simulations, exact-match worklist queries, HL7 acknowledgement examples and FHIR JSON inspection.
- Study reconciliation, five-phase incident exercise, editable risk register with CSV export, and deterministic backlog modelling.
- Downloadable simulation traces and decision logs, searchable technical references, responsive interface, and session-level module progress.
- Built-in deterministic checks: run `healthcareLabSelfTest()` in the browser console.

## Scope and limitations

All data and endpoints are synthetic. No real clinical connections, patient information, production architecture, diagnostic advice or employer endorsement. The application does not implement network protocols or formally validate HL7, FHIR or DICOM conformance. Simulations, sample identifiers and risk scores are educational only. Session state resets on reload. No data is sent to a server by the application; external reference links are optional.

## Run locally

Open `index.html` alongside `advanced.js` and `advanced.css` in a modern browser. No dependencies, build step, API keys or backend are required. GitHub Pages serves the root directory from the main branch.

## References
- [DICOM standard](https://www.dicomstandard.org/current)
- [HL7 standards](https://www.hl7.org/implement/standards/)
- [FHIR R4](https://hl7.org/fhir/R4/)

[Cybersecurity portfolio](https://marcobrandt.github.io/Linux-Course/)
