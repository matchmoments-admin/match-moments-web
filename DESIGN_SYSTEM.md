# Match Moments Design System
## Based on The Ringer Design

This document contains the complete design system extracted from The Ringer website (theringer.com), adapted for Match Moments sports website. The design features a clean, modern aesthetic with GT America typography and a sophisticated black and white color palette.

## Table of Contents
1. [Design Tokens](#design-tokens)
2. [Typography](#typography)
3. [Colors](#colors)
4. [Spacing](#spacing)
5. [Components](#components)
6. [Layout](#layout)
7. [CSS/Tailwind Mappings](#csstailwind-mappings)
8. [Motion & Transitions](#motion--transitions)

---

## Design Tokens

### Base Unit
- **Base Unit**: 4px (implied from spacing patterns)
- **Spacing Scale**: Multiples of 4px (4, 8, 12, 16, 20, 24, 32, 48, 64, 96px)
- **Border Radius**: 0.5rem (8px) default, 16px (cards), 32px (large cards)

### CSS Variables (Root Level)
```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 0 0% 0%/20%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
  
  /* Typography */
  --font-gt-america: '__gtAmerica_ce3cd8', '__gtAmerica_Fallback_ce3cd8', 'GT America', sans-serif;
  --font-gt-america-expanded: '__gtAmericaExpanded_999689', '__gtAmericaExpanded_Fallback_999689', 'GT America Expanded', sans-serif;
  --font-bradford: '__bradford_82a743', '__bradford_Fallback_82a743', 'Bradford', serif;
  --font-flood: "flood-std", sans-serif;
  
  /* Text Size Modifier */
  --text-size-modifier: 1;
}
```

---

## Typography

### Font Family

**Primary Font**: GT America
- **Font Stack**: `var(--font-gt-america)` or `'GT America', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Fallback**: System sans-serif stack

**Note**: GT America is a commercial font. For implementation without licensing:
- **Alternative**: Inter (Google Fonts) - closest match
- **Alternative**: Work Sans (Google Fonts) - geometric alternative
- **Alternative**: System font stack with `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`

### Type Scale

| Element | Font Size | Font Weight | Line Height | Letter Spacing | Usage |
|---------|-----------|-------------|-------------|----------------|-------|
| H1 (Hero/Article Title) | 56px | 700 (Bold) | 56px | -1.41634px | Main article headlines, hero titles |
| H1 (Category Page) | 56px | 700 (Bold) | 56px | -1.41634px | Category page titles |
| H2 (Section) | 24px | 500 (Medium) | 28.8px | -0.621127px | Section headings |
| H3 (Subsection) | 28px | 700 (Bold) | 33.6px | -0.516056px | Subsection headings, card titles |
| H4 (Small Heading) | 14px | 700 (Bold) | 21px | normal | Small card headings, labels |
| Body (Large) | 32px | 700 (Bold) | 38.4px | -0.552113px | Large body text (hero sections) |
| Body (Standard) | 16px | 400 (Regular) | 24px | normal | Article content, descriptions |
| Body (Article Content) | 16px | 400 (Regular) | 19.2px | normal | Article body text |
| Link/Button | 16px | 400 (Regular) | 24px | normal | Navigation links, buttons |
| Meta/Byline | 16px | 400 (Regular) | 24px | normal | Article metadata, author info |
| Small Text | 12px-14px | 400-700 | 16px-21px | normal | Captions, labels, timestamps |

### Font Weights
- **400**: Regular (body text, links, buttons)
- **500**: Medium (section headings)
- **700**: Bold (headings, category links, emphasis)

### Line Heights
- **Tight**: 1.0 (H1 hero titles)
- **Normal**: 1.2-1.5 (headings)
- **Relaxed**: 1.5-1.6 (body text)

### Letter Spacing
- **Tight**: Negative values for large headings (-1.41634px for 56px)
- **Normal**: Default (0) for body text and smaller headings

---

## Colors

### Primary Colors

| Color | Hex | RGB | HSL | Usage |
|-------|-----|-----|-----|-------|
| Background | `#FFFFFF` | `rgb(255, 255, 255)` | `0 0% 100%` | Page backgrounds |
| Foreground (Text) | `#000000` | `rgb(0, 0, 0)` | `240 10% 3.9%` | Primary text |
| Muted Text | `#696969` | `rgb(105, 105, 105)` | `240 3.8% 46.1%` | Secondary text, metadata |
| Border | `#E5E7EB` | `rgb(229, 231, 235)` | `240 5.9% 90%` | Borders, dividers |

### Semantic Colors

| Semantic | Hex | Usage |
|---------|-----|-------|
| Primary | `#1A1A1A` | Primary actions, headings |
| Secondary | `#F5F5F6` | Secondary backgrounds |
| Muted | `#F5F5F6` | Muted backgrounds |
| Accent | `#F5F5F6` | Accent backgrounds |
| Destructive | `#EF4444` | Error states, destructive actions |

### Color Palette Philosophy
- **Minimal**: Primarily black and white
- **Monochromatic**: No accent colors in UI (images provide color)
- **High Contrast**: Black text on white backgrounds (21:1 ratio)
- **Subtle Grays**: Used sparingly for metadata and secondary information

### CSS Variables Usage
```css
/* Background */
background-color: hsl(var(--background));

/* Text */
color: hsl(var(--foreground));

/* Muted Text */
color: hsl(var(--muted-foreground));

/* Borders */
border-color: hsl(var(--border));
```

---

## Spacing

### Container Widths

| Container Type | Max Width | Padding | Margin |
|---------------|-----------|---------|--------|
| Main Container | 1920px | 0px 32px 96px | 0px auto |
| Article Container | 800px | 0px | 0px auto |
| Content Container | 1904px | 0px | 0px auto |
| Section Container | 50% | 0px | 64px 0px |

### Spacing Scale

Based on 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, icon padding |
| sm | 8px | Small gaps, compact padding |
| md | 12px | Medium gaps |
| lg | 16px | Standard gaps, card padding |
| xl | 20px | Large gaps |
| 2xl | 24px | Section spacing |
| 3xl | 32px | Major section spacing |
| 4xl | 48px | Large section spacing |
| 5xl | 64px | Extra large spacing |
| 6xl | 96px | Hero section spacing |

### Component Spacing

| Component | Padding | Margin | Gap |
|-----------|---------|--------|-----|
| Article Card | 0px | 0px | normal |
| Section | 0px 0px 32px | 0px | normal |
| Header | 0px | 0px | normal |
| Footer | 48px 0px 0px | 0px | normal |

### Grid Gaps
- **Article Grid**: 24px-32px (varies by layout)
- **Card Internal**: 16px-24px
- **Section Gaps**: 32px vertical

---

## Components

### Navigation/Header

**Structure:**
- Logo: Left-aligned, image or text
- Discover Menu: Dropdown button with icon
- Search: Icon button
- Navigation: Videos, Podcasts links
- Menu Toggle: Hamburger menu (mobile)

**Styling:**
- Background: Transparent/White
- Height: 146px (includes navigation menu)
- Border: None (or subtle bottom border)
- Font: 16px, weight 400
- Padding: 0px

**Tailwind Classes:**
```html
<header class="w-full bg-white">
  <div class="flex items-center justify-between h-[146px] px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center">
      <img src="/logo.svg" alt="Match Moments" />
    </a>
    
    <!-- Navigation -->
    <nav class="flex items-center gap-4">
      <a href="/videos" class="text-base font-normal">Videos</a>
      <a href="/podcasts" class="text-base font-normal">Podcasts</a>
      <button class="text-base font-normal">Menu</button>
    </nav>
  </div>
</header>
```

### Article Cards

**Variants:**

#### 1. Featured Hero Card
- **Image**: Full-width, aspect ratio varies
- **Category Badge**: 14px, bold, above image
- **Title**: 28px, bold, line-height 33.6px
- **Meta**: 16px, regular, "By Author • X min read"
- **Border Radius**: 32px
- **Spacing**: Generous padding

#### 2. Standard Article Card
- **Image**: Full-width, aspect ratio maintained
- **Category**: 14px, bold, muted color
- **Title**: 24px, medium (500), line-height 28.8px
- **Meta**: 16px, regular
- **Border Radius**: 32px
- **Spacing**: Standard padding

#### 3. Small List Card
- **Image**: Thumbnail or no image
- **Category**: 14px, bold
- **Title**: 24px, medium
- **Meta**: 16px, regular
- **Border Radius**: 16px or 32px
- **Spacing**: Compact padding

**Common Styles:**
- Border Radius: 32px (large cards), 16px (small cards)
- No shadows (flat design)
- Images are clickable
- Entire card is clickable
- Hover: Subtle opacity change or underline on title

**Tailwind Classes:**
```html
<!-- Featured Card -->
<article class="group cursor-pointer rounded-[32px] overflow-hidden">
  <a href="/article" class="block">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src="..." alt="..." class="w-full h-full object-cover" />
    </div>
    <div class="p-6">
      <span class="text-sm font-bold text-[#696969]">Category</span>
      <h3 class="text-[28px] font-bold leading-[33.6px] mt-2 group-hover:underline">
        Article Title
      </h3>
      <div class="text-base font-normal mt-2 text-[#696969]">
        By Author • 10 min read
      </div>
    </div>
  </a>
</article>

<!-- Standard Card -->
<article class="group cursor-pointer rounded-[32px] overflow-hidden">
  <a href="/article" class="block">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src="..." alt="..." class="w-full h-full object-cover" />
    </div>
    <div class="p-6">
      <span class="text-sm font-bold text-[#696969]">Category</span>
      <h2 class="text-2xl font-medium leading-[28.8px] mt-2 tracking-[-0.621127px] group-hover:underline">
        Article Title
      </h2>
      <div class="text-base font-normal mt-2 text-[#696969]">
        By Author • 10 min read
      </div>
    </div>
  </a>
</article>
```

### Buttons

**Styles:**
- Minimal styling
- Text-based (no heavy borders or backgrounds)
- Font: 16px, weight 400
- Color: Black (#000000)
- Hover: Underline or opacity change
- No background colors (text only)

**Variants:**
- **Default**: Text button, no background
- **Icon Button**: Icon with optional text
- **Link Button**: Styled as link

**Tailwind Classes:**
```html
<button class="text-base font-normal text-black hover:underline">
  Button Text
</button>
```

### Links

**Default:**
- Color: Black (#000000)
- Text decoration: None
- Font: 16px, weight 400, line-height 24px
- Hover: Underline or opacity change

**Tailwind Classes:**
```html
<a href="..." class="text-base font-normal text-black hover:underline">
  Link Text
</a>
```

### Article Page

**Structure:**
- Hero Image: Full-width, with overlay
- Title: 56px, bold, white text on image overlay
- Meta: Author, date, read time
- Content: Article body text
- Related Articles: Grid of related content

**Styling:**
- Title: 56px, bold, line-height 56px, letter-spacing -1.41634px
- Body: 16px, regular, line-height 19.2px
- Max Width: 800px for content
- Padding: 0px (full-width images)

**Tailwind Classes:**
```html
<article>
  <!-- Hero Section -->
  <div class="relative w-full h-[600px]">
    <img src="..." alt="..." class="w-full h-full object-cover" />
    <div class="absolute inset-0 bg-black/40 flex items-end">
      <div class="max-w-[800px] mx-auto px-8 pb-8">
        <h1 class="text-[56px] font-bold leading-[56px] tracking-[-1.41634px] text-white">
          Article Title
        </h1>
        <div class="text-base font-normal text-white/90 mt-4">
          By Author • Dec. 10 • 7 min read
        </div>
      </div>
    </div>
  </div>
  
  <!-- Content -->
  <div class="max-w-[800px] mx-auto px-8 py-12">
    <div class="prose prose-lg">
      <p class="text-base font-normal leading-[19.2px]">
        Article content...
      </p>
    </div>
  </div>
</article>
```

### Footer

**Structure:**
- Newsletter signup section
- About/Contact links
- Social media links
- Copyright notice
- Archive link

**Styling:**
- Background: White
- Text: Black
- Links: Black, underline on hover
- Sections: Organized in columns
- Padding: 48px top

**Tailwind Classes:**
```html
<footer class="w-full bg-white border-t border-[#E5E7EB]">
  <div class="max-w-[1920px] mx-auto px-8 py-12">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Newsletter -->
      <div>
        <h3 class="text-xl font-bold mb-4">Newsletter</h3>
        <p class="text-base font-normal text-[#696969] mb-4">
          Just the hits, straight to your inbox every week
        </p>
        <!-- Form -->
      </div>
      
      <!-- Links -->
      <div>
        <h3 class="text-xl font-bold mb-4">Links</h3>
        <ul class="space-y-2">
          <li><a href="/contact" class="text-base font-normal hover:underline">Contact</a></li>
          <li><a href="/masthead" class="text-base font-normal hover:underline">Masthead</a></li>
        </ul>
      </div>
      
      <!-- Social -->
      <div>
        <h3 class="text-xl font-bold mb-4">Follow Us</h3>
        <div class="flex gap-4">
          <a href="..." class="text-base font-normal hover:underline">Instagram</a>
          <a href="..." class="text-base font-normal hover:underline">Twitter</a>
        </div>
      </div>
    </div>
    
    <div class="mt-12 pt-8 border-t border-[#E5E7EB] text-center text-sm text-[#696969]">
      © 2025 Match Moments
    </div>
  </div>
</footer>
```

---

## Layout

### Grid System

#### Homepage Layout
1. **Hero Carousel**: Full-width, featured articles with navigation
2. **The Latest Section**: Grid of 4 articles (2x2 or 4x1)
3. **Featured Section**: Large featured article + sidebar
4. **Noteworthy Reads**: List of article links
5. **Category Sections**: Themed content sections (NBA, NFL, etc.)
6. **Podcast Section**: Podcast cards with play buttons
7. **Video Section**: Video thumbnails with metadata

#### Category/List Page Layout
- **Hero Banner**: Full-width image with category title (56px, white text)
- **Article Grid**: Responsive grid (1 col mobile, 2-3 cols desktop)
- **Pagination**: Bottom navigation

#### Article Page Layout
- **Hero Image**: Full-width with title overlay
- **Content**: Max-width 800px, centered
- **Body Text**: 16px, regular, line-height 19.2px
- **Related Articles**: Grid below content

### Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 768px | Single column, stacked layout |
| Tablet | 768px - 1024px | 2 columns for article grids |
| Desktop | 1024px - 1920px | 3-4 columns for article grids |
| Large Desktop | > 1920px | Max-width container, centered |

### Container System

```html
<!-- Main Container -->
<div class="max-w-[1920px] mx-auto px-8 pb-24">
  <!-- Content -->
</div>

<!-- Article Container -->
<div class="max-w-[800px] mx-auto px-8">
  <!-- Article Content -->
</div>

<!-- Section Container -->
<section class="max-w-[1904px] mx-auto px-8">
  <!-- Section Content -->
</section>
```

---

## CSS/Tailwind Mappings

### Typography

```css
/* H1 - Hero/Article Title */
.text-[56px] { font-size: 56px; }
.font-bold { font-weight: 700; }
.leading-[56px] { line-height: 56px; }
.tracking-[-1.41634px] { letter-spacing: -1.41634px; }

/* H2 - Section Headings */
.text-2xl { font-size: 24px; }
.font-medium { font-weight: 500; }
.leading-[28.8px] { line-height: 28.8px; }
.tracking-[-0.621127px] { letter-spacing: -0.621127px; }

/* H3 - Subsection Headings */
.text-[28px] { font-size: 28px; }
.leading-[33.6px] { line-height: 33.6px; }
.tracking-[-0.516056px] { letter-spacing: -0.516056px; }

/* H4 - Small Headings */
.text-sm { font-size: 14px; }
.leading-[21px] { line-height: 21px; }

/* Body Standard */
.text-base { font-size: 16px; }
.font-normal { font-weight: 400; }
.leading-6 { line-height: 24px; }

/* Body Article Content */
.leading-[19.2px] { line-height: 19.2px; }

/* Large Body */
.text-[32px] { font-size: 32px; }
.leading-[38.4px] { line-height: 38.4px; }
.tracking-[-0.552113px] { letter-spacing: -0.552113px; }
```

### Colors

```css
/* Background */
.bg-white { background-color: #FFFFFF; }

/* Text */
.text-black { color: #000000; }
.text-[#696969] { color: #696969; } /* Muted text */

/* Borders */
.border-[#E5E7EB] { border-color: #E5E7EB; }
```

### Spacing

```css
/* Container */
.max-w-[1920px] { max-width: 1920px; }
.max-w-[800px] { max-width: 800px; }
.max-w-[1904px] { max-width: 1904px; }

/* Padding */
.px-8 { padding-left: 32px; padding-right: 32px; }
.py-12 { padding-top: 48px; padding-bottom: 48px; }
.pb-24 { padding-bottom: 96px; }

/* Margin */
.mx-auto { margin-left: auto; margin-right: auto; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.mt-12 { margin-top: 48px; }
```

### Border Radius

```css
.rounded-[16px] { border-radius: 16px; }
.rounded-[32px] { border-radius: 32px; }
```

---

## Motion & Transitions

### Transitions

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Opacity | 150ms | ease-in-out | Hover states, image overlays |
| Transform | 200ms | ease-in-out | Card hovers, button interactions |
| Color | 150ms | ease-in-out | Link hovers, text color changes |

### Animation Patterns

**Hover States:**
- Links: Underline on hover (150ms transition)
- Cards: Slight opacity change (0.9) on image
- Buttons: Underline or opacity change

**Tailwind Classes:**
```html
<!-- Hover Transition -->
<a href="..." class="transition-all duration-150 ease-in-out hover:underline">
  Link Text
</a>

<!-- Card Hover -->
<article class="group cursor-pointer">
  <img src="..." class="transition-opacity duration-150 ease-in-out group-hover:opacity-90" />
</article>
```

---

## Component Examples

### Article Card (Featured)

```tsx
<article className="group cursor-pointer rounded-[32px] overflow-hidden">
  <Link href="/article">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover transition-opacity duration-150 ease-in-out group-hover:opacity-90"
      />
    </div>
    <div className="p-6">
      <Link
        href={`/category/${category}`}
        className="text-sm font-bold text-[#696969] hover:underline"
      >
        {category}
      </Link>
      <h3 className="text-[28px] font-bold leading-[33.6px] tracking-[-0.516056px] mt-2 group-hover:underline">
        {title}
      </h3>
      <div className="text-base font-normal text-[#696969] mt-2">
        By {author} • {readTime} min read
      </div>
    </div>
  </Link>
</article>
```

### Article Card (Standard)

```tsx
<article className="group cursor-pointer rounded-[32px] overflow-hidden">
  <Link href="/article">
    <div className="relative aspect-[4/3] overflow-hidden">
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="object-cover"
      />
    </div>
    <div className="p-6">
      <Link
        href={`/category/${category}`}
        className="text-sm font-bold text-[#696969] hover:underline"
      >
        {category}
      </Link>
      <h2 className="text-2xl font-medium leading-[28.8px] tracking-[-0.621127px] mt-2 group-hover:underline">
        {title}
      </h2>
      <div className="text-base font-normal text-[#696969] mt-2">
        By {author} • {readTime} min read
      </div>
    </div>
  </Link>
</article>
```

### Navigation

```tsx
<header className="w-full bg-white">
  <div className="flex items-center justify-between h-[146px] px-8 max-w-[1920px] mx-auto">
    <Link href="/" className="flex items-center">
      <Image src="/logo.svg" alt="Match Moments" width={120} height={40} />
    </Link>
    <nav className="flex items-center gap-4">
      <Link href="/videos" className="text-base font-normal text-black hover:underline transition-all duration-150">
        Videos
      </Link>
      <Link href="/podcasts" className="text-base font-normal text-black hover:underline transition-all duration-150">
        Podcasts
      </Link>
      <button className="text-base font-normal text-black hover:underline transition-all duration-150">
        Menu
      </button>
    </nav>
  </div>
</header>
```

### Article Hero Section

```tsx
<div className="relative w-full h-[600px]">
  <Image
    src={heroImage}
    alt={title}
    fill
    className="object-cover"
  />
  <div className="absolute inset-0 bg-black/40 flex items-end">
    <div className="max-w-[800px] mx-auto px-8 pb-8 w-full">
      <h1 className="text-[56px] font-bold leading-[56px] tracking-[-1.41634px] text-white">
        {title}
      </h1>
      <div className="text-base font-normal text-white/90 mt-4">
        By {author} • {date} • {readTime} min read
      </div>
    </div>
  </div>
</div>
```

---

## Implementation Notes

1. **Font**: Use Inter from Google Fonts as GT America alternative, or purchase GT America license
2. **Images**: All images should maintain aspect ratios, use Next.js Image component with `fill` or explicit dimensions
3. **Links**: All text links should be black, no underlines by default, underline on hover
4. **Hover States**: Subtle opacity changes (0.9) or underlines with 150ms transitions
5. **Border Radius**: Use 32px for large cards, 16px for small cards
6. **Spacing**: Use 4px base unit, generous whitespace between sections (32px-96px)
7. **Typography**: Use negative letter-spacing for large headings (56px, 28px)
8. **Container**: Use max-width 1920px for main container, 800px for article content
9. **Responsive**: Mobile-first approach, single column on mobile, 2-3 columns on desktop
10. **Colors**: Strictly black and white with subtle grays for metadata

---

## Accessibility

- **Color Contrast**: Black on white = 21:1 (excellent, exceeds WCAG AAA)
- **Semantic HTML**: Use proper semantic elements (article, header, nav, main, footer)
- **Alt Text**: Provide descriptive alt text for all images
- **Focus States**: Maintain visible focus states for keyboard navigation
- **Heading Hierarchy**: Use proper heading hierarchy (h1 → h2 → h3, etc.)
- **ARIA Labels**: Use ARIA labels for icon-only buttons
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible

---

## Responsive Design

### Mobile (< 768px)
- Single column layout
- Stacked navigation (hamburger menu)
- Full-width images
- Reduced padding (16px instead of 32px)
- Smaller font sizes (adjust text-size-modifier)

### Tablet (768px - 1024px)
- 2 columns for article grids
- Horizontal navigation
- Standard padding (24px)
- Standard font sizes

### Desktop (> 1024px)
- 3-4 columns for article grids
- Full navigation menu
- Maximum padding (32px)
- Full font sizes

### Large Desktop (> 1920px)
- Max-width container (1920px) centered
- Maintain 3-4 columns
- Maximum spacing

---

## Next.js 16 Specific Notes

1. **Image Component**: Use Next.js Image component with `fill` for responsive images
2. **Font Loading**: Use `next/font` for optimal font loading (Inter or GT America)
3. **CSS Modules**: Use Tailwind CSS classes, no need for CSS modules
4. **Server Components**: Prefer Server Components for static content
5. **Client Components**: Use 'use client' only for interactive components
6. **Metadata**: Use Next.js metadata API for SEO

---

*Last Updated: December 12, 2025*
*Based on: The Ringer (theringer.com)*
