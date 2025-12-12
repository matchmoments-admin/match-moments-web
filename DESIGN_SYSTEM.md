# Match Moments Design System

This document contains the complete design system for Match Moments, featuring a minimal black and white aesthetic with clean typography.

## Table of Contents
1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Colors](#colors)
4. [Spacing](#spacing)
5. [Components](#components)
6. [Layout](#layout)
7. [CSS/Tailwind Mappings](#csstailwind-mappings)

---

## Design Tokens

### Base Unit
- **Base Unit**: 4px (implied from spacing patterns)
- **Spacing Scale**: Multiples of 4px (4, 8, 12, 16, 20, 24, 30, 32, etc.)

---

## Typography

### Font Family
- **Primary Font**: `europa, sans-serif`
- **Fallback**: `sans-serif`

**Note**: Europa is a commercial font. For implementation, we'll use a similar geometric sans-serif font like:
- Inter (Google Fonts)
- Work Sans (Google Fonts)
- Or purchase Europa font license

### Type Scale

| Element | Font Size | Font Weight | Line Height | Usage |
|---------|-----------|-------------|-------------|-------|
| H1 (Article Title) | 60px | 700 (Bold) | 72px | Main article headlines |
| H1 (Category Page) | 60px | 700 (Bold) | 72px | Category page titles |
| H2 (Large) | 30px | 700 (Bold) | ~36px | Section headings, featured articles |
| H2 (Card) | 12px | 300 (Light) | 14px | Small card headings (varies) |
| H3 | 26px | 700 (Bold) | ~32px | Subsection headings |
| H4 | 24px | 700 (Bold) | ~28px | Card titles, smaller headings |
| H4 (Small) | 12px | 300 (Light) | 14px | Small card titles |
| Body (Large) | 20px | 300 (Light) | 32px | Main body text |
| Body (Standard) | 16px | 300 (Light) | 20px | Article content, descriptions |
| Category Link | 24px | 700 (Bold) | ~28px | Category badges |
| Meta/Date | 20px | 400 (Regular) | ~24px | Article metadata |
| Small Text | 12px-14px | 300-400 | ~16px | Captions, labels |

### Font Weights
- **300**: Light (body text)
- **400**: Regular (meta, links)
- **700**: Bold (headings, category links)

### Line Heights
- **Tight**: 1.0-1.2 (headings)
- **Normal**: 1.4-1.6 (body text)
- **Relaxed**: 1.6+ (large body text)

---

## Colors

### Primary Colors
- **Background**: `#FFFFFF` (rgb(255, 255, 255))
- **Text**: `#000000` (rgb(0, 0, 0))
- **Links**: `#000000` (rgb(0, 0, 0))

### Color Palette
Match Moments uses a minimal black and white color scheme with:
- Pure white backgrounds
- Pure black text
- No accent colors (monochromatic design)
- Images provide color accents

### CSS Variables (Recommended)
```css
:root {
  --color-background: #FFFFFF;
  --color-text: #000000;
  --color-link: #000000;
  --color-link-hover: #000000; /* May have slight opacity on hover */
}
```

---

## Spacing

### Container
- **Max Width**: 1140px
- **Padding**: 0px 8px (horizontal)
- **Margin**: 0px auto (centered)

### Article Content
- **Max Width**: 1140px
- **Padding**: 0px 8px
- **Margin**: 0px 30px (horizontal)

### Spacing Scale
Based on observed spacing:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px
- **3xl**: 30px
- **4xl**: 32px
- **5xl**: 40px
- **6xl**: 48px

### Grid Gaps
- **Article Grid Gap**: ~20-30px (varies by layout)
- **Card Internal Padding**: ~16-24px

---

## Components

### Navigation/Header

**Structure:**
- Logo: "Match Moments" text, left-aligned
- Menu toggle: "Read" button/link
- Search icon: Right side

**Styling:**
- Background: White
- Border: Bottom border (if any)
- Height: ~64-80px
- Font: 20px, weight 400-700

**Tailwind Classes:**
```html
<header class="sticky top-0 z-50 w-full bg-white border-b border-black/10">
  <div class="mx-auto max-w-[1140px] px-2">
    <!-- Header content -->
  </div>
</header>
```

### Article Cards

**Variants:**

#### 1. Featured/Large Card
- **Image**: Full-width, aspect ratio ~16:9 or 4:3
- **Category Badge**: Above image, 24px, bold
- **Title**: H2 (30px) or H4 (24px), bold
- **Description**: 16px, light, 1-2 lines
- **Spacing**: Generous padding, large gaps

#### 2. Standard Card
- **Image**: Smaller, aspect ratio maintained
- **Category**: 24px, bold
- **Title**: H4 (24px) or smaller, bold
- **Description**: 16px, light
- **Spacing**: Moderate padding

#### 3. Small/Popular Card
- **Image**: Thumbnail size
- **Category**: Small text (12-14px)
- **Title**: Smaller heading
- **No description** (or very short)

**Common Styles:**
- No border radius (sharp corners)
- No shadows (flat design)
- Images are clickable
- Entire card is clickable
- Hover: Subtle opacity change or underline

**Tailwind Classes:**
```html
<article class="group cursor-pointer">
  <a href="...">
    <img src="..." alt="..." class="w-full object-cover" />
    <div class="mt-4">
      <span class="text-2xl font-bold">Category</span>
      <h2 class="text-3xl font-bold mt-2">Title</h2>
      <p class="text-base font-light mt-2">Description</p>
    </div>
  </a>
</article>
```

### Buttons

**Styles:**
- Minimal styling
- Text-based (no heavy borders)
- Underline on hover (if any)
- Font: 20px, weight 400-700
- No background colors (text only)

### Links

**Default:**
- Color: Black (#000000)
- Text decoration: None
- Font: Inherits from parent
- Hover: Underline or opacity change

### Footer

**Structure:**
- Newsletter signup section
- About/Contact links
- Social media links
- Copyright notice

**Styling:**
- Background: White or light gray
- Text: Black
- Links: Black, underline on hover
- Sections: Organized in columns

---

## Layout

### Grid System

#### Homepage Layout
1. **Hero Section**: Featured article(s), full-width
2. **Featured Articles**: 2-3 column grid
3. **Regular Articles**: 2-3 column grid
4. **Popular Section**: Horizontal scroll or grid
5. **Recent Articles**: 3 column grid

#### Category/List Page Layout
- Page title (H1): 60px, bold
- Article grid: 2-3 columns
- Consistent card styling

#### Article Page Layout
- Title (H1): 60px, bold, margin-bottom: 30px
- Featured image: Full-width
- Meta: Date, author, share buttons
- Content: Max-width 1140px, centered
- Body text: 16px, light, line-height 20px

### Breakpoints

Based on container width and responsive behavior:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1140px (container max-width)

---

## CSS/Tailwind Mappings

### Typography

```css
/* H1 - Article Title */
.text-6xl { font-size: 60px; }
.font-bold { font-weight: 700; }
.leading-[72px] { line-height: 72px; }

/* H2 - Section Headings */
.text-3xl { font-size: 30px; }

/* H4 - Card Titles */
.text-2xl { font-size: 24px; }

/* Body Large */
.text-xl { font-size: 20px; }
.font-light { font-weight: 300; }
.leading-8 { line-height: 32px; }

/* Body Standard */
.text-base { font-size: 16px; }
.leading-5 { line-height: 20px; }

/* Category Links */
.text-2xl { font-size: 24px; }
.font-bold { font-weight: 700; }
```

### Colors

```css
.bg-white { background-color: #FFFFFF; }
.text-black { color: #000000; }
```

### Spacing

```css
.max-w-[1140px] { max-width: 1140px; }
.px-2 { padding-left: 8px; padding-right: 8px; }
.mx-auto { margin-left: auto; margin-right: auto; }
```

### Container

```html
<div class="mx-auto max-w-[1140px] px-2">
  <!-- Content -->
</div>
```

---

## Component Examples

### Article Card (Featured)

```tsx
<article className="group cursor-pointer">
  <Link href="/article">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover group-hover:opacity-90 transition-opacity"
      />
    </div>
    <div className="mt-4">
      <Link
        href={`/category/${category}`}
        className="text-2xl font-bold hover:underline"
      >
        {category}
      </Link>
      <h2 className="text-3xl font-bold mt-2 group-hover:underline">
        {title}
      </h2>
      <p className="text-base font-light mt-2 text-black/80">
        {description}
      </p>
    </div>
  </Link>
</article>
```

### Article Card (Standard)

```tsx
<article className="group cursor-pointer">
  <Link href="/article">
    <div className="relative aspect-[4/3] overflow-hidden mb-4">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
      />
    </div>
    <Link
      href={`/category/${category}`}
      className="text-2xl font-bold hover:underline"
    >
      {category}
    </Link>
    <h4 className="text-2xl font-bold mt-2 group-hover:underline">
      {title}
    </h4>
    <p className="text-base font-light mt-2 text-black/80">
      {description}
    </p>
  </Link>
</article>
```

### Navigation

```tsx
<header className="sticky top-0 z-50 w-full bg-white border-b border-black/10">
  <div className="mx-auto max-w-[1140px] px-2">
    <div className="flex items-center justify-between h-16">
      <Link href="/" className="text-xl font-bold">
        Match Moments
      </Link>
      <nav className="flex items-center gap-4">
        <button className="text-xl">Read</button>
        <button className="text-xl">Search</button>
      </nav>
    </div>
  </div>
</header>
```

---

## Implementation Notes

1. **Font**: Use Inter or Work Sans from Google Fonts as Europa alternative
2. **Images**: All images should maintain aspect ratios, use Next.js Image component
3. **Links**: All text links should be black, no underlines by default
4. **Hover States**: Subtle opacity changes or underlines
5. **No Shadows**: Flat design, no box shadows
6. **No Border Radius**: Sharp corners (except images may have slight radius)
7. **Spacing**: Generous whitespace, clean layouts
8. **Typography**: Heavy use of light font weights (300) for body text
9. **Bold Headings**: All headings use bold (700) weight
10. **Container**: Always center content with max-width 1140px

---

## Accessibility

- Ensure sufficient color contrast (black on white = 21:1, excellent)
- Use semantic HTML (article, header, nav, main, footer)
- Provide alt text for all images
- Maintain focus states for keyboard navigation
- Use proper heading hierarchy (h1 → h2 → h3, etc.)

---

## Responsive Design

- Mobile: Single column, stacked layout
- Tablet: 2 columns for article grids
- Desktop: 3 columns for article grids
- Large Desktop: Maintain 3 columns, content centered

---

*Last Updated: December 12, 2025*

