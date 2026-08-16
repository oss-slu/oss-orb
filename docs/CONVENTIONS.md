# Conventions/Standards

## Naming conventions 
- ### Variable naming, applies throughout
    - Global constants: **UPPER_SNAKE_CASE**
    - All other: **camelCase**
- ### Typescript (.ts)
    - Files: **camelCase**
    - Functions: **camelCase**
    - Types/interfaces: **camelCase**
    - Classes: **PascalCase**
- ### React (.tsx)
    - Files: **PascalCase**
    - Component definition functions: **PascalCase**
    - Non-component functions: **camelCase**

## Indentation
- Lines should be indented with 4 spaces

## Language/framework specifics
- ### React
    - .tsx files should export only one component definition function
    - Components' types should be defined elsewhere and imported
- ### Typescript
    - Aim to type everything
        - The `any` type should be used as sparingly as possible