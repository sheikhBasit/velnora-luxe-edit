import { sql, ensureSchema } from "./db.js";

async function run() {
  await ensureSchema();
  
  console.log("Seeding blog and tutorial...");

  // Insert a blog post with product embed
  await sql`
    insert into blogs (id, type, title, slug, category, excerpt, cover_image, content, prerequisites, steps, published)
    values (
      'blog-1',
      'blog',
      'The Ultimate Base: Achieving a Flawless Canvas',
      'flawless-canvas-base',
      'makeup',
      'A deep dive into skin preparation and the perfect foundation routine.',
      '/assets/products/makeup-1.jpg',
      '<h2>The Art of the Base</h2><p>Building a flawless base is less about the coverage and more about how you prepare the canvas underneath. Start with a freshly cleansed face, apply a hydrating serum, and lock it in with a rich moisturizer.</p><p>Once your skin is prepped, it''s time for foundation. Our absolute favorite for an undetectable, skin-like finish is the Canvas Foundation.</p><p>{{product:the-canvas-foundation}}</p><p>Apply it with a damp beauty sponge or a dense brush for maximum control. Remember, you want your skin to look like skin—just elevated.</p>',
      '{}',
      '[]',
      true
    )
    on conflict (id) do nothing;
  `;

  // Insert a tutorial with product embed
  await sql`
    insert into blogs (id, type, title, slug, category, excerpt, cover_image, content, prerequisites, steps, published)
    values (
      'tutorial-1',
      'tutorial',
      'How to Achieve the Signature Maison Glow',
      'signature-maison-glow',
      'skincare',
      'Step-by-step guide to our signature radiant skin look.',
      '/assets/products/skincare-1.jpg',
      '',
      ARRAY['Hydrating Serum', 'The Canvas Foundation', 'LumiOne LED Mask'],
      '[
        {
          "title": "Prep with LED Therapy",
          "instructions": "<p>Start your routine by using an LED mask for 10 minutes to reduce inflammation and boost collagen production. We highly recommend this device for professional-grade results at home:</p><p>{{product:lumione-led-mask}}</p>"
        },
        {
          "title": "Apply Serum",
          "instructions": "<p>Press a few drops of hydrating serum into damp skin to lock in moisture.</p>"
        },
        {
          "title": "Perfect the Base",
          "instructions": "<p>Blend out your foundation using the Atelier Brush Set for a seamless, airbrushed finish.</p><p>{{product:atelier-brush-set}}</p>"
        }
      ]'::jsonb,
      true
    )
    on conflict (id) do nothing;
  `;

  console.log("Seeding complete.");
}

run().catch(console.error);
