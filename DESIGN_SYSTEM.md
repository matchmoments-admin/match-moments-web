# Match Moments Design System
## Minimalist Black & White Aesthetic

This document contains the complete design system for Match Moments sports website. The design features a clean, minimalist aesthetic with Inter typography and a sophisticated monochromatic black and white color palette inspired by Design Milk and The Ringer.

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
| Foreground (Text) | `#000000` | `rgb(0, 0, 0)` | `0 0% 0%` | Primary text, logo |
| Muted Text | `#6B7280` | `rgb(107, 116, 128)` | `220 9% 46%` | Secondary text, metadata |
| Light Gray | `#F3F4F6` | `rgb(243, 244, 246)` | `220 14% 96%` | Subtle backgrounds |
| Border | `#E5E7EB` | `rgb(229, 231, 235)` | `214 14% 91%` | Borders, dividers |

### Semantic Colors

| Semantic | Hex | Usage |
|---------|-----|-------|
| Primary | `#000000` | Primary actions, buttons, logo |
| Secondary | `#F3F4F6` | Secondary backgrounds, cards |
| Muted | `#6B7280` | Muted text, metadata |
| Hover | `#F9FAFB` | Hover states on white backgrounds |
| Destructive | `#DC2626` | Error states (used sparingly) |

### Color Palette Philosophy
- **Pure Minimalism**: Strictly black and white with subtle grays
- **No Color Accents**: Zero brand colors - monochromatic only
- **High Contrast**: Black text on white backgrounds (21:1 ratio)
- **Subtle Grays**: Used only for metadata, borders, and hover states
- **Content is Color**: Sports images provide all visual color

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

### 1. Sticky Header Component

**Structure:**
- Logo: Left-aligned, green circle with "THE RINGER" text
- "Discover anything" button: Rounded pill button with search icon
- Search button: Icon button
- Navigation: Videos link (with icon), Podcasts link (with icon)
- Hamburger menu button: Three horizontal lines icon (right-aligned)

**Behavior:**
- Initial state: Static positioning at page top
- Scroll behavior: Transforms to fixed position on scroll down
- Sticky state: Adds subtle shadow, remains at top while scrolling
- Transition: Smooth 200ms ease transition

**Styling:**
- Background: White (#FFFFFF)
- Height: Auto (content-based, approximately 64-80px)
- Border: None initially, subtle shadow when sticky
- Font: 16px, weight 400 for links
- Padding: 16px 32px
- Z-index: 50 (above content)

**Sticky State Shadow:**
- `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05)`

**Tailwind Classes:**
```html
<header class="sticky top-0 z-50 w-full bg-white transition-shadow duration-200 [&.scrolled]:shadow-md">
  <div class="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-8">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2">
      <div class="h-8 w-8 rounded-full bg-green-500"></div>
      <span class="text-lg font-bold">MATCH MOMENTS</span>
    </a>
    
    <!-- Search Button (Discover) -->
    <button class="rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200">
      <span>Discover</span> <span class="font-bold">anything</span>
    </button>
    
    <!-- Navigation -->
    <nav class="flex items-center gap-6">
      <a href="/videos" class="flex items-center gap-2 text-base font-normal hover:underline">
        <svg class="h-5 w-5"><!-- Video icon --></svg>
        Videos
      </a>
      <a href="/podcasts" class="flex items-center gap-2 text-base font-normal hover:underline">
        <svg class="h-5 w-5"><!-- Podcast icon --></svg>
        Podcasts
      </a>
      <button class="text-base font-normal">
        <svg class="h-6 w-6"><!-- Menu icon --></svg>
      </button>
    </nav>
  </div>
</header>
```

### 2. Sidebar Navigation (Hamburger Menu)

**Structure:**
- Overlay: Full-screen semi-transparent black overlay
- Sidebar panel: Slides in from right side
- Close button: Circular X button (top right, white on black)
- Menu sections with arrow indicators
- Icon-based media links at bottom

**Behavior:**
- Opens: Slides in from right with 300ms ease animation
- Closes: Slides out to right
- Background overlay: Fades in/out with panel
- Body scroll: Locked when open

**Styling:**
- Panel background: Black (#000000)
- Text color: White (#FFFFFF)
- Width: 400px (desktop), 85% (mobile)
- Height: 100vh
- Border radius: 16px on left edge only
- Padding: 24px
- Z-index: 100

**Menu Items:**
- Font size: 32px for main items, 20px for sub-items
- Line height: 1.2
- Spacing: 24px between items
- Hover: Slight opacity change (0.8)

**Icons:**
- Podcasts: Orange circular icon
- Videos: Blue circular icon
- Size: 24px

**Tailwind Classes:**
```html
<!-- Overlay -->
<div class="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300">
  <!-- Sidebar Panel -->
  <div class="fixed right-0 top-0 h-full w-[400px] rounded-l-2xl bg-black p-6 transition-transform duration-300">
    <!-- Close Button -->
    <button class="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
      <svg class="h-6 w-6"><!-- X icon --></svg>
    </button>
    
    <!-- Menu -->
    <nav class="mt-16 space-y-6">
      <a href="/sports" class="flex items-center justify-between text-3xl font-bold text-white hover:opacity-80">
        <span>Sports</span>
        <svg class="h-6 w-6"><!-- Arrow right --></svg>
      </a>
      <a href="/pop-culture" class="flex items-center justify-between text-3xl font-bold text-white hover:opacity-80">
        <span>Pop Culture</span>
        <svg class="h-6 w-6"><!-- Arrow right --></svg>
      </a>
      <a href="/topics" class="flex items-center justify-between text-3xl font-bold text-white hover:opacity-80">
        <span>All Topics</span>
        <svg class="h-6 w-6"><!-- Arrow right --></svg>
      </a>
      
      <div class="my-8 border-t border-white/20"></div>
      
      <a href="/podcasts" class="flex items-center gap-4 text-xl font-medium text-white hover:opacity-80">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
          <svg class="h-6 w-6"><!-- Podcast icon --></svg>
        </div>
        <span>Podcasts</span>
      </a>
      <a href="/videos" class="flex items-center gap-4 text-xl font-medium text-white hover:opacity-80">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
          <svg class="h-6 w-6"><!-- Video icon --></svg>
        </div>
        <span>Videos</span>
      </a>
    </nav>
  </div>
</div>
```

### 3. Navigation Pills (Horizontal Scroll)

**Structure:**
- Horizontal scrollable container
- Pill-shaped buttons
- No visible scrollbar
- Smooth scrolling

**Styling:**
- Button background: White
- Text color: Black
- Border: 1px solid #E5E7EB
- Border radius: 24px (fully rounded pill)
- Padding: 8px 16px
- Font size: 14px
- Font weight: 400
- Gap between pills: 8px

**States:**
- Default: White background, black text
- Hover: Gray background (#F5F5F6)
- Active: Black background, white text

**Tailwind Classes:**
```html
<div class="no-scrollbar flex gap-2 overflow-x-auto">
  <button class="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
    The Latest
  </button>
  <button class="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
    NBA
  </button>
  <button class="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
    NFL
  </button>
  <!-- Active state -->
  <button class="whitespace-nowrap rounded-full bg-black px-4 py-2 text-sm font-normal text-white">
    Year in Review
  </button>
</div>
```

### 4. Hero Carousel Component

**Structure:**
- Full-width container
- Large image background
- Gradient overlay (black to transparent, bottom to top)
- Content overlay (bottom-aligned)
- Category badge
- Title (large, white text)
- Metadata (podcast name, duration, date)
- Play button (centered, for media content)
- Navigation dots (bottom center)
- Prev/next arrows (left/right edges)

**Sizing:**
- Height: 600-700px (desktop), 400px (mobile)
- Aspect ratio: ~16:9
- Image: Object-fit cover

**Gradient Overlay:**
- `background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)`

**Navigation:**
- Dots: 8px circles, white with 50% opacity, active is 100% opacity
- Arrows: 40px circular buttons, white background, black icon
- Arrow position: Absolute, left/right 24px, centered vertically

**Tailwind Classes:**
```html
<div class="relative h-[600px] w-full overflow-hidden bg-black">
  <!-- Image -->
  <img src="..." alt="..." class="h-full w-full object-cover" />
  
  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
  
  <!-- Play Button (for media) -->
  <button class="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 hover:bg-white">
    <svg class="h-8 w-8 text-black"><!-- Play icon --></svg>
  </button>
  
  <!-- Content -->
  <div class="absolute bottom-0 left-0 right-0 p-8">
    <div class="mx-auto max-w-[1920px]">
      <span class="inline-block rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white">
        Movies
      </span>
      <h2 class="mt-4 text-[56px] font-bold leading-[56px] tracking-[-1.41634px] text-white">
        The Best Performances of 2025
      </h2>
      <p class="mt-2 text-base font-normal text-white/90">
        The Big Picture • 2 hr 25 min
      </p>
    </div>
  </div>
  
  <!-- Navigation Arrows -->
  <button class="absolute left-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black hover:bg-gray-100">
    <svg class="h-6 w-6"><!-- Left arrow --></svg>
  </button>
  <button class="absolute right-6 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black hover:bg-gray-100">
    <svg class="h-6 w-6"><!-- Right arrow --></svg>
  </button>
  
  <!-- Navigation Dots -->
  <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
    <button class="h-2 w-2 rounded-full bg-white"></button>
    <button class="h-2 w-2 rounded-full bg-white/50"></button>
    <button class="h-2 w-2 rounded-full bg-white/50"></button>
  </div>
</div>
```

### 5. Article Card Variants

**Common Characteristics:**
- No shadows (flat design)
- Clean, minimal aesthetic
- Images are clickable
- Entire card is clickable
- Hover effects: Image opacity change or title underline
- Background: White
- Text: Black primary, #696969 for metadata

#### A. Featured Hero Card

**Use:** Homepage hero section, top featured articles

**Specifications:**
- **Image**: Full-width, aspect ratio 16:9 or 4:3
- **Category Badge**: 14px, bold, gray (#696969) text, positioned above image or on image
- **Title**: 28px, bold (700), line-height 33.6px, letter-spacing -0.516056px
- **Meta**: 16px, regular (400), "By Author • X min read", gray color
- **Border Radius**: 32px
- **Padding**: 24px internal padding
- **Hover**: Title underlines, image opacity to 90%

**Tailwind:**
```html
<article class="group cursor-pointer overflow-hidden rounded-[32px] bg-white">
  <a href="/article" class="block">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src="..." alt="..." class="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-90" />
    </div>
    <div class="p-6">
      <span class="text-sm font-bold text-[#696969]">Category</span>
      <h3 class="mt-2 text-[28px] font-bold leading-[33.6px] tracking-[-0.516056px] group-hover:underline">
        Article Title Here
      </h3>
      <div class="mt-2 text-base font-normal text-[#696969]">
        By Author Name • 10 min read
      </div>
    </div>
  </a>
</article>
```

#### B. Standard Article Card

**Use:** Article grids, category pages, "Latest" section

**Specifications:**
- **Image**: Full-width, aspect ratio 4:3 or 16:9
- **Category**: 14px, bold, gray color, small text above title
- **Title**: 24px, medium (500), line-height 28.8px, letter-spacing -0.621127px
- **Meta**: 16px, regular, "By Author • Date • X min read"
- **Border Radius**: 32px
- **Padding**: 24px
- **Hover**: Title underlines

**Tailwind:**
```html
<article class="group cursor-pointer overflow-hidden rounded-[32px] bg-white">
  <a href="/article" class="block">
    <div class="relative aspect-[4/3] overflow-hidden">
      <img src="..." alt="..." class="h-full w-full object-cover" />
    </div>
    <div class="p-6">
      <span class="text-sm font-bold text-[#696969]">NBA</span>
      <h2 class="mt-2 text-2xl font-medium leading-[28.8px] tracking-[-0.621127px] group-hover:underline">
        Game Analysis Title
      </h2>
      <div class="mt-2 text-base font-normal text-[#696969]">
        By Author • Dec. 10 • 7 min read
      </div>
    </div>
  </a>
</article>
```

#### C. List View Card (Horizontal)

**Use:** Sidebar lists, "Noteworthy Reads" sections, compact article listings

**Specifications:**
- **Layout**: Horizontal (image left, content right) or text-only
- **Image**: Optional thumbnail, 120x120px or similar
- **Category**: 14px, bold, gray
- **Title**: 24px, medium (500), line-height 1.2
- **Meta**: 16px, regular, author and date
- **Border Radius**: 16px
- **Padding**: 16px
- **Spacing**: Compact, efficient use of space

**Tailwind (with thumbnail):**
```html
<article class="group cursor-pointer overflow-hidden rounded-2xl bg-white">
  <a href="/article" class="flex gap-4">
    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
      <img src="..." alt="..." class="h-full w-full object-cover" />
    </div>
    <div class="flex-1">
      <span class="text-sm font-bold text-[#696969]">Category</span>
      <h3 class="mt-1 text-xl font-medium group-hover:underline">
        Article Title
      </h3>
      <div class="mt-1 text-sm text-[#696969]">
        By Author • Dec. 10
      </div>
    </div>
  </a>
</article>
```

**Tailwind (text-only):**
```html
<article class="group">
  <a href="/article" class="block py-3 text-base font-normal hover:underline">
    Article Title Goes Here
  </a>
</article>
```

#### D. Podcast/Video Card

**Use:** Podcast sections, video galleries, media content

**Specifications:**
- **Image**: Square or 16:9 podcast artwork/video thumbnail
- **Play Button**: Centered overlay, white background, black icon
- **Duration Badge**: Top right, "1:30:00" format, semi-transparent black background
- **Category Icon**: Small icon badge (orange for podcasts, blue for videos)
- **Title**: 20-24px, medium weight
- **Show Name**: 16px, regular, gray
- **Date & Duration**: 14px, gray
- **Border Radius**: 16-24px
- **Hover**: Play button scales slightly

**Tailwind:**
```html
<article class="group cursor-pointer overflow-hidden rounded-3xl bg-white">
  <a href="/episode" class="block">
    <!-- Thumbnail with Play Button -->
    <div class="relative aspect-video overflow-hidden">
      <img src="..." alt="..." class="h-full w-full object-cover" />
      
      <!-- Duration Badge -->
      <div class="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-xs font-medium text-white">
        1:30:00
      </div>
      
      <!-- Play Button -->
      <div class="absolute inset-0 flex items-center justify-center">
        <button class="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110">
          <svg class="h-6 w-6 text-black"><!-- Play icon --></svg>
        </button>
      </div>
    </div>
    
    <!-- Content -->
    <div class="p-4">
      <div class="flex items-center gap-2">
        <div class="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500">
          <svg class="h-4 w-4 text-white"><!-- Podcast icon --></svg>
        </div>
        <span class="text-sm font-bold text-[#696969]">Podcasts</span>
      </div>
      <h3 class="mt-2 text-xl font-medium group-hover:underline">
        Episode Title Goes Here
      </h3>
      <div class="mt-2 text-base text-[#696969]">
        The Show Name
      </div>
      <div class="mt-1 text-sm text-[#696969]">
        Dec. 10 • 1 hr 30 min
      </div>
    </div>
  </a>
</article>
```

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

### 6. Section Headers

**Use:** Dividing major content sections on homepage and category pages

**Specifications:**
- **Heading Size**: 24-32px depending on importance
- **Font Weight**: Bold (700)
- **Color**: Black (#000000)
- **Spacing**: 32-48px margin top, 24px margin bottom
- **Optional "View All" Link**: Right-aligned, 16px, with arrow icon
- **Underline**: None (clean, minimal)

**Variants:**

**Large Section Header (Homepage):**
```html
<div class="mb-8 flex items-center justify-between">
  <h2 class="text-3xl font-bold">The Latest</h2>
  <a href="/archive" class="flex items-center gap-2 text-base font-normal hover:underline">
    View All
    <svg class="h-4 w-4"><!-- Arrow right icon --></svg>
  </a>
</div>
```

**Medium Section Header:**
```html
<div class="mb-6">
  <h3 class="text-2xl font-bold">Noteworthy Reads</h3>
</div>
```

**With Description:**
```html
<div class="mb-8">
  <h2 class="text-3xl font-bold">The Best of 2025</h2>
  <p class="mt-2 text-base text-[#696969]">
    Our favorite sports moments from the year
  </p>
</div>
```

### 7. Noteworthy Reads List

**Use:** Simple link lists, featured article collections, sidebar content

**Specifications:**
- **Layout**: Vertical list, no images
- **Link Style**: Simple text links
- **Font Size**: 16px
- **Font Weight**: Regular (400)
- **Color**: Black (#000000)
- **Line Height**: 1.5 (24px)
- **Spacing**: 12-16px between items
- **Hover**: Underline
- **Divider**: Optional subtle border between items

**Tailwind:**
```html
<div class="rounded-2xl bg-gray-50 p-6">
  <h3 class="mb-4 text-xl font-bold">Noteworthy Reads</h3>
  <ul class="space-y-3">
    <li>
      <a href="/article-1" class="text-base font-normal hover:underline">
        A Tier-by-Tier Look at the Oscars' Best Picture Contenders
      </a>
    </li>
    <li>
      <a href="/article-2" class="text-base font-normal hover:underline">
        Will the Thunder's Dominance Clog Up the NBA Trade Market?
      </a>
    </li>
    <li>
      <a href="/article-3" class="text-base font-normal hover:underline">
        Should You Go All In for Giannis? History Screams No.
      </a>
    </li>
    <li>
      <a href="/article-4" class="text-base font-normal hover:underline">
        The Ringer's Week 15 Fantasy Football Rankings
      </a>
    </li>
  </ul>
</div>
```

**Alternative (with dividers):**
```html
<div>
  <h3 class="mb-6 text-2xl font-bold">Noteworthy Reads</h3>
  <ul class="divide-y divide-gray-200">
    <li class="py-3">
      <a href="/article-1" class="text-base font-normal hover:underline">
        Article Title One
      </a>
    </li>
    <li class="py-3">
      <a href="/article-2" class="text-base font-normal hover:underline">
        Article Title Two
      </a>
    </li>
  </ul>
</div>
```

### 8. Article Page Hero

**Use:** Top section of individual article pages

**Specifications:**
- **Layout**: Full-width hero image with content overlay
- **Height**: 500-700px (responsive)
- **Image**: Object-fit cover, full width
- **Gradient**: Black gradient from bottom (70% opacity) to transparent at top
- **Title Position**: Bottom-aligned, with padding
- **Title Size**: 56px, bold (700)
- **Title Letter Spacing**: -1.41634px (tight)
- **Title Color**: White (#FFFFFF)
- **Category Badge**: Small rounded badge above title
- **Meta Info**: Author, date, read time below title, white text with 90% opacity

**Gradient:**
```css
background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);
```

**Tailwind:**
```html
<div class="relative h-[600px] w-full">
  <!-- Hero Image -->
  <img 
    src="..." 
    alt="Article title" 
    class="h-full w-full object-cover"
  />
  
  <!-- Gradient Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
  
  <!-- Content -->
  <div class="absolute bottom-0 left-0 right-0 p-8 pb-12">
    <div class="mx-auto max-w-[800px]">
      <!-- Category Badge -->
      <span class="inline-block rounded-full bg-blue-500 px-3 py-1 text-sm font-bold text-white">
        NBA
      </span>
      
      <!-- Title -->
      <h1 class="mt-4 text-[56px] font-bold leading-[56px] tracking-[-1.41634px] text-white">
        Will the Thunder's Dominance Clog Up the NBA Trade Market?
      </h1>
      
      <!-- Metadata -->
      <div class="mt-4 flex items-center gap-2 text-base font-normal text-white/90">
        <span>By Kirk Goldsberry</span>
        <span>•</span>
        <span>Dec. 10</span>
        <span>•</span>
        <span>7 min read</span>
      </div>
    </div>
  </div>
</div>
```

**Mobile Variant (smaller title):**
```html
<div class="relative h-[400px] w-full">
  <img src="..." alt="..." class="h-full w-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
  <div class="absolute bottom-0 left-0 right-0 p-4 pb-6">
    <span class="inline-block rounded-full bg-blue-500 px-2 py-1 text-xs font-bold text-white">
      NBA
    </span>
    <h1 class="mt-2 text-3xl font-bold leading-tight tracking-tight text-white">
      Article Title Here
    </h1>
    <div class="mt-2 text-sm text-white/90">
      By Author • Dec. 10 • 7 min
    </div>
  </div>
</div>
```

### 9. Buttons & CTAs

**Philosophy:** Minimal, clean design. Most buttons are text-based or have subtle backgrounds.

**Button Variants:**

#### A. Primary Button (Rare, for key actions)
- **Background**: Black (#000000)
- **Text**: White (#FFFFFF)
- **Border Radius**: 24px (pill-shaped)
- **Padding**: 12px 24px
- **Font**: 16px, regular (400)
- **Hover**: Slight opacity (95%)

```html
<button class="rounded-full bg-black px-6 py-3 text-base font-normal text-white hover:bg-black/95">
  Subscribe Now
</button>
```

#### B. Secondary Button (Most common)
- **Background**: White or light gray (#F5F5F6)
- **Text**: Black (#000000)
- **Border**: Optional 1px solid #E5E7EB
- **Border Radius**: 24px
- **Padding**: 8px 16px
- **Hover**: Gray background (#F5F5F6)

```html
<button class="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-normal text-black hover:bg-gray-100">
  Read More
</button>
```

#### C. Text Button (Links disguised as buttons)
- **Background**: None
- **Text**: Black
- **Font**: 16px, regular
- **Hover**: Underline

```html
<button class="text-base font-normal text-black hover:underline">
  Learn More
</button>
```

#### D. Icon Button
- **Background**: None or subtle gray
- **Size**: 40x40px
- **Border Radius**: 50% (circular) or 8px (rounded square)
- **Hover**: Background color change

```html
<!-- Circular -->
<button class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100">
  <svg class="h-5 w-5"><!-- Icon --></svg>
</button>

<!-- Rounded Square -->
<button class="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100">
  <svg class="h-5 w-5"><!-- Icon --></svg>
</button>
```

#### E. Play Button (Media)
- **Background**: White with 90% opacity
- **Size**: 56x56px (large), 40x40px (small)
- **Border Radius**: 50% (circular)
- **Icon**: Black play triangle
- **Hover**: 100% opacity, slight scale (1.1)

```html
<button class="group flex h-14 w-14 items-center justify-center rounded-full bg-white/90 transition-all hover:scale-110 hover:bg-white">
  <svg class="h-6 w-6 text-black">
    <!-- Play triangle icon -->
  </svg>
</button>
```

### 10. Special Project Badge

**Use:** Highlighting special editorial projects or collections

**Specifications:**
- **Background**: Dark (black or dark gray) or colored
- **Text**: "Special Project" in white or contrasting color
- **Font Size**: 12px
- **Font Weight**: Bold (700)
- **Padding**: 6px 12px
- **Border Radius**: 4px
- **Position**: Top-left of card or inline with title

```html
<span class="inline-block rounded bg-black px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
  Special Project
</span>
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

## Icon System

### Library
- **react-icons** (v5.3.0) - Single icon library for entire project
- Access 50+ icon sets: Material Design, Ionicons, Bootstrap Icons, Font Awesome, etc.
- Browse icons: https://react-icons.github.io/react-icons/

### Icon Usage

#### Sports Icons (Material Design)
```tsx
import { MdSportsSoccer, MdSportsBasketball, MdSportsTennis } from 'react-icons/md';

<MdSportsSoccer className="h-12 w-12" />
<MdSportsBasketball className="h-12 w-12" />
```

#### UI Icons (Ionicons 5)
```tsx
import { IoSearchOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

<IoSearchOutline className="h-6 w-6" />
<IoMenuOutline className="h-6 w-6" />
```

#### Using Centralized Icons
```tsx
import { ICONS } from '@/lib/sport-icons';

<ICONS.search />
<ICONS.flame />
<ICONS.trophy />
```

### Icon Mapping

| Purpose | Icon | Import |
|---------|------|--------|
| Soccer | MdSportsSoccer | react-icons/md |
| Basketball | MdSportsBasketball | react-icons/md |
| Tennis | MdSportsTennis | react-icons/md |
| Cricket | MdSportsCricket | react-icons/md |
| NFL/Football | MdSportsFootball | react-icons/md |
| Rugby | MdSportsRugby | react-icons/md |
| Search | IoSearchOutline | react-icons/io5 |
| Menu | IoMenuOutline | react-icons/io5 |
| Close | IoCloseOutline | react-icons/io5 |
| Video | IoVideocamOutline | react-icons/io5 |
| Microphone | IoMicOutline | react-icons/io5 |
| Play | IoPlayOutline | react-icons/io5 |
| Flame/Trending | BsFireFlame | react-icons/bs |
| Trophy | BsTrophy | react-icons/bs |

### Icon Sizing
- **Inline**: h-4 w-4 (16px)
- **Navigation**: h-6 w-6 (24px)
- **Cards**: h-8 w-8 (32px)
- **Hero/Large**: h-12 w-12 (48px)

### Icon Colors
- Use `text-current` to inherit parent color
- Use `className="text-black"` for specific colors
- Event-specific colors: yellow (cards), red (red cards)

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
*Icons: react-icons v5.3.0*
