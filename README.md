# @wxn0brp/falcon-frame-lang

A localization middleware for the FalconFrame framework that enables multi-language support for web applications.

## Overview

This package provides easy-to-use internationalization (i18n) functionality for FalconFrame applications. It allows developers to create multi-language websites by automatically translating content based on user preferences and language files.

## Features

- **Automatic Language Detection**: Detects user"s language preference from cookies or the `Accept-Language` header
- **HTML Translation**: Translates HTML content by finding and replacing translation keys
- **Flexible Configuration**: Customizable directory paths and translation patterns
- **Caching**: Includes caching mechanism to improve performance
- **Attribute-based Translations**: Supports translation via HTML attributes as well as content

## Installation

```bash
yarn add github:wxn0brP/FalconFrame-lang#dist
```

## Usage

### Basic Setup

```typescript
import { createLangRouter } from "@wxn0brp/falcon-frame-lang";

const config = {
    meta: {
        "home": { title: "Home Page" },
        "about": { title: "About Us" }
    },
    dir: "public",                // Directory containing HTML files (default: "public")
    layout: "public/layout.html", // Layout file path (default: "public/layout.html")
    langDir: "public/lang",       // Directory containing language JSON files (default: "public/lang")
    getSpecific: (name: string) => {
        // Return specific data for the given page name
        return {};
    }
};

const langRouter = createLangRouter(config);
```

### Language Files

Create language files in the `langDir` (by default `public/lang/`) with the format `{langCode}.json`:

```json
{
    "about us": "About Us",
    "contact": "Contact",
    "image_alt_text": "Image Alt Text",
    "welcome": "Welcome to our website"
}
```

### Translating HTML

The middleware translates HTML in three ways:

1. **Content-based translation**: Text content inside HTML tags
   ```html
   <h1 translate="about us"></h1>  <!-- Will be translated to "About Us" -->
   ```

2. **Attribute-based translation**: Using `translate-*` attributes
   ```html
   <input type="text" translate-placeholder="contact us" /> <!-- Will add translated placeholder attribute -->
   <img src="image.jpg" translate-alt="image_alt_text">  <!-- Will translate the alt attribute -->
   ```

3. **Translate attribute**: Using the `translate` attribute for direct element translation
   ```html
   <h1 translate="welcome"></h1>  <!-- Will translate the content to "Welcome to our website" -->
   <button translate="contact"></button>  <!-- Will translate the content to "Contact" -->
   ```

### Language Detection

The package detects the user"s preferred language in the following order:
1. `lang` query parameter
2. `lang` cookie value
3. `Accept-Language` header from the request
4. Defaults to "en" if no language is detected

## Dependencies

- `@wxn0brp/ac`: For caching functionality
- `@wxn0brp/falcon-frame`: The main FalconFrame framework

## Performance & Caching

The middleware uses an efficient caching mechanism to improve performance. Language files are loaded once and cached in memory to prevent repeated file system operations. This results in faster response times for subsequent requests requiring the same language translations.

## License

MIT License.