# Clean Modular Architecture Mapping

This document maps BinBuddy's Next.js folder structure to classical software design patterns (MVC, Clean Architecture) as requested by the architectural reference:

## Architectural Mappings

| Design Layer | Project Location | Purpose & Responsibility |
|---|---|---|
| **Models / Schemas** | [schema.tsx](file:///c:/Users/User/binbuddy_web/app/(auth)/_components/schema.tsx) | Data layout shape definitions and input validation schemas using Zod. |
| **API Layer / Repositories** | [lib/api/](file:///c:/Users/User/binbuddy_web/lib/api) | Data source connections and raw HTTP query wrappers (axios-instance, endpoints). |
| **Use Cases / Controllers** | [lib/actions/](file:///c:/Users/User/binbuddy_web/lib/actions) | Business logic workflows, session cookie persistence, and server actions (`use server`). |
| **State Management** | [app/context/](file:///c:/Users/User/binbuddy_web/app/context) | React Context providers managing authentication and globally shared state. |
| **Widgets / Common Components** | [app/_components/](file:///c:/Users/User/binbuddy_web/app/_components) | Reusable layout parts, buttons, cards, and input fields. |
| **Constants & Configs** | [lib/constants/](file:///c:/Users/User/binbuddy_web/lib/constants) | Static site values, endpoints mapping, and theme variables. |
| **Helpers & Utilities** | [lib/helpers/](file:///c:/Users/User/binbuddy_web/lib/helpers) | Independent text formatting, date parsing, and math helpers. |
| **Error Handling** | [lib/errors/](file:///c:/Users/User/binbuddy_web/lib/errors) | Global API error parsers and feedback translators. |

---

*This architecture ensures separation of concerns, scalability, and robust maintainability.*
