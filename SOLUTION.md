# My Approach

*Oscar Beamish - 5th October 2025*

## The Problem

Account managers need to update landing pages daily without developer help. Looking at the George at ASDA site, they're dealing with:
- Variable row layouts (full-width, 2-col, 3-col)
- Multiple CTAs per block
- Interactive elements (zoom, slideshows)
- Positioned overlays

## The Solution

**Google Sheets → Node build script → Static HTML/CSS**

Account managers edit spreadsheets (which they already know), build script generates production-ready HTML.

### Why This Approach?

**Sustainable:**
- No CMS licensing costs or maintenance overhead
- Static output = fast, secure, easy to host
- Version control on templates and build script

**Maintainable:**
- Clear separation: data (Sheets) vs presentation (templates)
- BEM methodology keeps CSS modular and predictable
- Adding new module types doesn't break existing ones

**Agile:**
- Account managers update content instantly without dev tickets
- Changes live in ~30 seconds with automated deployment
- Easy to A/B test (duplicate sheets or use variant flags)

## Tech Stack & Why

**Google Sheets as CMS:**
- They (should) already use it
- Real-time collaboration + built-in version history
- Data validation (dropdowns, URL validation, conditional formatting)
- Free API access

**Node.js build script:**
- Fast processing (~2 seconds)
- Easy to extend with additional data sources
- Can run locally or via CI/CD (GitHub Actions)

**Handlebars templates:**
- Logic-less = safer, easier to maintain
- Looks like HTML (familiar to any dev)
- Partials enable component reuse

**SCSS with BEM:**
- Modular styles that don't clash
- Self-documenting (`.block__image--zoom` is obvious)
- Easy to add new components without side effects

**Vanilla JS:**
- No framework overhead for simple interactions
- Slideshow is 2KB, no dependencies

## How Structured Input Fits

Three relational sheets handle the George at ASDA complexity:

**Modules** (page sections):
```
module_id | layout      | order | active
module_1  | two-column  | 1     | TRUE
module_2  | full-width  | 2     | TRUE
```

**Blocks** (content within modules):
```
block_id | module_id | desktop_image | mobile_image | hover_effect | overlay_text | overlay_position
block_1  | module_1  | img1.jpg      | img1-m.jpg   | slideshow    | Jumper £8    | top-right
```

**CTAs** (multiple per block):
```
cta_id | block_id | text       | link   | order
cta_1  | block_1  | Shop Girls | /girls | 1
cta_2  | block_1  | Shop Boys  | /boys  | 2
```

### Why Relational?

Some blocks have 1 CTA, some have 3. Some have slideshows, some don't. Flat structure would mean empty columns and messy data. Relational structure handles variability cleanly.

### Workflow

1. Account manager updates Google Sheet
2. Build script fetches via Google Sheets API (or manual trigger)
3. Joins the three datasets:
4. Handlebars renders nested structure to HTML
5. SCSS compiles to CSS
6. Static files deploy to host

### Where It Lives

- **Google Sheets:** Source of truth (account managers own this)
- **GitHub:** Build script, templates, styles (version controlled)
- **CI/CD:** GitHub Actions watches for Sheet changes, triggers build
- **Hosting:** Netlify/Vercel for static site OR Salesforce Commerce Cloud


## Salesforce Commerce Cloud Integration

This integrates cleanly with SFCC:

- Generated HTML uploads as content assets
- CSS/JS go into static resources
- Can generate ISML templates instead of plain HTML if needed

Account managers edit Sheets, never touch Demandware. Removes dev bottleneck for content updates.


**Demo uses JSON files** (representing Sheet exports) to avoid Google API setup complexity. Same data structure, same build process.
