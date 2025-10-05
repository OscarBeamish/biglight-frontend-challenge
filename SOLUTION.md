# My Approach

*Oscar Beamish - 5TH October 2025*

## The Problem

Account managers need to update landing pages daily without developer help.

## The Solution

**Google Sheets → Node build script → Static HTML/CSS**

Account managers edit spreadsheets (which they already know), build script generates production-ready HTML.

### Why Google Sheets?

- They already use it
- Real-time collaboration + version history
- Built-in validation (dropdowns, rules)
- Has an API
- Free

## Data Structure

Three relational sheets to handle complexity:

**Modules** (page sections):
```
module_id | layout | order | active
module_1  | two-column | 1 | TRUE
```

**Blocks** (content within modules):
```
block_id | module_id | desktop_image | mobile_image | hover_effect | overlay_text | overlay_position
block_1  | module_1  | img1.jpg | img1-m.jpg | slideshow | Jumper £8 | top-right
```

**CTAs** (multiple per block):
```
cta_id | block_id | text | link | order
cta_1  | block_1  | Shop Girls | /girls | 1
cta_2  | block_1  | Shop Boys | /boys | 2
```

Why relational? Some blocks have 1 CTA, some have 3. Some have slideshows, some don't. This handles variability cleanly.

## Tech Stack

- **Node.js** - Build script
- **Handlebars** - Templates (logic-less, easier to maintain than Pug)
- **SCSS** - Styles with BEM naming
- **Vanilla JS** - Slideshows

BEM naming prevents clashes when modules move around. `.module__container` and `.block__image--zoom` are self-documenting.

## How It Works

Build script:
1. Fetches data from Google Sheets (or JSON for demo)
2. Joins datasets (modules → blocks → CTAs)
3. Sorts by order, filters inactive items
4. Runs through Handlebars templates
5. Compiles SCSS → static HTML/CSS


## Salesforce Commerce Cloud Integration

This works seamlessly with SFCC (Demandware):

- Generated HTML uploads as content assets
- CSS/JS go into static resources
- Can generate ISML templates instead of plain HTML
- Deploy via WebDAV or Business Manager

Account managers edit Sheets, never touch Demandware. Fast updates without dev bottleneck.

## Scalability

**Adding module types:**
1. Create template + SCSS file
2. Add to Sheet dropdown
Done. No changes to existing modules.

**Adding fields:**
1. Add column to Sheet
2. Update template

## The Demo

Built with JSON files representing Sheet exports. Includes:
- Multiple layouts (2-col, 3-col, full-width)
- Varying CTA counts
- Slideshows and zoom effects
- Positioned overlays

No Google API setup needed to test.