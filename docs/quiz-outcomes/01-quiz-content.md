# Cuidance quiz content

Source of truth for every quiz screen: wording, answer choices, helper text, progress labels and buttons. Copied from the team's Figma **Cuidance Quiz Outcomes Board**, page "03 Quiz at a glance" (which matches prototype v3).

## Rules for building quiz screens

- Use the wording on this page exactly. Do not add, remove, reword or reorder answer choices.
- Use the progress label exactly as written (for example "Getting started · 2 of 4"). Each section counts on its own.
- Show helper text only where this page lists it. If a screen has no helper text here, show none.
- Every quiz screen has **Help** and **Save and exit** at the top.
- Buttons: **Next question** and **Back**, except the last screen of a section, which uses **Continue** and **Back**.
- "Choose one" = pick one. "Choose up to N" = pick up to N. "Select all that apply" = pick any number.
- If something you need is not on this page, stop and ask. Do not invent it.
- If this page and the Figma board ever differ, the Figma board wins. Flag the difference.

## Flow

1. Everyone answers U1 to U4 (Getting started).
2. Anyone who picks "I'm not sure yet" on U1 sees N1 and N2 (Finding a start).
3. Then only the care areas picked in U1 (Skin care, Hair care, Makeup, Body care, Products and ingredients), in that order.

## Open decision

- **U3 wording.** The prototype says "...exploring the products or routines you selected?" The Week 7 wireframes say "...exploring the areas you picked?" This page uses the prototype wording until the team decides (see the board's "13 Decisions" page).

---

## Getting started (everyone)

### U1
- Progress: Getting started · 1 of 4
- Question: What would you like help exploring today?
- Instruction: Select all that apply.
- Choices: Hair care · Skin care · Makeup · Body care · Products and ingredients · I'm not sure yet
- Helper text: none
- Buttons: Next question · Back

### U2
- Progress: Getting started · 2 of 4
- Question: What would you like to do today?
- Instruction: Choose one.
- Choices: Learn more about my needs · Find products to explore · Understand a product or ingredient · Compare a few options · I'm not sure yet
- Helper text: Not sure is okay. We'll help you find a place to start.
- Buttons: Next question · Back

### U3
- Progress: Getting started · 3 of 4
- Question: How confident do you feel exploring the products or routines you selected?
- Instruction: Choose a number from 1 to 5.
- Choices (each label is written exactly like this): "1 · Not confident yet", "2 · A little confident", "3 · Somewhat confident", "4 · Mostly confident", "5 · Very confident"
- Helper text: There's no right answer. This only changes how much Cuidance explains.
- Buttons: Next question · Back

### U4
- Progress: Getting started · 4 of 4
- Question: How can Cuidance support you?
- Instruction: Choose up to 3.
- Choices: Keep things simple · Explain unfamiliar terms · Explain why something may fit · Help me compare options · Help me understand ingredients · Include products I already use · Give me space to explore · Something else
- Helper text: none
- Buttons: Continue · Back

## Finding a start (only after "I'm not sure yet")

### N1
- Progress: Finding a start
- Question: That's okay. What are you hoping to figure out?
- Instruction: Choose one.
- Choices: I need help choosing where to start · I want to learn about a product or ingredient · I want to understand what may work for me · I want to compare a few options · I'm still figuring it out
- Helper text: There's no wrong answer. You can change this later.
- Buttons: Continue · Back

### N2
- Progress: Finding a start
- Question: Here are a few places to start.
- Instruction: Pick one to explore. You can switch anytime.
- Choices: Hair care · Skin care · Makeup · Body care · Products and ingredients · Browse education
- Helper text: You can also skip ahead and explore on your own.
- Buttons: Continue · Back

## Skin care (if picked)

### S1
- Progress: Skin care · 1 of 3
- Question: How does your skin usually feel by midday?
- Instruction: Choose one.
- Choices: Tight or dry · Comfortable · Shiny in some areas · Shiny all over · It changes depending on the day · I'm still figuring it out
- Helper text: Describe how it usually feels. Cuidance doesn't scan or analyze skin.
- Buttons: Next question · Back

### S2
- Progress: Skin care · 2 of 3
- Question: How would you describe your skin's sensitivity?
- Instruction: Choose one. This question is optional.
- Choices: Very sensitive · Sometimes sensitive · Not usually sensitive
- Helper text: This is your own description, not a diagnosis. You can edit or remove it in Profile.
- Buttons: Next question · Back

### S3
- Progress: Skin care · 3 of 3
- Question: What would you like help with most?
- Instruction: Choose up to 2.
- Choices: Moisture and dryness · Cleansing · Fragrance preferences · Texture or finish · Keeping my routine simple · Understanding products or ingredients · I'm not sure yet
- Helper text: none
- Buttons: Continue · Back

## Hair care (if picked)

### H1
- Progress: Hair care · 1 of 3
- Question: How would you describe your hair texture?
- Instruction: Choose one.
- Choices: Straight · Wavy · Curly · Coily · A mix of textures
- Helper text: none
- Buttons: Next question · Back

### H2
- Progress: Hair care · 2 of 3
- Question: What would you like help with most?
- Instruction: Choose up to 2.
- Choices: Moisture and dryness · Definition · Frizz and manageability · Cleansing and wash-day care · Styling · Heat or color-treated care · I'm not sure yet
- Helper text: none
- Buttons: Next question · Back

### H3
- Progress: Hair care · 3 of 3
- Question: How do you usually wear or style your hair?
- Instruction: Select all that apply.
- Choices: Natural texture · Heat-styled · Protective styles · Color-treated · I change it up
- Helper text: none
- Buttons: Continue · Back

## Makeup (if picked)

### M1
- Progress: Makeup · 1 of 4
- Question: What kind of makeup are you exploring?
- Instruction: Select all that apply.
- Choices: Complexion or base · Eyes · Brows · Cheeks · Lips · Full makeup look · Makeup techniques · Product and ingredient education
- Helper text: none
- Buttons: Next question · Back

### M2
- Progress: Makeup · 2 of 4
- Question: What would you like help with most?
- Instruction: Choose up to 2.
- Choices: Building an everyday look · Finding shades or colors · Choosing coverage or finish · Learning application techniques · Comparing products · Creating a look for an event · Understanding ingredients
- Helper text: none
- Buttons: Next question · Back

### M3
- Progress: Makeup · 3 of 4
- Question: What kind of look are you interested in?
- Instruction: Choose one. Examples explain terms; none is better.
- Choices: Light and natural · Buildable · Medium coverage · Full coverage · Matte finish · Radiant finish · I'm exploring different options
- Helper text: none
- Buttons: Next question · Back

### M4
- Progress: Makeup · 4 of 4
- Question: What matters most to you when exploring makeup?
- Instruction: Choose up to 3.
- Choices: Easy to use · Comfortable to wear · Long-lasting · Simple to remove · A natural-looking finish · A specific color or shade · Product and ingredient information · Something else
- Helper text: none
- Buttons: Continue · Back

## Body care (if picked)

### B1
- Progress: Body care · 1 of 3
- Question: What kind of body care are you exploring?
- Instruction: Select all that apply.
- Choices: Cleansing and moisture · Deodorant or antiperspirant · Fragrance · Hands and feet · Nail care · Body-care products · Body-care ingredients
- Helper text: none
- Buttons: Next question · Back

### B2
- Progress: Body care · 2 of 3
- Question: What would you like help with today?
- Instruction: Choose one.
- Choices: Learn about body care · Find a body-care product to explore · Understand a body-care ingredient · Compare body-care products · Learn about deodorant or antiperspirant · Learn about nail care · I'm not sure yet
- Helper text: none
- Buttons: Next question · Back

### B3
- Progress: Body care · 3 of 3
- Question: What matters most to you?
- Instruction: Choose up to 3.
- Choices: Fragrance-free · A specific scent · Simple to use · Comfortable to use · Quick to absorb · Products I already use · No strong preference · Something else
- Helper text: none
- Buttons: Continue · Back

## Products and ingredients (if picked)

### P1
- Progress: Products and ingredients · 1 of 3
- Question: What would you like to explore?
- Instruction: Select all that apply.
- Choices: A product I'm considering · A product I already own · Comparing products · Understanding what is in a product
- Helper text: none
- Buttons: Next question · Back

### P2
- Progress: Products and ingredients · 2 of 3
- Question: What would you like help with today?
- Instruction: Choose one.
- Choices: Look up a product · Understand what is in a product · Compare product options · Learn how to read a product label · I'm not sure yet
- Helper text: none
- Buttons: Next question · Back

### P3
- Progress: Products and ingredients · 3 of 3
- Question: What information would be most useful?
- Instruction: Choose up to 3.
- Choices: Key ingredients · What the product is made for · Product texture or finish · Fragrance information · How to read the label · Other product notes · No strong preference
- Helper text: none
- Buttons: Continue · Back
